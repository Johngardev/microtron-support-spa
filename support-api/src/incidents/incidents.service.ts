import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, FilterQuery } from 'mongoose';
import { Incident, IncidentDocument } from './schemas/incident.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { IncidentStatus } from './schemas/incident.schema';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { IncidentPriority } from './schemas/incident.schema';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectModel(Incident.name) private incidentModel: Model<IncidentDocument>,
  ) {}

  async create(
    createIncidentDto: CreateIncidentDto,
    userId: string,
  ): Promise<Incident> {
    const lastIncident = await this.incidentModel
      .findOne()
      .sort({ createdAt: -1 })
      .exec();

    let nextCode = 'INC-1001';
    if (lastIncident) {
      const lastNumber = parseInt(lastIncident.code.split('-')[1]);
      nextCode = `INC-${lastNumber + 1}`;
    }

    // Normalize priority values so API accepts English values like 'high'/'medium'/'low'
    const normalizedDto: Partial<CreateIncidentDto> = { ...createIncidentDto };
    if (typeof normalizedDto.priority === 'string') {
      const mapped = this.mapPriority(normalizedDto.priority);
      if (mapped) normalizedDto.priority = mapped;
    }

    const createdIncident = new this.incidentModel({
      ...normalizedDto,
      code: nextCode,
      createdBy: userId,
      status: IncidentStatus.OPEN,
    });

    return createdIncident.save();
  }

  /**
   * Map incoming priority strings (English or Spanish) to the stored Spanish enum.
   * Returns undefined when no mapping found so existing validation can handle it.
   */
  private mapPriority(value: string): IncidentPriority | undefined {
    if (!value) return undefined;
    const v = value.trim().toLowerCase();
    switch (v) {
      case 'high':
      case 'alta':
      case 'a':
        return IncidentPriority.HIGH;
      case 'medium':
      case 'med':
      case 'media':
      case 'm':
        return IncidentPriority.MEDIUM;
      case 'low':
      case 'baja':
      case 'b':
        return IncidentPriority.LOW;
      default:
        return undefined;
    }
  }

  async findAll(filter: { status?: string } = {}): Promise<Incident[]> {
    const query: FilterQuery<IncidentDocument> = {};
    if (filter.status) {
      query.status = filter.status;
    }
    return this.incidentModel
      .find(query)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Incident> {
    const incident = await this.incidentModel
      .findById(id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .exec();

    if (!incident) {
      throw new NotFoundException(`Incident ${id} not found`);
    }
    return incident;
  }

  async update(
    id: string,
    updateIncidentDto: UpdateIncidentDto,
  ): Promise<Incident> {
    const normalizedDto: Partial<UpdateIncidentDto> = { ...updateIncidentDto };
    if (typeof normalizedDto.priority === 'string') {
      const mapped = this.mapPriority(normalizedDto.priority);
      if (mapped) normalizedDto.priority = mapped;
    }

    const existingIncident = await this.incidentModel
      .findByIdAndUpdate(id, normalizedDto, { new: true })
      .exec();

    if (!existingIncident) {
      throw new NotFoundException(`Incident ${id} not found`);
    }

    return existingIncident;
  }

  async remove(id: string): Promise<void> {
    const result = await this.incidentModel.deleteOne({ _id: id }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Incident ${id} not found`);
    }
  }

  async getIncidentStats(createdBy?: string) {
    // Build a base query to optionally scope counts to a specific creator
    const baseQuery: FilterQuery<IncidentDocument> = {};
    if (createdBy) {
      baseQuery.createdBy = createdBy;
    }

    const [total, open, closed, inProgress, resolved] = await Promise.all([
      this.incidentModel.countDocuments({ ...baseQuery }).exec(),
      this.incidentModel
        .countDocuments({ ...baseQuery, status: IncidentStatus.OPEN })
        .exec(),
      this.incidentModel
        .countDocuments({ ...baseQuery, status: IncidentStatus.CLOSED })
        .exec(),
      this.incidentModel
        .countDocuments({ ...baseQuery, status: IncidentStatus.IN_PROGRESS })
        .exec(),
      this.incidentModel
        .countDocuments({ ...baseQuery, status: IncidentStatus.RESOLVED })
        .exec(),
    ]);

    return {
      total,
      open,
      closed,
      inProgress,
      resolved,
    };
  }
}
