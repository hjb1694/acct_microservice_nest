import { Injectable } from '@nestjs/common';
import * as nodeMailer from 'nodemailer';

@Injectable()
export class EmailService {

    setupTransporter(){
        return nodeMailer.createTransport({
            host: 'mail.privateemail.com'
        });
    }

    send(){
        console.log('send email');
    }

}