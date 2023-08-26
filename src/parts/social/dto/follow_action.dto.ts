import { IsIn, IsInt, IsNotEmpty } from "class-validator";

export class FollowActionDto {

    @IsNotEmpty({
        message: 'Please include a followerUserId'
    })
    @IsInt({
        message: 'followerUserId must be an interger value.'
    })
    followerUserId: number;

    @IsNotEmpty({
        message: 'Please include a followedUserId'
    })
    @IsInt({
        message: 'followedUserId must be an integer value.'
    })
    followedUserId: number;

    @IsNotEmpty({
        message: 'Please include an action.'
    })
    @IsIn(['FOLLOW', 'UNFOLLOW'], {
        message: 'Invalid action.'
    })
    action: string;

}   