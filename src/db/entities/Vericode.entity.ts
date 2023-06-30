import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";


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
}