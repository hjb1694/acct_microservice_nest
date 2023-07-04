import { Module } from '@nestjs/common';
import { UserPointsController } from './user_points.controller';
import { UserPointsService } from './user_points.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPoints } from 'src/db/entities/UserPoints.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserPoints])
    ],
    controllers: [UserPointsController], 
    providers: [UserPointsService]
})
export class UserPointsModule {}