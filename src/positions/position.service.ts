import { Injectable, NotFoundException, BadRequestException  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Position } from '../entities/position.entity';
import { CUDPositionResponse, GetPositionResponse, GetPositionsResponse, ChildrenResponse } from 'src/entities/response.entity';
import { CreatePositionDto } from './dtos/create_position.dto';
import { UpdatePositionDto } from './dtos/update_position.dto';

@Injectable()
export class PositionService {
    constructor(
        @InjectRepository(Position)
        private readonly positionRepository: Repository<Position>,
    ) {}

    async createPosition(createPositionDto: CreatePositionDto): Promise<CUDPositionResponse> {
        const position = this.positionRepository.create(createPositionDto);

        if (createPositionDto.parentId) {
            const parentPosition = await this.positionRepository.findOne({ 
                where: { id: createPositionDto.parentId } 
            });

            if (!parentPosition) {
                throw new BadRequestException('parent position not found');
            }

            position.parent = parentPosition;
        }

        const savedPosition = await this.positionRepository.save(position);
        return { message: 'position created successfully', position: savedPosition };
    }

    async findAllPositions(): Promise<GetPositionsResponse> {
        const positions = await this.positionRepository.find({ 
            relations: ['parent', 'children'] 
        });
        return {positions: positions}
    }

    async findPositionById(id: string): Promise<GetPositionResponse> {
        const position =  await this.positionRepository.findOne({
            where: { id },
            relations: ['parent', 'children'],
            });

        if (!position) {
            throw new NotFoundException('position not found');
        }

        return {position: position}
    }  

    async findPositionChildrenById(id: string): Promise<ChildrenResponse> {
        const position = await this.positionRepository.findOne({
            where: { id },
            relations: ['children'],
        });

        if (!position) {
            throw new NotFoundException('position not found');
        }

        return {children: position.children};
    }

    async updatePosition(id: string, updatePositionDto: UpdatePositionDto): Promise<CUDPositionResponse> {
        const position = await this.positionRepository.findOne({
            where: { id },
            relations: ['parent', 'children'],
        });

        const parentPosition = await this.positionRepository.findOne({
            where: { id: updatePositionDto.parentId },
            relations: ['parent', 'children'],
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

        if (updatePositionDto.name) {
            position.name = updatePositionDto.name;
        }
        if (updatePositionDto.parentId) {
            position.parent.id = updatePositionDto.parentId;
        }
        if (updatePositionDto.description) {
            position.description = updatePositionDto.description;
        }

        const updatedPosition = await this.positionRepository.save(position);
        return {message: "position updated successfully", position: updatedPosition}
    }

    async removePosition(id: string): Promise<CUDPositionResponse> {
        const positionToDelete = await this.positionRepository.findOne({
            where: { id },
            relations: ['parent', 'children'],
        });
    
        if (!positionToDelete) {
            throw new Error('position not found');
        }
    
        if (positionToDelete.children.length > 0) {
            const grandParent = positionToDelete.parent;
    
            // if grandparent exists, reassign children to the grandparent. Or else assign null
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
    
        await this.positionRepository.delete(id);
        return {message: "position deleted successfully", position: positionToDelete};
    }
}
