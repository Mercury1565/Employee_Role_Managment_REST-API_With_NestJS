import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PositionService } from './position.service';
import { CreatePositionDto } from './dtos/create_position.dto';
import { UpdatePositionDto } from './dtos/update_position.dto';
import { Position } from 'src/entities/position.entity';
import { seedPositions } from './seed/positionSeed';

@Controller('positions')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Post('seed')
    async seedPositions() {
        await this.positionService.createPositions(seedPositions);
        return { message: 'positions seeded successfully' };
    }

  @Post()
  create(@Body() createPositionDto: CreatePositionDto): Promise<Position> {
    return this.positionService.createPosition(createPositionDto);
  }

  @Get()
  findAllPositions(): Promise<Position[]> {
    return this.positionService.findAllPositions();
  }

  @Get('tree')
  getEntirePositionHierarchy(): Promise<Position[]> {
    return this.positionService.findPositionTree(null);
  }

  @Get('tree/:id')
  getPositionHierarchy(@Param('id') id: string): Promise<Position[]> {
    return this.positionService.findPositionTree(id);
  }

  @Get(':id')
  findPositionById(@Param('id') id: string): Promise<Position> {
    return this.positionService.findPositionById(id);
  }

  @Get('children/:id')
  findPositionChildrenById(@Param('id') id: string): Promise<Position[]> {
    return this.positionService.findPositionChildrenById(id);
  }

  @Put(':id')
  updatePosition(@Param('id') id: string, @Body() updatePositionDto: UpdatePositionDto): Promise<Position> {
    return this.positionService.updatePosition(id, updatePositionDto);
  }

  @Delete(':id')
  removePosition(@Param('id') id: string): Promise<Position> {
    return this.positionService.removePosition(id);
  }
}
