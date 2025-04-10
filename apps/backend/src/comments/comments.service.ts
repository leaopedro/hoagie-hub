import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>
  ) {}

  async create(dto: CreateCommentDto, userId: string) {
    return this.commentModel.create({
      text: dto.text,
      hoagie: dto.hoagieId,
      user: userId,
    });
  }

  async findByHoagie(hoagieId: string) {
    return this.commentModel
      .find({ hoagie: hoagieId })
      .populate('user', '_id name email')
      .sort({ createdAt: -1 });
  }
}
