import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import Account, { AccountStatus, AccountType, UserRole } from 'src/db/entities/Account.entity';
import { DataSource } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import Vericode from 'src/db/entities/Vericode.entity';
import PersonalProfile from 'src/db/entities/PersonalProfile.entity';
import { HelperService } from 'src/util/helpers.service';
import { EmailService } from 'src/util/email.service';
import { ConfigService } from '@nestjs/config';
import { DateTime } from 'luxon';
import { UserPoints } from 'src/db/entities/UserPoints.entity';

export enum LoginFailureReasons {
    INVALID_CREDENTIALS, 
    NO_LONGER_EXISTS
}

@Injectable()
export class AuthService {
    
    constructor(
        @InjectDataSource() 
        private dataSource: DataSource, 
        private helperService: HelperService, 
        private emailService: EmailService, 
        private configService: ConfigService
    ){}


    async accountNameExists(acct_name: string){

        const count = await this.dataSource
        .getRepository(Account)
        .createQueryBuilder('account')
        .where('account_name = :acct_name', {acct_name})
        .getCount();

        return !!count;

    }


    async accountExists(email: string){

        const count = await this.dataSource
        .getRepository(Account)
        .createQueryBuilder('account')
        .where('email = :email', {email})
        .andWhere('account_status != :status',{status: 'DEACTIVATED_BY_USER'})
        .getCount();

        return !!count;

    }

    async prepareNewAccountData(body: RegisterDto){

        const hashedPassword = await this.helperService.hashPassword(body.password);
        const vericode = this.helperService.genVericode();

        return {
            ...body, 
            password: hashedPassword, 
            vericode
        }

    }


    async createNewAccount({
        account_name,  
        password, 
        account_type, 
        dob, 
        email, 
        vericode
    }){

        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try{

            const user = new Account();
            user.accountName = account_name;
            user.dob = dob;
            user.email = email;
            user.password = password;

            const userRecord = await queryRunner.manager.save(user);


            const vericodeInsert = new Vericode();
            vericodeInsert.userId = userRecord.id;
            vericodeInsert.vericode = vericode;

            
            if(account_type === AccountType.PERSONAL){
                const personalProfileInsert = new PersonalProfile();
                personalProfileInsert.userId = userRecord.id;

                const userPointsRecordInsert = new UserPoints();
                userPointsRecordInsert.userId = userRecord.id;

                await Promise.all([
                    queryRunner.manager.save(personalProfileInsert),
                    queryRunner.manager.save(userPointsRecordInsert)
                ]);
            }

            await queryRunner.manager.save(vericodeInsert), 
        
            await queryRunner.commitTransaction();

            return userRecord.id;


        }catch(e){
            await queryRunner.rollbackTransaction();
            console.log(e);
        }finally{
            await queryRunner.release();
        }

    }


    async sendVerificationEmail(to: string, account_name: string, vericode: string){

        await this.emailService.send(to, 'Verify Your New Account',`
        <p>Please click here to verify your new account:</p>
        <p><a href="">${this.configService.get('WEBSITE_URL')}/auth/verify?account=${account_name}&code=${vericode}</a></p>
        `);
    }

    async checkVericode(account_name: string, vericode: string){

        const data: any = await this.dataSource
        .getRepository(Vericode)
        .createQueryBuilder('vericode')
        .innerJoinAndSelect(
            'vericode.user', 
            'account'
        )
        .where('vericode.vericode = :vericode AND account.account_name = :account_name', {vericode, account_name})
        .orderBy('vericode.generated_at', 'DESC')
        .limit(1)
        .getOne();

        if(!data){
            return {
                isResult: false,
                isMatching: false, 
                isExpired: false, 
                userId: null
            }
        }

        const date = DateTime.fromISO(data.generatedAt);
        const now = DateTime.now();

        return {
            isResult: true,
            isMatching: vericode === data.vericode, 
            isExpired: now.diff(date, 'days').toObject().days >= 1, 
            userId: data.user.id
        };

    }

    async changeAccountStatus(account_id: number, status: AccountStatus){

        await this.dataSource
        .getRepository(Account)
        .createQueryBuilder('account')
        .update(Account)
        .set({
            accountStatus: status, 
            updatedAt: () => 'CURRENT_TIMESTAMP'
        })
        .where('id = :id', {id: account_id})
        .execute();
    }


    async login(email: string, password: string){

        const data = await this.dataSource
        .getRepository(Account)
        .createQueryBuilder('account')
        .select()
        .where('email = :email', {email})
        .andWhere('user_role != :role', {role: UserRole.SYSTEM})
        .orderBy('created_at', 'DESC')
        .limit(1)
        .getOne();

        if(!data) return false;
        if([AccountStatus.BANNED, AccountStatus.DEACTIVATED_BY_USER].includes(data.accountStatus)) return false;

        const isMatchingPassword = await this.helperService.passwordMatches(password, data.password);

        if(!isMatchingPassword) return false;

        return {
            userId: data.id, 
            account_status: data.accountStatus, 
            role: data.userRole
        }


    }


    async resetPassword(email: string) {

        const randomPass = this.helperService.genRandomPassword();
        const hashedPassword = await this.helperService.hashPassword(randomPass);

        const user = await this.dataSource
        .getRepository(Account)
        .createQueryBuilder('account')
        .select()
        .where('email = :email', {email})
        .andWhere('account_status NOT IN (...:account_status)', [AccountStatus.BANNED, AccountStatus.DEACTIVATED_BY_USER])
        .orderBy('created_at','DESC')
        .limit(1)
        .getOne();

        if(user){

            await Promise.all([
            this.dataSource
            .getRepository(Account)
            .createQueryBuilder('account')
            .update(Account)
            .set({password: hashedPassword})
            .where('id = "userId', {id: user.id})
            .execute(), 
            this.emailService.send(email, 'Reset Password', `
            <p>Your new password is:</p>
            <p>${randomPass}</p>
            <p>Login with the password above to change your password.</p>
            `)
            ]);

        }


    }


}
