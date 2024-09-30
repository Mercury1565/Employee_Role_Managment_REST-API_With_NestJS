import { Injectable, NotFoundException, BadRequestException  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Position } from '../entities/position.entity';
// import { CUDPositionResponse, GetPositionResponse, GetPositionsResponse, ChildrenResponse } from 'src/entities/response.entity';
import { CreatePositionDto } from './dtos/create_position.dto';
import { UpdatePositionDto } from './dtos/update_position.dto';

@Injectable()
export class PositionService {
    constructor(
        @InjectRepository(Position)
        private readonly positionRepository: Repository<Position>,
    ) {}

    async createPosition(createPositionDto: CreatePositionDto): Promise<Position> {
        const position = this.positionRepository.create(createPositionDto)
        await this.positionRepository.insert(position);
        return position;
    }

    async findAllPositions(): Promise<Position[]> {
        const positions = await this.positionRepository.find();
        return positions
    }

    async findPositionById(id: string): Promise<Position> {
        const position =  await this.positionRepository.findOne({
            where: { id },
            relations: ['parent', 'children'],
            });

        if (!position) {
            throw new NotFoundException('position not found');
        }

        return position
    }  

    async findPositionChildrenById(id: string): Promise<Position[]> {
        const children = await this.positionRepository.find({
            where: { parentId: id },
        });
        return children;
    }

    async updatePosition(id: string, updatePositionDto: UpdatePositionDto): Promise<Position> {
        const position = await this.positionRepository.findOne({
            where: { id },
        });

        const parentPosition = await this.positionRepository.findOne({
            where: { id: updatePositionDto.parentId },
        });

        if (!position) {
            throw new NotFoundException('position not found');
        }
        if (!parentPosition) {
            throw new NotFoundException('parent position not found');
        }
        if (updatePositionDto.parentId && updatePositionDto.parentId === id) {
            throw new BadRequestException('circular parentship not allowed')
        }

        await this.positionRepository.update(id, updatePositionDto);
        return {...position, ...updatePositionDto}
    }

    async removePosition(id: string): Promise<Position> {
        const positionToDelete = await this.positionRepository.findOne({
            where: { id }
        });
    
        if (!positionToDelete) {
            throw new Error('position not found');
        }

        // update the positions with parentId === id and remove position
        await this.positionRepository.update({parentId: id}, {parentId: positionToDelete.parentId})
        await this.positionRepository.delete(id);

        return positionToDelete;
    }
}
