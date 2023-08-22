import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import PersonalPersonaProfile from 'src/db/entities/PersonalProfile.entity';
import { AccountType } from 'src/db/entities/Account.entity';

@Injectable()
export class SocialService {

    constructor(
        @InjectDataSource()
        private dataSource: DataSource,
        private authService: AuthService
    ){}

    async checkIfProfileExists(account_name){

        const user = await this.authService.fetchUserInfoByAccountName(account_name);

        if (!user || user.accountType === AccountType.SYSTEM) {
            return false;
        }

        return true;

    }

    async fetchPublicProfile(account_name: string){

        const user = await this.authService.fetchUserInfoByAccountName(account_name);

        if (!user || user.accountType === AccountType.SYSTEM) {
            return false;
        }

        console.log(user);

        let profile: any;

        if(user.accountType === AccountType.REGULAR){
            profile = await this.dataSource
            .getRepository(PersonalPersonaProfile)
            .createQueryBuilder('personal_persona_profile')
            .select()
            .where('user_id = :userid', {userid: user.id})
            .getOne()
        }else if(user.accountType){


        }

        const userInfo = {
            user_id: user.id, 
            account_name, 
            profile_image_uri: profile.profileImageURI
        }

        return userInfo;

    }

}