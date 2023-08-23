import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

enum FollowStatus {
    PENDING = 'PENDING', 
    APPROVED = 'APPROVED'
}

@Entity()
export class UserFollows {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'follower_user_id', 
        type: 'int', 
        nullable: false
    })
    follower_user_id: number;

    @Column({
        name: 'following_user_id', 
        type: 'int', 
        nullable: false
    })
    following_user_id: number;

    @Column({
        name: 'status', 
        type: 'enum', 
        enum: FollowStatus, 
        nullable: false, 
        default: FollowStatus.PENDING
    })
    status: FollowStatus


}