import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import Account from "./Account.entity";


@Entity()
export default class Vericode {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'user_id',
        type: 'int', 
        nullable: false, 
    })
    userId: number;

    @Column({
        name: 'vericode', 
        type: 'varchar',
        nullable: false
    })
    vericode: string;

    @Column({
        name: 'generated_at',
        type: 'timestamp without time zone',
        nullable: false, 
        default: () => 'CURRENT_TIMESTAMP'
    })
    generatedAt: string;

    @ManyToOne(() => Account, (user) => user.vericodes)
    @JoinColumn({
        name: 'user_id'
    })
    user: Account

}