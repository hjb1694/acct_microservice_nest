import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class DatabaseConfiguration implements TypeOrmOptionsFactory {

    constructor(private configService: ConfigService){}

    createTypeOrmOptions(connectionName?: string): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {

        const appEnvLong = this.configService.get('APP_ENV');
        let appEnvShort: string;

        if(appEnvLong === 'production'){
            appEnvShort = 'PROD';
        }else if(appEnvLong === 'testing'){
            appEnvShort = 'TEST'
        }else{
            appEnvShort = 'DEV';
        }

        return {
            type: 'postgres', 
            host: this.configService.get(`${appEnvShort}_DB_HOST`), 
            port: +this.configService.get(`${appEnvShort}_DB_PORT`) || 5432, 
            username: this.configService.get(`${appEnvShort}_DB_USER`), 
            password: this.configService.get(`${appEnvShort}_DB_PASSWORD`), 
            database: this.configService.get(`${appEnvShort}_DB_DATABASE`), 
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true
        }
    }
}