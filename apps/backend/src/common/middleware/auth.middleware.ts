import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) throw new UnauthorizedException('Missing x-user-id header');

    const user = await this.userModel.findById(userId);
    if (!user) throw new UnauthorizedException('Invalid user');

    req.user = user;
    next();
  }
}
