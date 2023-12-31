import { Body, Controller, Post, Get, NotFoundException, Query, UnprocessableEntityException } from '@nestjs/common';
import { BlockActionDto } from './dto/block_action.dto';
import { SocialService } from './social.service';
import { FollowActionDto } from './dto/follow_action.dto';


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
    async profileForAuthUser(@Query() query) {

        const authUserAccountName = query['auth_user_account_name'];
        const profileAccountName = query['profile_account_name'];

        if(!authUserAccountName || !profileAccountName){
            throw new UnprocessableEntityException();
        }

        const profile = await this.socialService.fetchProfileForAuthUser(authUserAccountName, profileAccountName);

        if(!profile){
            throw new NotFoundException();
        }

        return profile;


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

        const blockerUserId = body.blockerUserId;
        const blockedUserId = body.blockedUserId;
        const blockAction = body.action;

        if(blockAction === 'BLOCK'){
            this.socialService.blockUser(blockerUserId, blockedUserId);
        }

        return {
            success: true
        }


    }

    @Post('/follow-action')
    followUser(@Body() body: FollowActionDto) {

        const followerUserId = body.followerUserId;
        const followedUserId = body.followedUserId;
        const followAction = body.action;

    }



}