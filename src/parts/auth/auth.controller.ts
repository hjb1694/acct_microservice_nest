import { Body, Controller, Post, UnauthorizedException, Patch, Query, UnprocessableEntityException} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { AccountNameAlreadyExistsException, AccountAlreadyExistsException } from 'src/util/custom_errors';
import { AccountVerifyDto } from './dto/verify.dto';
import { AccountStatus } from 'src/db/entities/Account.entity';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot_password.dto';
import { VericodeResendDto } from './dto/vericode_resend.dto';

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

    @Patch('/forgot-password')
    async forgotPassword(@Body() body: ForgotPasswordDto) {

        await this.authService.resetPassword(body.email);

        return true;

    }

    @Post('/resend-verification')
    async resendVerificationCode(@Body() body: VericodeResendDto){



    }


    @Post('/exists/email')
    async checkEmailExists(@Body() body) {

        const emailExists = await this.authService.accountExists(body['email_address']);

        return {
            body: emailExists
        }

    }

    @Post('/exists/account_name')
    async checkAccountNameExists(@Body() body) {

        const accountNameExists = await this.authService.accountNameExists(body.account_name);

        return {
            body: accountNameExists
        }

    }
    
}
