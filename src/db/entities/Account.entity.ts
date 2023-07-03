import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from 'typeorm';
import Persona from './Persona.entity';
import Vericode from './Vericode.entity';

export enum UserRole {
    SYSTEM = 'SYSTEM',
    ADMIN = 'ADMIN', 
    STAFF = 'STAFF', 
    PLATINUM_MOD = 'PLATINUM_MOD', 
    GOLD_MOD = 'GOLD_MOD',
    BRONZE_MOD = 'BRONZE_MOD', 
    REGULAR_USER = 'REGULAR_USER'
}

export enum AccountStatus {
    ACTIVE = 'ACTIVE',
    BANNED = 'BANNED',
    NOT_VERIFIED = 'NOT_VERIFIED',
    FROZEN = 'FROZEN', 
    DEACTIVATED_BY_USER = 'DEACTIVATED_BY_USER'
}

@Entity()
export default class Account {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'account_name', 
        unique: true, 
        nullable: false
    })
    accountName: string;

    @Column({
        name: 'dob', 
        type: 'date',
        nullable: false
    })
    dob: string;

    @Column({
        name: 'email', 
        nullable: false
    })
    email: string;

    @Column({
        name: 'password', 
        nullable: false
    })
    password: string;

    @Column({
        name: 'user_role',
        type: 'enum', 
        enum: UserRole, 
        default: UserRole.REGULAR_USER, 
        nullable: false
    })
    userRole: UserRole

    @Column({
        name: 'account_status',
        type: 'enum', 
        enum: AccountStatus, 
        default: AccountStatus.NOT_VERIFIED, 
        nullable: false
    })
    accountStatus: AccountStatus

    @OneToMany(() => Persona, (persona) => persona.user)
    personas: Persona[]

    @OneToMany(() => Vericode, (vericode) => vericode.user)
    vericodes: Vericode[]

}