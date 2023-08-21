import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class SocialService {

    constructor(
        private authService: AuthService
    ){}

    async fetchPublicProfile(account_name: string){

        const user = await this.authService.fetchUserInfoByAccountName(account_name);

        if (!user) {
            return false;
        }

        const userInfo = {}
        


    }

}