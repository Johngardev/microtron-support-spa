import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Session } from './schemas/session.schema';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createSessionDto: CreateSessionDto): Promise<Session> {
    return this.sessionsService.create(createSessionDto);
  }

  @Get()
  findAll(@Query('status') status?: 'Abierto' | 'Cerrado'): Promise<Session[]> {
    if (status) {
      return this.sessionsService.findAllByStatus(status);
    }
    return this.sessionsService.findAll();
  }

  @Get('stats')
  getStats(): Promise<{ total: number; open: number; closed: number }> {
    return this.sessionsService.getStats();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<Session> {
    return this.sessionsService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSessionDto: UpdateSessionDto,
  ): Promise<Session> {
    return this.sessionsService.update(id, updateSessionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string): Promise<void> {
    return this.sessionsService.delete(id);
  }

  @Post(':id/calendly-event')
  @HttpCode(HttpStatus.CREATED)
  createCalendlyEvent(
    @Param('id') id: string,
    @Body()
    body: {
      eventTypeUri: string;
      inviteeEmail: string;
      inviteeName: string;
    },
  ): Promise<{ eventUri: string; inviteeUri: string }> {
    return this.sessionsService.createCalendlyEvent(
      id,
      body.eventTypeUri,
      body.inviteeEmail,
      body.inviteeName,
    );
  }

  @Delete(':id/calendly-event')
  @HttpCode(HttpStatus.NO_CONTENT)
  cancelCalendlyEvent(@Param('id') id: string): Promise<void> {
    return this.sessionsService.cancelCalendlyEvent(id);
  }

  @Get(':id/calendly-event/details')
  getCalendlyEventDetails(@Query('eventUri') eventUri: string): Promise<any> {
    return this.sessionsService.getCalendlyEventDetails(eventUri);
  }
}
