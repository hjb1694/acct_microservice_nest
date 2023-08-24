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

export class CannotBlockHighRoleUserException extends HttpException {
    constructor(){
        super('ERR_CANNOT_BLOCK_HIGHER_ROLE_USER: Cannot block this user.', HttpStatus.FORBIDDEN);
    }
}

export class AccountFrozenException extends HttpException {
    constructor(){
        super('ERR_ACCOUNT_FROZEN: Account frozen.', HttpStatus.FORBIDDEN)
    }
}

export class AccountNotVerifiedException extends HttpException {
    constructor(){
        super('ERR_NOT_VERIFIED: Account not verified', HttpStatus.FORBIDDEN);
    }
}

export class AccountDeactivatedException extends HttpException {
    constructor(){
        super('ERR_DEACTIVATED: Account deactivated.', HttpStatus.FORBIDDEN);
    }   
}

export class BlockAlreadyExistsException extends HttpException {
    constructor(){
        super('ERR_BLOCK_ALREADY_EXISTS: Block already exists.', HttpStatus.FORBIDDEN);
    }
}