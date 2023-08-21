import { Module } from '@nestjs/common';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';
import { AuthService } from '../auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import PersonalProfile from 'src/db/entities/PersonalProfile.entity';


@Module({
    imports: [
        TypeOrmModule.forFeature([
            PersonalProfile
        ])
    ],
    controllers: [SocialController],
    providers: [SocialService, AuthService]
})
export class SocialModule {}