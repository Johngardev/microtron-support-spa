import { PartialType } from '@nestjs/swagger';
import { CreateIncidentDto } from './create-incident.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { IncidentStatus } from '../schemas/incident.schema';

export class UpdateIncidentDto extends PartialType(CreateIncidentDto) {
  @IsEnum(IncidentStatus)
  @IsOptional()
  status?: string;

  @IsOptional()
  assignedTo?: string;
}
