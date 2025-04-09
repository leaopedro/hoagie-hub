import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HoagiesModule } from './hoagies/hoagies.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [AuthModule, UsersModule, HoagiesModule, CommentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
