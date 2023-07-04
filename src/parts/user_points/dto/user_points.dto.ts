import { IsInt, IsNotEmpty } from "class-validator";

export class UserPointsDto {

    @IsNotEmpty()
    @IsInt()
    user_id: number;


    @IsNotEmpty()
    @IsInt()
    value: number;

}