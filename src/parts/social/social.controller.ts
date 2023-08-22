import { Body, Controller, Post, Get, NotFoundException, Query, UnprocessableEntityException } from '@nestjs/common';
import { BlockActionDto } from './dto/block_action.dto';
import { SocialService } from './social.service';


@Controller('social')
export class SocialController {

    constructor(
        private socialService: SocialService
    ){}

    /* 
    Fetch a profile for a user that is NOT authenticated/logged-in
    */
    @Get('/profile/public')
    async profileForPublic(@Query() query) {

        const accountName = query['account_name'];

        if(!accountName){
            throw new UnprocessableEntityException();
        }

        const profile = await this.socialService.fetchPublicProfile(accountName);
        if(!profile){
            throw new NotFoundException();
        }
        return profile;
    }

    /*
    Fetch a profile for a user that is authenticated/logged-in
    */
    @Get('/profile/auth-user')
    profileForAuthUser() {

    }


    @Get('/profile-exists')
    async profileExists(@Query() query) {

        const accountName = query['account_name'];

        if(!accountName){
            throw new UnprocessableEntityException();
        }

        const exists = await this.socialService.checkIfProfileExists(accountName);

        return {
            exists
        }

    }


    @Post('/block-action')
    blockAction(@Body() body: BlockActionDto) {

    }



}