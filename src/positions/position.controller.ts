import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PositionService } from './position.service';
import { CreatePositionDto } from './dtos/create_position.dto';
import { Position } from '../entities/position.entity';
import { UpdatePositionDto } from './dtos/update_position.dto';
import { CUDPositionResponse, GetPositionResponse, GetPositionsResponse, ChildrenResponse } from 'src/entities/response.entity';

@Controller('positions')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Post()
  create(@Body() createPositionDto: CreatePositionDto): Promise<CUDPositionResponse> {
    return this.positionService.createPosition(createPositionDto);
  }

  @Get()
  findAllPositions(): Promise<GetPositionsResponse> {
    return this.positionService.findAllPositions();
  }

  @Get(':id')
  findPositionById(@Param('id') id: string): Promise<GetPositionResponse> {
    return this.positionService.findPositionById(id);
  }

  @Get('children/:id')
  findPositionChildrenById(@Param('id') id: string): Promise<ChildrenResponse> {
    return this.positionService.findPositionChildrenById(id);
  }

  @Put(':id')
  updatePosition(@Param('id') id: string, @Body() updatePositionDto: UpdatePositionDto): Promise<CUDPositionResponse> {
    return this.positionService.updatePosition(id, updatePositionDto);
  }

  @Delete(':id')
  removePosition(@Param('id') id: string): Promise<CUDPositionResponse> {
    return this.positionService.removePosition(id);
  }
}
