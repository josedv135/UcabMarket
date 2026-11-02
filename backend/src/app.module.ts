import { Module } from '@nestjs/common';
import { PersistenceModule } from './persistence/persistence.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { QuestionsModule } from './questions/questions.module';
import { ChatsModule } from './chats/chats.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    PersistenceModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    QuestionsModule,
    ChatsModule,
    ReviewsModule,
  ],
})
export class AppModule {}
