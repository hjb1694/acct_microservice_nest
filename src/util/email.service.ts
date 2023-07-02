import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodeMailer from 'nodemailer';

@Injectable()
export class EmailService {

    constructor(
        private configService: ConfigService
    ){}

    setupTransporter(){
        return nodeMailer.createTransport({
            host: this.configService.get('EMAIL_HOST'), 
            secure: this.configService.get('EMAIL_SECURE') === 'true', 
            port: +this.configService.get('EMAIL_PORT'), 
            auth: {
                user: this.configService.get('EMAIL_USER'), 
                pass: this.configService.get('EMAIL_PASSWORD')
            }
        });
    }

    async send(to: string, subject: string, content: string){
        const transporter: nodeMailer.Transporter = this.setupTransporter();

        await transporter.sendMail({
            from: '"Ktown Portal Noreply" <no-reply@ktown-portal.com>', 
            to, 
            html: content
        });
    }

}