import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { HelperService } from './helpers.service';

@Global()
@Module({
    providers: [EmailService, HelperService], 
    exports: [EmailService, HelperService]
})
export class GlobalModule {}
