/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  UseGuards,
  Post,
  Body,
  Req,
  Get,
  Param,
  Put,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { IncidentsService } from './incidents.service';

@Controller('incidents')
@UseGuards(JwtAuthGuard)
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Post()
  create(@Body() createIncidentDto: CreateIncidentDto, @Req() req) {
    return this.incidentsService.create(createIncidentDto, req.user.userId);
  }

  // Soporte para PATCH desde clientes que usan patch semantics
  @Patch(':id')
  patchUpdate(
    @Param('id') id: string,
    @Body() updateIncidentDto: UpdateIncidentDto,
    @Req() req,
  ) {
    // Reuse the same validation as PUT
    if (updateIncidentDto.assignedTo) {
      if (!req.user || req.user.role !== 'admin') {
        return { error: 'Solo un administrador puede asignarse un incidente.' };
      }
      if (updateIncidentDto.assignedTo !== req.user.userId) {
        return {
          error: 'Solo puedes asignarte a ti mismo como administrador.',
        };
      }
    }
    return this.incidentsService.update(id, updateIncidentDto);
  }

  @Get()
  findAll(@Query() filter: { status?: string }) {
    return this.incidentsService.findAll(filter);
  }

  @Get('stats')
  getStats(@Req() req, @Query() filter: { createdBy?: string }) {
    // Si el usuario no es admin, forzamos createdBy al userId del token
    const requesterRole = req.user?.role;
    const requesterId = req.user?.userId;

    let createdBy: string | undefined = undefined;
    if (requesterRole && requesterRole !== 'admin') {
      createdBy = requesterId;
    } else if (filter?.createdBy) {
      createdBy = filter.createdBy;
    }

    return this.incidentsService.getIncidentStats(createdBy);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.incidentsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateIncidentDto: UpdateIncidentDto,
    @Req() req,
  ) {
    // Validar que solo admin puede asignarse un incidente
    if (updateIncidentDto.assignedTo) {
      if (!req.user || req.user.role !== 'admin') {
        return { error: 'Solo un administrador puede asignarse un incidente.' };
      }
      // Solo permitir que el admin se asigne a sí mismo
      if (updateIncidentDto.assignedTo !== req.user.userId) {
        return {
          error: 'Solo puedes asignarte a ti mismo como administrador.',
        };
      }
    }
    return this.incidentsService.update(id, updateIncidentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.incidentsService.remove(id);
  }
}
