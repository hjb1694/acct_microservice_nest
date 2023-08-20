import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class SocialService {

    constructor(
        private authService: AuthService
    ){}

    fetchPublicProfile(account_name: string){

        

    }

}