import { IsNotEmpty, IsInt, IsIn } from "class-validator";


export class BlockActionDto {

    @IsNotEmpty({
        message: 'blocker_user_id must be included.'
    })
    @IsInt({
        message: 'blocker_user_id must be an integer value.'
    })
    blockerUserId: number;

    @IsNotEmpty({
        message: 'blocked_user_id must be included.'
    })
    @IsInt({
        message: 'blocked_user_id must be an integer value.'
    })
    blocked_user_id: number;

    @IsNotEmpty({
        message: 'Action must be included.'
    })
    @IsIn(['BLOCK', 'UNBLOCK'], {
        message: 'Action must be either "BLOCK" or "UNBLOCK".'
    })
    action: string;



}