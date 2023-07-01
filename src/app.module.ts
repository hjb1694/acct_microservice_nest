import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './parts/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from './db/database.config';
import { GlobalModule } from './util/global.module';

@Module({
  imports: [
    GlobalModule,
    AuthModule, 
    ConfigModule.forRoot({isGlobal: true}), 
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], 
      useClass: DatabaseConfiguration, 
      inject: [ConfigService]
    }), GlobalModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
