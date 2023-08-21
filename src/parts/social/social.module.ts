import { Module } from '@nestjs/common';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';
import { AuthService } from '../auth/auth.service';


@Module({
    controllers: [SocialController],
    providers: [SocialService, AuthService]
})
export class SocialModule {}