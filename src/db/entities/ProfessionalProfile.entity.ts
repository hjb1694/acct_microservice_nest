import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProfessionalProfile {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'user_id', 
        type: 'int', 
        nullable: false
    })
    userId: number;

    @Column({
        name: 'bio', 
        type: 'text', 
        nullable: true
    })
    bio: string;


    @Column({
        name: 'profile_image_uri', 
        type: 'varchar', 
        nullable: true
    })
    profileImageURI: string;

}