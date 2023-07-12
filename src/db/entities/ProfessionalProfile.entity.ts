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
        name: 'first_name', 
        type: 'varchar', 
        nullable: true
    })
    firstName: string;

    @Column({
        name: 'last_name', 
        type: 'varchar', 
        nullable: true
    })
    lastName: string;

    @Column({
        name: 'headline', 
        type: 'varchar', 
        nullable: true
    })
    headline: string;

    @Column({
        name: 'bio', 
        type: 'text', 
        nullable: true
    })
    bio: string;

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


    @Column({
        name: 'profile_image_uri', 
        type: 'varchar', 
        nullable: true
    })
    profileImageURI: string;

}