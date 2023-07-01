import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { AccountNameAlreadyExistsException, AccountAlreadyExistsException, UsernameAlreadyExistsException } from 'src/util/custom_errors';
import { EmailService } from 'src/util/email.service';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService, 
        private emailService: EmailService
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

        await this.authService.createNewAccount(newAcctData);
        this.emailService.send();


    }
    
}
