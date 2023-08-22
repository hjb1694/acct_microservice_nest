import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserBlocks {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'blocker_user_id',
        type: 'int', 
        nullable: false
    })
    blocker_user_id: number;

    @Column({
        name: 'blocked_user_id', 
        type: 'int', 
        nullable: false
    })
    blocked_user_id: number;


}