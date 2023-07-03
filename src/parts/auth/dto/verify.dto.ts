import { IsNotEmpty, IsString, MinLength } from "class-validator";


export class AccountVerifyDto {

    @IsNotEmpty()
    @IsString()
    account_name: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(150)
    vericode: string;

}