import { Controller, Patch, Body } from '@nestjs/common';
import { UserPointsDto } from './dto/user_points.dto';
import { UserPointsService } from './user_points.service';


@Controller('/user-points')
export class UserPointsController {

    constructor(
        private userPointsService: UserPointsService
    ){}

    @Patch('/add')
    async addPoints(@Body() body: UserPointsDto) {

        await this.userPointsService.addPoints(body.value, body.user_id);

        return true;

    }

    @Patch('/deduct/violation')
    async violationDeduction(@Body() body: UserPointsDto){

        await this.userPointsService.violationDeductPoints(body.value, body.user_id);

        return true;

    }


    @Patch('/deduct/redeem')
    async deductRedeemablePoints(@Body() body: UserPointsDto){

        await this.userPointsService.redeemDeductPoints(body.value, body.user_id);

        return true;
        
    }

}