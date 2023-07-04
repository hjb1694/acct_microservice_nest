import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import Account from "./Account.entity";



@Entity()
export class UserPoints {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'user_id', 
        type: 'int', 
        nullable: false
    })
    userId: number;

    @Column({
        name: 'max_lifetime_points', 
        type: 'int', 
        nullable: false, 
        default: 0
    })
    maxLifetimePoints: number;

    @Column({
        name: 'current_points', 
        type: 'int', 
        nullable: false, 
        default: 0
    })
    currentPoints: number;

    @Column({
        name: 'redeemable_points', 
        type: 'int', 
        nullable: false, 
        default: 0
    })
    redeemablePoints: number;

    @OneToOne(() => Account, (account) => account.userPoints)
    @JoinColumn({
        name: 'user_id'
    })
    user: Account;

}