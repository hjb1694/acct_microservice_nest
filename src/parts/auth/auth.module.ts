import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Account from 'src/db/entities/Account.entity';
import Vericode from 'src/db/entities/Vericode.entity';
import PersonalProfile from 'src/db/entities/PersonalProfile.entity';
import { UserPoints } from 'src/db/entities/UserPoints.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Account, 
      Vericode, 
      PersonalProfile, 
      UserPoints
    ])
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
