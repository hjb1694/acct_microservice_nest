import { Module } from '@nestjs/common';
import { UserPointsController } from './user_points.controller';
import { UserPointsService } from './user_points.service';

@Module({
    controllers: [UserPointsController], 
    providers: [UserPointsService]
})
export class UserPointsModule {}