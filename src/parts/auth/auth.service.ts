import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import Persona from 'src/db/entities/Persona.entity';
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



}
