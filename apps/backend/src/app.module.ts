import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HoagiesModule } from './hoagies/hoagies.module';
import { CommentsModule } from './comments/comments.module';
import { AuthMiddleware } from './common/middleware/auth.middleware';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/hoagie-hub'),
    AuthModule,
    UsersModule,
    HoagiesModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: 'auth/(.*)', method: RequestMethod.ALL }) // skip auth routes
      .forRoutes('*');
  }
}
