import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Observable } from "rxjs";


@Injectable()
export class APIKeyGuard implements CanActivate {

    constructor(
        private configService: ConfigService
    ){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const headers = context.switchToHttp().getRequest().headers;
        const headerAPIKey = headers['x-api-key'];

        if(!headerAPIKey || headerAPIKey !== this.configService.get('API_KEY')){
            return false;
        }

        return true;
    }

}