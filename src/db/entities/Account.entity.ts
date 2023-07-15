import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import Vericode from './Vericode.entity';
import PersonalProfile from './PersonalProfile.entity';
import { UserPoints } from './UserPoints.entity';

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

export enum AccountType {
    REGULAR = 'REGULAR', 
    PROFESSIONAL = 'BUSINESS', 
    SYSTEM = 'SYSTEM'
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
        name: 'account_type', 
        type: 'enum', 
        enum: AccountType, 
        nullable: false
    })
    accountType: AccountType;

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

    @Column({
        name: 'created_at', 
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP', 
        nullable: false
    })
    createdAt: string;


    @Column({
        name: 'updated_at', 
        type: 'timestamp', 
        default: () => 'CURRENT_TIMESTAMP', 
        nullable: false
    })
    updatedAt: string;

    @OneToMany(() => Vericode, (vericode) => vericode.user)
    vericodes: Vericode[]

    @OneToOne(() => PersonalProfile, (profile) => profile.user)
    personalPersonaProfile: PersonalProfile

    @OneToOne(() => UserPoints, (userPoints) => userPoints.user)
    userPoints: UserPoints
}