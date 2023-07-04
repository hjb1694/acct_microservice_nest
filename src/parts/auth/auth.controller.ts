import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { AccountNameAlreadyExistsException, AccountAlreadyExistsException, UsernameAlreadyExistsException } from 'src/util/custom_errors';
import { AccountVerifyDto } from './dto/verify.dto';
import { AccountStatus } from 'src/db/entities/Account.entity';
import { LoginDto } from './dto/login.dto';

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


    @Post('/verify')
    async verify(@Body() body: AccountVerifyDto) {
        // const {isMatching, isExpired} = await this.authService.checkVericode(body.account_name, body.vericode);
        const {isResult, isMatching, isExpired, userId} = await this.authService.checkVericode(body.account_name, body.vericode);

        if(!isResult || !isMatching){
            return {
                success: false, 
                error_reason: 'Invalid input'
            }
        }

        if(isExpired){
            return {
                success: false, 
                error_reason: "Expired"
            }
        }

        await this.authService.changeAccountStatus(userId, AccountStatus.ACTIVE);

        return {
            success: true
        };
    }


    @Post('/login')
    async login(@Body() body: LoginDto) {

        const user = await this.authService.login(body.email, body.password);

        if(!user){
            throw new UnauthorizedException();
        }

        return user;

    }
    
}
