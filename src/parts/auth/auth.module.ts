import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Account from 'src/db/entities/Account.entity';
import Persona from 'src/db/entities/Persona.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Persona])],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
