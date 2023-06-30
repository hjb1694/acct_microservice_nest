import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import Persona, { PersonaType } from 'src/db/entities/Persona.entity';
import User from 'src/db/entities/User.entity';
import { Repository, DataSource } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { genVericode, hashPassword } from 'src/util/helpers';

@Injectable()
export class AuthService {
    
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(Persona)
        private personaRepo: Repository<Persona>,
        @InjectDataSource() 
        private dataSource: DataSource
    ){}


    async accountNameExists(acct_name: string){

        const count = await this.dataSource
        .getRepository(User)
        .createQueryBuilder('user')
        .where('user.account_name = :acct_name', {acct_name})
        .getCount();

        return !!count;

    }


    async accountExists(email: string){

        const count = await this.dataSource
        .getRepository(User)
        .createQueryBuilder('user')
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

            const user = new User();
            user.accountName = account_name;
            user.dob = dob;
            user.email = email;

            const userRecord = await queryRunner.manager.save(User);

            console.log(userRecord)

            // const personalPersona = new Persona();
            // personalPersona.personaType = PersonaType.PERSONAL;
            // personalPersona.personaUsername = personal_username;

            await queryRunner.commitTransaction();



        }catch(e){
            await queryRunner.rollbackTransaction();
        }finally{
            await queryRunner.release();
        }

    }



}
