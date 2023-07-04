import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { UserPoints } from 'src/db/entities/UserPoints.entity';
import { DataSource } from 'typeorm';


@Injectable()
export class UserPointsService {

    constructor(
        @InjectDataSource()
        private dataSource: DataSource
    ){}

    async addPoints(value: number, userId: number){

        await this.dataSource
        .getRepository(UserPoints)
        .createQueryBuilder('user_points')
        .update(UserPoints)
        .set({
            maxLifetimePoints: () => `max_lifetime_points + ${+value}`, 
            currentPoints: () => `current_points + ${+value}`, 
            redeemablePoints: () => `redeemable_points + ${value}`
        })
        .where('user_id = :userId', {userId})
        .execute();

    }


    async violationDeductPoints(value: number, userId: number){

        await this.dataSource
        .getRepository(UserPoints)
        .createQueryBuilder('user_points')
        .update(UserPoints)
        .set({
            currentPoints: () => `current_points - ${+value}`, 
            redeemablePoints: () => `redeemable_points - ${+value}`
        })
        .where('user_id = :userId', {userId})
        .execute();

    }

    async redeemDeductPoints(value: number, userId: number){

        await this.dataSource
        .getRepository(UserPoints)
        .createQueryBuilder('user_points')
        .update(UserPoints)
        .set({
            redeemablePoints: () => `redeemable_points - ${+value}`
        })
        .where('user_id = :userId', {userId})
        .execute();

    }

}