import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userModel: {
    findOne: jest.Mock;
    create: jest.Mock;
  };

  beforeEach(async () => {
    userModel = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: userModel,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should create a new user if email is not taken', async () => {
      const dto = { email: 'test@test.com', name: 'Test' };
      const mockUser = { _id: '123', ...dto };

      userModel.findOne.mockResolvedValue(null);
      userModel.create.mockResolvedValue(mockUser);

      const result = await service.signup(dto);
      expect(userModel.findOne).toHaveBeenCalledWith({ email: dto.email });
      expect(userModel.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException if email is already used', async () => {
      userModel.findOne.mockResolvedValue({ email: 'test@test.com' });

      await expect(
        service.signup({ email: 'test@test.com', name: 'Already Used' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should return user if email exists', async () => {
      const dto = { email: 'login@test.com' };
      const mockUser = { _id: '456', email: dto.email, name: 'Tester' };

      userModel.findOne.mockResolvedValue(mockUser);

      const result = await service.login(dto);
      expect(userModel.findOne).toHaveBeenCalledWith({ email: dto.email });
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      userModel.findOne.mockResolvedValue(null);

      await expect(
        service.login({ email: 'missing@test.com' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
