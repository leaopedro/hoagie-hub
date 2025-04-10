import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HoagiesService } from './hoagies.service';
import { HoagiesController } from './hoagies.controller';
import { Hoagie, HoagieSchema } from './schemas/hoagie.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hoagie.name, schema: HoagieSchema }]),
  ],
  controllers: [HoagiesController],
  providers: [HoagiesService],
})
export class HoagiesModule {}
