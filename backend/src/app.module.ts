import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { OffersModule } from './offers/offers.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { User } from './users/entities/user.entity';
import { Wish } from './wishes/entities/wish.entity';
import { Wishlist } from './wishlists/entities/wishlists.entity';
import { Offer } from './offers/entities/offer.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { HelpersModule } from './helpers/helpers.module';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        host: configService.get<string>('POSTGRES_HOST'),
        port: parseInt(configService.get<string>('POSTGRES_PORT')),
        username: configService.get<string>('POSTGRES_USER'),
        database: configService.get<string>('POSTGRES_DB'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        entities: [User, Wish, Wishlist, Offer],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    WishesModule,
    OffersModule,
    WishlistsModule,
    AuthModule,
    HelpersModule,
  ],
  providers: [],
})
export class AppModule {}
