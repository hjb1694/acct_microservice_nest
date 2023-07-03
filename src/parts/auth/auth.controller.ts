import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { AccountNameAlreadyExistsException, AccountAlreadyExistsException, UsernameAlreadyExistsException } from 'src/util/custom_errors';
import { EmailService } from 'src/util/email.service';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ){}

    @Post('/register')
    async register(@Body() body: RegisterDto){

        const accountNameExists = await this.authService.accountNameExists(body.account_name);

        if(accountNameExists){
            throw new AccountNameAlreadyExistsException();
        }

        const accountExists = await this.authService.accountExists(body.email);

        if(accountExists){
            throw new AccountAlreadyExistsException();
        }

        const personaUsernameExists = await this.authService.personaUsernameExists(body.personal_username);

        if(personaUsernameExists){
            throw new UsernameAlreadyExistsException();
        }

        const newAcctData = await this.authService.prepareNewAccountData(body);

        const [user_id] = await Promise.all([
            this.authService.createNewAccount(newAcctData),
            this.authService.sendVerificationEmail(body.email, body.account_name, newAcctData.vericode)
        ]);

        return {
            status: 201, 
            message: 'SUCCESS!', 
            body: {
                user_id, 
                vericode: newAcctData.vericode
            }
        }

    }
    
}
