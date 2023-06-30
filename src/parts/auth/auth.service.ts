import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import Persona, { PersonaType } from 'src/db/entities/Persona.entity';
import Account from 'src/db/entities/Account.entity';
import { Repository, DataSource } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { genVericode, hashPassword } from 'src/util/helpers';
import Vericode from 'src/db/entities/Vericode.entity';

@Injectable()
export class AuthService {
    
    constructor(
        @InjectRepository(Account)
        private userRepo: Repository<Account>,
        @InjectRepository(Persona)
        private personaRepo: Repository<Persona>,
        @InjectDataSource() 
        private dataSource: DataSource
    ){}


    async accountNameExists(acct_name: string){

        const count = await this.dataSource
        .getRepository(Account)
        .createQueryBuilder('account')
        .where('user.account_name = :acct_name', {acct_name})
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

    async personaUsernameExists(username: string){

        const count = await this.dataSource
        .getRepository(Persona)
        .createQueryBuilder('persona')
        .where('persona_username = :username', {username})
        .getCount();

        return !!count;

    }

    async prepareNewAccountData(body: RegisterDto){

        const hashedPassword = await hashPassword(body.password);
        const vericode = genVericode();

        return {
            ...body, 
            password: hashedPassword, 
            vericode
        }

    }


    async createNewAccount({
        account_name,  
        password, 
        personal_username, 
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

            const personalPersona = new Persona();
            personalPersona.personaType = PersonaType.PERSONAL;
            personalPersona.personaUsername = personal_username;
            personalPersona.userId = userRecord.id;

            const vericodeInsert = new Vericode();
            vericodeInsert.userId = userRecord.id;
            vericodeInsert.vericode = vericode;

            await Promise.all([
                queryRunner.manager.save(personalPersona), 
                queryRunner.manager.save(vericodeInsert)
            ]);

            await queryRunner.commitTransaction();



        }catch(e){
            await queryRunner.rollbackTransaction();
            console.log(e);
        }finally{
            await queryRunner.release();
        }

    }



}
