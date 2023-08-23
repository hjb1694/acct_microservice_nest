import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import PersonalPersonaProfile from 'src/db/entities/PersonalProfile.entity';
import Account, { AccountStatus, AccountType } from 'src/db/entities/Account.entity';

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
        }else if(user.accountType === AccountType.PROFESSIONAL){


        }

        const profileData = {
            user_id: user.id, 
            account_name
        }

        if(user.accountStatus === AccountStatus.BANNED || user.accountStatus === AccountStatus.DEACTIVATED_BY_USER){
            profileData['is_deactivated'] = true;
            profileData['profile_image_uri'] = null;
        }else{
            profileData['is_deactivated'] = false;
            profileData['profile_image_uri'] = profile.profileImageURI;
        }



        return profileData;

    }

    async fetchProfileForAuthUser(authUserAccountName: string, profileAccountName: string) {

        const [authUser, profileUser] = await Promise.all([
            this.authService.fetchUserInfoByAccountName(authUserAccountName),
            this.authService.fetchUserInfoByAccountName(profileAccountName)
        ]);

        if(!authUser || !profileUser || profileUser.accountType === AccountType.SYSTEM){
            return false;
        }

        let profile;

        if(profileUser.accountType === AccountType.REGULAR){
            profile = await this.dataSource
            .getRepository(PersonalPersonaProfile)
            .createQueryBuilder('personal_persona_profile')
            .select()
            .where('user_id = :userid', {userid: profileUser.id})
            .getOne()
        }else if(profileUser.accountType === AccountType.PROFESSIONAL){


        }

        let profileReturnData = {
            user_id: profileUser.id,
            profile_image_uri: null, 
            is_deactivated: false
        }
        
        if(
           profileUser.accountStatus === AccountStatus.BANNED || 
           profileUser.accountStatus === AccountStatus.DEACTIVATED_BY_USER
        ){
            profileReturnData['is_deactivated'] = true;
            return profileReturnData;
        }else{
            profileReturnData['profile_image_uri'] = profile.profileImageURI;  
        }



        return profileReturnData;


    }

}