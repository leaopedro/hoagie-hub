import { Test, TestingModule } from '@nestjs/testing';
import { HoagiesService } from './hoagies.service';
import { getModelToken } from '@nestjs/mongoose';
import { Hoagie } from './schemas/hoagie.schema';
import { Model, Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

const mockHoagieModel = () => ({
  create: jest.fn(),
  aggregate: jest.fn(),
  countDocuments: jest.fn(),
});

type MockModel<T = any> = {
  [key in keyof ReturnType<typeof mockHoagieModel>]: jest.Mock;
};

describe('HoagiesService', () => {
  let service: HoagiesService;
  let hoagieModel: MockModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HoagiesService,
        {
          provide: getModelToken(Hoagie.name),
          useFactory: mockHoagieModel,
        },
      ],
    }).compile();

    service = module.get<HoagiesService>(HoagiesService);
    hoagieModel = module.get(getModelToken(Hoagie.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a hoagie with creator ID', async () => {
      const dto = { name: 'Test Hoagie', ingredients: ['Cheese'] };
      const userId = 'user123';
      const expected = { ...dto, creator: userId };

      hoagieModel.create.mockResolvedValue(expected);

      const result = await service.create(dto, userId);
      expect(hoagieModel.create).toHaveBeenCalledWith(expected);
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should return hoagies with pagination and total count', async () => {
      const mockData = [{ name: 'One' }];
      hoagieModel.aggregate.mockResolvedValue(mockData);
      hoagieModel.countDocuments.mockResolvedValue(1);

      const result = await service.findAll(10, 0);
      expect(hoagieModel.aggregate).toHaveBeenCalled();
      expect(hoagieModel.countDocuments).toHaveBeenCalled();
      expect(result).toEqual({ data: mockData, total: 1 });
    });
  });

  describe('findOneById', () => {
    it('should throw if invalid ID', async () => {
      await expect(service.findOneById('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw if hoagie not found', async () => {
      hoagieModel.aggregate.mockResolvedValue([]);
      const id = new Types.ObjectId().toHexString();

      await expect(service.findOneById(id)).rejects.toThrow(NotFoundException);
    });

    it('should return a hoagie if found', async () => {
      const hoagie = { _id: new Types.ObjectId(), name: 'Found Hoagie' };
      hoagieModel.aggregate.mockResolvedValue([hoagie]);

      const result = await service.findOneById(hoagie._id.toString());
      expect(result).toEqual(hoagie);
    });
  });
});
