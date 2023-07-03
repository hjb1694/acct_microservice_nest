import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import Account from "./Account.entity";

export enum Gender {
    MALE = 'MALE', 
    FEMALE = 'FEMALE', 
    NOT_SPECIFIED = 'NOT_SPECIFIED'
}

export enum RelationshipStatus {
    SINGLE = 'SINGLE', 
    IN_A_RELATIONSHIP = 'IN_A_RELATIONSHIP', 
    DATING = 'DATING', 
    MARRIED = 'MARRIED', 
    DIVORCED = 'DIVORCED',
    WIDOWED = 'WIDOWED', 
    NOT_SPECIFIED = 'NOT_SPECIFIED'
}


@Entity()
export default class PersonalPersonaProfile {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        name: 'user_id', 
        nullable: false
    })
    userId: number;

    @Column({
        type: 'text', 
        name: 'bio', 
        nullable: true
    })
    bio: string;

    @Column({
        type: 'enum', 
        name: 'gender',
        enum: Gender, 
        nullable: false, 
        default: Gender.NOT_SPECIFIED
    })
    gender: Gender

    @Column({
        type: 'enum', 
        name: 'relationship_status',
        enum: RelationshipStatus,
        nullable: false, 
        default: RelationshipStatus.NOT_SPECIFIED
    })
    relationshipStatus: RelationshipStatus

    @Column({
        type: 'varchar', 
        name: 'location_zip', 
        nullable: true
    })
    locationZip: string;

    @Column({
        type: 'varchar', 
        name: 'location_text', 
        nullable: true
    })
    locationText: string;

    @OneToOne(() => Account, (account) => account.personalPersonaProfile)
    @JoinColumn({
        name: 'user_id'
    })
    user: Account;
}