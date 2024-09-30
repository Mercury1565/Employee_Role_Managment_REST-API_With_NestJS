import { Test, TestingModule } from '@nestjs/testing';
import { PositionController } from './position.controller';
import { PositionService } from './position.service';
import { CreatePositionDto } from './dtos/create_position.dto';
import { UpdatePositionDto } from './dtos/update_position.dto';
import { Position } from 'src/entities/position.entity';

describe('PositionController', () => {
  let positionController: PositionController;
  let positionService: PositionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PositionController],
      providers: [
        {
          provide: PositionService,
          useValue: {
            createPosition: jest.fn(),
            findPositionTree: jest.fn(),
            findAllPositions: jest.fn(),
            findPositionById: jest.fn(),
            findPositionChildrenById: jest.fn(),
            updatePosition: jest.fn(),
            removePosition: jest.fn(),
          },
        },
      ],
    }).compile();

    positionController = module.get<PositionController>(PositionController);
    positionService = module.get<PositionService>(PositionService);
  });

  describe('create', () => {
    it('should create a position', async () => {
        const createPositionDto: CreatePositionDto = { 
            name: 'Manager', 
            description: 'Manager Descripiton',
            parentId: null 
            };
        const newPosition: Position = {
            id: "test_id",
            name: 'Manager',
            description: 'Manager Descripiton',
            parentId: null, 
            parent: null,
            children: []
        }   

        const result = newPosition;
        jest.spyOn(positionService, 'createPosition').mockResolvedValue(result);

        expect(await positionController.create(createPositionDto)).toBe(result);
        expect(positionService.createPosition).toHaveBeenCalledWith(createPositionDto);
    });
  });

  describe('getEntirePositionHierarchy', () => {
    it('should return the entire position hierarchy', async () => {
      const result: Position[] = [
        {
          id: "1",
          name: 'Manager',
          description: 'Manager Description',
          parentId: null,
          parent: null,
          children: []
        }
      ];
  
      jest.spyOn(positionService, 'findPositionTree').mockResolvedValue(result);
  
      expect(await positionController.getEntirePositionHierarchy()).toBe(result);
      expect(positionService.findPositionTree).toHaveBeenCalledWith(null);
    });
  });
  
  describe('getPositionHierarchy', () => {
    it('should return the position hierarchy for a given id', async () => {
      const id = '1';
      const result: Position[] = [
        {
          id,
          name: 'Manager',
          description: 'Manager Description',
          parentId: null,
          parent: null,
          children: []
        }
      ];
  
      jest.spyOn(positionService, 'findPositionTree').mockResolvedValue(result);
  
      expect(await positionController.getPositionHierarchy(id)).toBe(result);
      expect(positionService.findPositionTree).toHaveBeenCalledWith(id);
    });
  });

  describe('findAllPositions', () => {
    it('should return all positions', async () => {
      const result = [];
      jest.spyOn(positionService, 'findAllPositions').mockResolvedValue(result);

      expect(await positionController.findAllPositions()).toBe(result);
    });
  });

  describe('findPositionById', () => {
    it('should return a position by id', async () => {
      const id = '1'; 
      const result: Position = { 
            id, 
            name: 'Manager', 
            description: 'Test Description',
            parentId: null,
            children: [],
            parent: null 
        };

      jest.spyOn(positionService, 'findPositionById').mockResolvedValue(result);

      expect(await positionController.findPositionById(id)).toBe(result);
      expect(positionService.findPositionById).toHaveBeenCalledWith(id);
    });
  });

  describe('findPositionChildrenById', () => {
    it('should return children of a position by id', async () => {
      const id = '1';
      const result = [];

      jest.spyOn(positionService, 'findPositionChildrenById').mockResolvedValue(result);

      expect(await positionController.findPositionChildrenById(id)).toBe(result);
      expect(positionService.findPositionChildrenById).toHaveBeenCalledWith(id);
    });
  });

  describe('updatePosition', () => {
    it('should update a position by id', async () => {
        const id = '1';
        const updatePositionDto: UpdatePositionDto = { 
            name: 'Updated Manager', 
            parentId: null 
        };
        const updatedPosition: Position = {
            id: "test_id",
            name: 'Manager',
            description: 'Manager Descripiton',
            parentId: null,
            parent: null, 
            children: []
        }   

        const result = updatedPosition;
        jest.spyOn(positionService, 'updatePosition').mockResolvedValue(result);

        expect(await positionController.updatePosition(id, updatePositionDto)).toBe(result);
        expect(positionService.updatePosition).toHaveBeenCalledWith(id, updatePositionDto);
        });
  });

  describe('removePosition', () => {
    it('should remove a position by id', async () => {
        const id = '1';
        const deletedPosition: Position = {
            id: "test_id",
            name: 'Manager',
            description: 'Manager Descripiton',
            parentId: null,
            parent: null, 
            children: []
        }   

        const result = deletedPosition;
        jest.spyOn(positionService, 'removePosition').mockResolvedValue(result);

        expect(await positionController.removePosition(id)).toBe(result);
        expect(positionService.removePosition).toHaveBeenCalledWith(id);
    });
  });
});
