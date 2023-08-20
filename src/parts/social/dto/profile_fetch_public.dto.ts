import { IsNotEmpty, IsString } from "class-validator";


export class ProfileFetcPublichDto {

    @IsNotEmpty({
        message: 'Must include account_name.'
    })
    @IsString({
        message: 'account_name must be a string.'
    })
    account_name: string;

}