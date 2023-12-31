import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { CustomValidNewPassword, CustomValidUsername, CustomIsValidDate, CustomIsValidDOBAge } from '../../../util/custom_validators';

export class RegisterDto {

    @IsNotEmpty()
    @IsString()
    @CustomValidUsername({
        message: 'Account name must be between 6 and 12 alphanumeric characters with optional underscore seperator.'
    })
    account_name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @CustomValidNewPassword()
    password: string;

    @IsNotEmpty()
    @IsString()
    @CustomIsValidDate()
    @CustomIsValidDOBAge()
    dob: string;

    @IsNotEmpty()
    @IsIn(['REGULAR', 'BUSINESS'])
    account_type: string;

}