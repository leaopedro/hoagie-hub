import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { getModelToken } from '@nestjs/mongoose';
import { Comment } from './schemas/comment.schema';

describe('CommentsService', () => {
  let service: CommentsService;

  const mockQuery = {
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockResolvedValue([]),
  };

  const model = {
    create: jest.fn(),
    find: jest.fn(() => mockQuery),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getModelToken(Comment.name),
          useValue: model,
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a comment with text, hoagie, and user', async () => {
      const dto = { hoagieId: 'h123', text: 'Nice sandwich' };
      const userId = 'u456';
      const expected = { text: dto.text, hoagie: dto.hoagieId, user: userId };

      model.create.mockResolvedValue(expected);

      const result = await service.create(dto, userId);

      expect(model.create).toHaveBeenCalledWith(expected);
      expect(result).toEqual(expected);
    });
  });

  describe('findByHoagie', () => {
    it('should query by hoagieId and return comments sorted with user populated', async () => {
      const hoagieId = 'hoagie123';
      const mockComments = [
        { text: 'First!', user: { name: 'Pedro', email: 'p@example.com' } },
      ];

      mockQuery.sort.mockResolvedValue(mockComments);

      const result = await service.findByHoagie(hoagieId);

      expect(model.find).toHaveBeenCalledWith({ hoagie: hoagieId });
      expect(mockQuery.populate).toHaveBeenCalledWith('user', '_id name email');
      expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockComments);
    });
  });
});
