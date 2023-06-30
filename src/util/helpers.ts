import bcrypt from 'bcrypt';
import randomString from 'randomstring';

export async function hashPassword(rawPassword: string){

    const SALT_ROUNDS = 10;

    const hashedPassword = await bcrypt.hash(rawPassword, SALT_ROUNDS);

    return hashedPassword;


}


export function genVericode(){

    return randomString.generate({length: 150});

}