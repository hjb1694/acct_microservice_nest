import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Account from 'src/db/entities/Account.entity';
import Persona from 'src/db/entities/Persona.entity';
import Vericode from 'src/db/entities/Vericode.entity';
import PersonalPersonaProfile from 'src/db/entities/PersonalPersonaProfile.entity';
import { UserPoints } from 'src/db/entities/UserPoints.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Account, 
      Persona, 
      Vericode, 
      PersonalPersonaProfile, 
      UserPoints
    ])
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
