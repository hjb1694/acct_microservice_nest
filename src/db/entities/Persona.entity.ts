import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import Account from "./Account.entity";

export enum PersonaType {
    PERSONAL = 'PERSONAL', 
    PROFESSIONAL = 'PROFESSIONAL'
}

@Entity()
export default class Persona {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'user_id',
        type: 'int', 
        nullable: false
    })
    userId: number;

    @Column({
        name: 'persona_type',
        type: 'enum', 
        enum: PersonaType, 
        nullable: false
    })
    personaType: PersonaType;

    @Column({
        name: 'persona_username', 
        type: 'varchar', 
        nullable: false
    })
    personaUsername: string;

    @ManyToOne(() => Account, (user) => user.personas)
    user: Account;

}