/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Session } from './schemas/session.schema';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionsService {
  private readonly CALENDLY_API_URL = 'https://api.calendly.com';
  private readonly CALENDLY_TOKEN = process.env.CALENDLY_TOKEN || '';

  constructor(
    @InjectModel(Session.name) private sessionModel: Model<Session>,
    private httpService: HttpService,
  ) {}

  private generateSessionId(): string {
    // Genera ID secuencial simple: S-001, S-002, etc.
    // Usa un número aleatorio de 3 dígitos (en producción, considerar usar contador en BD)
    const randomNum = Math.floor(Math.random() * 1000);
    return `S-${String(randomNum).padStart(3, '0')}`;
  }

  async create(createSessionDto: CreateSessionDto): Promise<Session> {
    const sessionId = this.generateSessionId();
    console.log('📋 Creando sesión con datos:', {
      id: sessionId,
      ...createSessionDto,
    });

    const session = new this.sessionModel({
      id: sessionId,
      ...createSessionDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedSession = await session.save();
    console.log('✅ Sesión guardada exitosamente:', savedSession);
    return savedSession;
  }

  async findAll(): Promise<Session[]> {
    return this.sessionModel.find().exec();
  }

  async findAllByStatus(status: 'Abierto' | 'Cerrado'): Promise<Session[]> {
    return this.sessionModel.find({ status }).exec();
  }

  async findById(id: string): Promise<Session> {
    const session = await this.sessionModel.findOne({ id }).exec();
    if (!session) {
      throw new HttpException('Sesión no encontrada', HttpStatus.NOT_FOUND);
    }
    return session;
  }

  async update(
    id: string,
    updateSessionDto: UpdateSessionDto,
  ): Promise<Session> {
    const session = await this.sessionModel
      .findOneAndUpdate(
        { id },
        { ...updateSessionDto, updatedAt: new Date() },
        { new: true },
      )
      .exec();

    if (!session) {
      throw new HttpException('Sesión no encontrada', HttpStatus.NOT_FOUND);
    }

    return session;
  }

  async delete(id: string): Promise<void> {
    const result = await this.sessionModel.deleteOne({ id }).exec();
    if (result.deletedCount === 0) {
      throw new HttpException('Sesión no encontrada', HttpStatus.NOT_FOUND);
    }
  }

  async getStats(): Promise<{ total: number; open: number; closed: number }> {
    const total = await this.sessionModel.countDocuments().exec();
    const open = await this.sessionModel
      .countDocuments({ status: 'Abierto' })
      .exec();
    const closed = await this.sessionModel
      .countDocuments({ status: 'Cerrado' })
      .exec();

    return { total, open, closed };
  }

  async createCalendlyEvent(
    sessionId: string,
    eventTypeUri: string,
    inviteeEmail: string,
    inviteeName: string,
  ): Promise<{ eventUri: string; inviteeUri: string }> {
    try {
      // Create scheduled event on Calendly
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.CALENDLY_API_URL}/scheduled_events`,
          {
            event_type: eventTypeUri,
            invitee: {
              email: inviteeEmail,
              name: inviteeName,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${this.CALENDLY_TOKEN}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      const { uri: eventUri } = response.data;

      // Update session with Calendly event URI
      await this.sessionModel
        .findOneAndUpdate(
          { id: sessionId },
          {
            calendlyEventUri: eventUri,
            calendlyInviteeUri: response.data.invitee?.uri,
            updatedAt: new Date(),
          },
        )
        .exec();

      return {
        eventUri,
        inviteeUri: response.data.invitee?.uri || '',
      };
    } catch (error) {
      throw new HttpException(
        `Error al crear evento en Calendly: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async cancelCalendlyEvent(sessionId: string): Promise<void> {
    try {
      const session = await this.findById(sessionId);

      if (!session.calendlyEventUri) {
        throw new HttpException(
          'No hay evento de Calendly asociado',
          HttpStatus.BAD_REQUEST,
        );
      }

      await firstValueFrom(
        this.httpService.delete(session.calendlyEventUri, {
          headers: {
            Authorization: `Bearer ${this.CALENDLY_TOKEN}`,
          },
        }),
      );

      await this.sessionModel
        .findOneAndUpdate(
          { id: sessionId },
          {
            calendlyEventUri: null,
            calendlyInviteeUri: null,
            updatedAt: new Date(),
          },
        )
        .exec();
    } catch (error) {
      throw new HttpException(
        `Error al cancelar evento en Calendly: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getCalendlyEventDetails(eventUri: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(eventUri, {
          headers: {
            Authorization: `Bearer ${this.CALENDLY_TOKEN}`,
          },
        }),
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        `Error al obtener detalles del evento: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
