import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Model } from 'mongoose';
import { Hoagie, HoagieDocument } from './schemas/hoagie.schema';
import { CreateHoagieDto } from './dto/create-hoagie.dto';

@Injectable()
export class HoagiesService {
  constructor(
    @InjectModel(Hoagie.name) private hoagieModel: Model<HoagieDocument>,
  ) {}

  async create(dto: CreateHoagieDto, userId: string): Promise<Hoagie> {
    return this.hoagieModel.create({ ...dto, creator: userId });
  }

  async findAll(limit = 10, offset = 0) {
    const [hoagies, total] = await Promise.all([
      this.hoagieModel.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'creator',
            foreignField: '_id',
            as: 'creator',
          },
        },
        { $unwind: '$creator' },
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'hoagie',
            as: 'comments',
          },
        },
        {
          $addFields: {
            commentCount: { $size: '$comments' },
          },
        },
        { $project: { comments: 0 } },
        { $skip: offset },
        { $limit: limit },
        { $sort: { createdAt: -1 } },
      ]),
      this.hoagieModel.countDocuments(),
    ]);

    return { data: hoagies, total };
  }

  async findOneById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid hoagie ID');
    }

    const hoagies = await this.hoagieModel.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'users',
          localField: 'creator',
          foreignField: '_id',
          as: 'creator',
        },
      },
      { $unwind: '$creator' },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'hoagie',
          as: 'comments',
        },
      },
      {
        $addFields: {
          commentCount: { $size: '$comments' },
        },
      },
      { $project: { comments: 0 } },
    ]);

    if (!hoagies[0]) throw new NotFoundException('Hoagie not found');
    return hoagies[0];
  }
}
