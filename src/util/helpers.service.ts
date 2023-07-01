import * as bcrypt from 'bcrypt';
import * as randomString from 'randomstring';
import { Injectable } from '@nestjs/common';


@Injectable()
export class HelperService {

    async hashPassword(rawPassword: string){

        const SALT_ROUNDS = 10;
    
        const hashedPassword = await bcrypt.hash(rawPassword, SALT_ROUNDS);
    
        return hashedPassword;
    
    }

    async genVericode(){

        return randomString.generate({length: 150});
    
    }


}