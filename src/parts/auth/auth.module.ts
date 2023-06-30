import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/db/entities/User.entity';
import Persona from 'src/db/entities/Persona.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Persona])],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
