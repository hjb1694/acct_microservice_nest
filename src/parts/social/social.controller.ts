import { Body, Controller, Post, Get } from '@nestjs/common';
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
    profileForPublic(@Body() body: ProfileFetcPublichDto) {

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