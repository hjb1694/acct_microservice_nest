import { HttpException, HttpStatus } from "@nestjs/common";

export class AccountNameAlreadyExistsException extends HttpException {
    constructor(){
        super('ERR_ACCT_NAME_ALREADY_EXISTS: Account name already exists.', HttpStatus.UNPROCESSABLE_ENTITY);
    }
}


export class AccountAlreadyExistsException extends HttpException {
    constructor(){
        super('ERR_ACCT_ALREADY_EXISTS: Account already exists.', HttpStatus.UNPROCESSABLE_ENTITY);
    }
}

export class UsernameAlreadyExistsException extends HttpException {
    constructor(){
        super('ERR_USERNAME_ALREADY_EXISTS: Account already exists.', HttpStatus.UNPROCESSABLE_ENTITY);
    }
}