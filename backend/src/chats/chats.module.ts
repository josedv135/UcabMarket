import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { AuthModule } from '../auth/auth.module';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [AuthModule, ProductsModule, UsersModule],
  controllers: [ChatsController],
  providers: [ChatsService, ChatsGateway],
  exports: [ChatsService],
})
export class ChatsModule {}
