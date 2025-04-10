import { Module } from '@nestjs/common';
import { HoagiesController } from './hoagies.controller';
import { HoagiesService } from './hoagies.service';

@Module({
  controllers: [HoagiesController],
  providers: [HoagiesService]
})
export class HoagiesModule {}
