import { IsInt, IsNotEmpty } from "class-validator";

export class VericodeResendDto {

    @IsNotEmpty()
    @IsInt()
    account_user_id: number;

}