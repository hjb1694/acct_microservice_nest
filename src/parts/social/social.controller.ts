import { Body, Controller, Post, Get, NotFoundException } from '@nestjs/common';
import { BlockActionDto } from './dto/block_action.dto';
import { ProfileFetcPublichDto } from './dto/profile_fetch_public.dto';
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
    async profileForPublic(@Body() body: ProfileFetcPublichDto) {
        const profile = await this.socialService.fetchPublicProfile(body.account_name);
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


    @Post('/block-action')
    blockAction(@Body() body: BlockActionDto) {

    }



}