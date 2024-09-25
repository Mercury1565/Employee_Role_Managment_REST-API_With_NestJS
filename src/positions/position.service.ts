import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Position } from '../entities/position.entity';
import { CreatePositionDto } from './dtos/create_position.dto';
import { UpdatePositionDto } from './dtos/update_position.dto';

@Injectable()
export class PositionService {
    constructor(
        @InjectRepository(Position)
        private readonly positionRepository: Repository<Position>,
    ) {}

    async createPosition(createPositionDto: CreatePositionDto): Promise<Position> {
        const position = this.positionRepository.create(createPositionDto);

        if (createPositionDto.parentId) {
            const parentPosition = await this.positionRepository.findOne({ where: { id: createPositionDto.parentId } });
            position.parent = parentPosition;
        }
        return this.positionRepository.save(position); 
    }

    async findAllPositions() {
        return this.positionRepository.find({ relations: ['parent', 'children'] });
    }

    async findPositionById(id: string) {
        return this.positionRepository.findOne({
        where: { id },
        relations: ['parent', 'children'],
        });
    }  

    async findPositionChildrenById(id: string) {
        const position = await this.positionRepository.findOne({
            where: { id },
            relations: ['children'],
        });
        return position.children;
    }

    async updatePosition(id: string, updatePositionDto: UpdatePositionDto) {
        const position = await this.positionRepository.findOne({
            where: { id },
            relations: ['parent', 'children'],
            });

        if (updatePositionDto.name) {
            position.name = updatePositionDto.name;
        }

        if (updatePositionDto.parentId) {
            position.parent.id = updatePositionDto.parentId;
        }
        
        if (updatePositionDto.name) {
            position.name = updatePositionDto.name;
        }

        return this.positionRepository.save(position);
    }

    async removePosition(id: string) {
        const positionToDelete = await this.positionRepository.findOne({
            where: { id },
            relations: ['parent', 'children'],
        });
    
        if (!positionToDelete) {
            throw new Error('Position not found');
        }
    
        // if position has children, reassign them to the grandparent
        if (positionToDelete.children.length > 0) {
            const grandParent = positionToDelete.parent;
    
            if (grandParent) {
                for (const child of positionToDelete.children) {
                    child.parent = grandParent; 
                    await this.positionRepository.save(child);
                }
            } 
            else {
                for (const child of positionToDelete.children) {
                    child.parent = null; 
                    await this.positionRepository.save(child);
                }
            }
        }
    
        return this.positionRepository.delete(id);
    }
}
