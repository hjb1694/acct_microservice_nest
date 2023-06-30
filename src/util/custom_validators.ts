import stringLength from "../vendor/string_length";
import { registerDecorator, ValidationOptions } from 'class-validator';
import { DateTime } from 'luxon';

const messages = {
    username: 'Username must be between 8 and 15 alphanumeric characters with optional underscore seperator.', 
    newPassword: 'Password must be between 10 and 50 characters and must contain at least one (1) uppercase letter, one(1) lowercase letter, and one(1) number.', 
    date: 'Invalid date.', 
    dob: 'You must be at least 16 to join.'
}


// Username Validator
export function CustomValidUsername(validationOptions: ValidationOptions = {message: messages.username}){
    return function(object: Object, propertyName: string) {
        registerDecorator({
            name: 'CustomValidUsername', 
            propertyName, 
            target: object.constructor, 
            options: validationOptions,
            validator: {
                validate(value: any){

                    const regs = /^[A-Z0-9]+\_[A-Z0-9]+$/i;

                    return (
                        typeof value === 'string' &&
                        stringLength(value) > 8 &&
                        stringLength(value) <= 15 &&
                        regs.test(value)
                    );
                }
            }
        });
    }
}

// Password Validator
export function CustomValidNewPassword(validationOptions: ValidationOptions = {message: messages.newPassword}){
    return function(object: Object, propertyName: string) {
        registerDecorator({
            name: 'CustomValidNewPassword', 
            propertyName, 
            target: object.constructor, 
            options: validationOptions,
            validator: {
                validate(value: any){

                    const regs = {
                        uppercase: /[A-Z]/, 
                        lowercase: /[a-z]/, 
                        numeric: /[0-9]/
                    };

                    return (
                        typeof value === 'string' &&
                        stringLength(value) > 8 &&
                        stringLength(value) <= 15 &&
                        regs.uppercase.test(value) &&
                        regs.lowercase.test(value) &&
                        regs.numeric.test(value)
                    );
                }
            }
        });
    }
}


// Valid date
export function CustomIsValidDate(validationOptions: ValidationOptions = {message: messages.date}){
    return function(object: Object, propertyName: string) {
        registerDecorator({
            name: 'CustomIsValidDate', 
            propertyName, 
            target: object.constructor, 
            options: validationOptions,
            validator: {
                validate(value: any){

                    if(!value) return false;

                    const regs = /^[1-2][0-9]{3}\-[0-1][0-9]\-[0-3][0-9]$/;

                    if(!regs.test(value)){
                        return false;
                    }

                    const year = +value.substring(0,4);
                    const curYear = (new Date()).getFullYear();

                    if(year < curYear - 100 || year > curYear){
                        return false;
                    }

                    const isValid = DateTime.fromFormat(value, 'yyyy-MM-dd').isValid;

                    if(!isValid){
                        return false;
                    }

                    return true;
                    

                }
            }
        });
    }
}


// Valid DOB Age
export function CustomIsValidDOBAge(validationOptions: ValidationOptions = {message: messages.dob}){
    return function(object: Object, propertyName: string) {
        registerDecorator({
            name: 'CustomIsValidDate', 
            propertyName, 
            target: object.constructor, 
            options: validationOptions,
            validator: {
                validate(value: any){

                    if(!value) return false;

                    const curDate = DateTime.now();
                    const dob = DateTime.fromFormat(value, 'yyyy-MM-dd');
                    const age = curDate.diff(dob, 'years').toObject().years;

                    return age > 16;
                    

                }
            }
        });
    }
}


