import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PositionService } from './position.service';
import { CreatePositionDto } from './dtos/create_position.dto';
import { Position } from '../entities/position.entity';
import { UpdatePositionDto } from './dtos/update_position.dto';

@Controller('positions')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Post()
  create(@Body() createPositionDto: CreatePositionDto): Promise<Position> {
    return this.positionService.createPosition(createPositionDto);
  }

  @Get()
  findAllPositions() {
    return this.positionService.findAllPositions();
  }

  @Get(':id')
  findPositionById(@Param('id') id: string) {
    return this.positionService.findPositionById(id);
  }

  @Get('children/:id')
  findPositionChildrenById(@Param('id') id: string) {
    return this.positionService.findPositionChildrenById(id);
  }

  @Put(':id')
  updatePosition(@Param('id') id: string, @Body() updatePositionDto: UpdatePositionDto) {
    return this.positionService.updatePosition(id, updatePositionDto);
  }

  @Delete(':id')
  removePosition(@Param('id') id: string) {
    return this.positionService.removePosition(id);
  }
}
