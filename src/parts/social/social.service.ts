import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import PersonalPersonaProfile from 'src/db/entities/PersonalProfile.entity';
import { AccountStatus, AccountType, UserRole } from 'src/db/entities/Account.entity';
import { UserBlocks } from 'src/db/entities/UserBlocks.entity';
import { FollowStatus, UserFollows } from 'src/db/entities/UserFollows.entity';
import { AccountDeactivatedException, AccountFrozenException, AccountNotVerifiedException, BlockAlreadyExistsException, CannotBlockHighRoleUserException } from 'src/util/custom_errors';

@Injectable()
export class SocialService {

    constructor(
        @InjectDataSource()
        private dataSource: DataSource,
        private authService: AuthService
    ){}

    async checkIfProfileExists(account_name){

        const user = await this.authService.fetchUserInfoByAccountName(account_name);

        if (!user || user.accountType === AccountType.SYSTEM) {
            return false;
        }

        return true;

    }

    async checkFollowStatus(followerUserId: number, followedUserId: number): Promise<null | string> {

        const result = await this.dataSource
        .getRepository(UserFollows)
        .createQueryBuilder('user_follows')
        .select()
        .where('follower_user_id = :followerUserId AND followed_user_id = :followedUserId', {followerUserId, followedUserId})
        .getOne();

        if(!result){
            return null;
        }else{
            return result.status;
        }
    }

    async checkIfBlockExists(blockerUserId: number, blockedUserId: number) {

        const result = await this.dataSource
        .getRepository(UserBlocks)
        .createQueryBuilder('user_blocks')
        .select()
        .where('blocker_user_id = :blockerUserId AND blocked_user_id = :blockedUserId', {blockerUserId, blockedUserId})
        .getCount();

        return !!result;

    }

    async fetchPublicProfile(account_name: string){

        const user = await this.authService.fetchUserInfoByAccountName(account_name);

        if (!user || user.accountType === AccountType.SYSTEM) {
            return false;
        }

        console.log(user);

        let profile: any;

        if(user.accountType === AccountType.REGULAR){
            profile = await this.dataSource
            .getRepository(PersonalPersonaProfile)
            .createQueryBuilder('personal_persona_profile')
            .select()
            .where('user_id = :userid', {userid: user.id})
            .getOne()
        }else if(user.accountType === AccountType.PROFESSIONAL){


        }

        const profileData = {
            user_id: user.id, 
            account_name, 
            role: profile.userRole
        }

        if(user.accountStatus === AccountStatus.BANNED || user.accountStatus === AccountStatus.DEACTIVATED_BY_USER){
            profileData['is_deactivated'] = true;
            profileData['profile_image_uri'] = null;
        }else{
            profileData['is_deactivated'] = false;
            profileData['profile_image_uri'] = profile.profileImageURI;
        }



        return profileData;

    }

    async fetchProfileForAuthUser(authUserAccountName: string, profileAccountName: string) {

        const [authUser, profileUser] = await Promise.all([
            this.authService.fetchUserInfoByAccountName(authUserAccountName),
            this.authService.fetchUserInfoByAccountName(profileAccountName)
        ]);

        if(!authUser || !profileUser || profileUser.accountType === AccountType.SYSTEM){
            return false;
        }

        let profile: any;

        if(profileUser.accountType === AccountType.REGULAR){
            profile = await this.dataSource
            .getRepository(PersonalPersonaProfile)
            .createQueryBuilder('personal_persona_profile')
            .select()
            .where('user_id = :userid', {userid: profileUser.id})
            .getOne()
        }else if(profileUser.accountType === AccountType.PROFESSIONAL){


        }

        let profileReturnData = {
            user_id: profileUser.id,
            profile_image_uri: null, 
            is_deactivated: false, 
            account_type: profileUser.accountType,
            role: profileUser.userRole
        }
        
        if(
           profileUser.accountStatus === AccountStatus.BANNED || 
           profileUser.accountStatus === AccountStatus.DEACTIVATED_BY_USER
        ){
            profileReturnData['is_deactivated'] = true;
            return profileReturnData;
        }else{
            profileReturnData['profile_image_uri'] = profile.profileImageURI;  
        }

        let blockAgainstAuthUserExists: boolean = false;
        let blockAgainstProfileUserExists: boolean = false;
        let followStatus: string | null = null;

        if(authUser.id !== profileUser.id){
            const [blockAgainstAuthUserExistsResult, blockAgainstProfileUserExistsResult, followStatusResult] = await Promise.all([
                this.checkIfBlockExists(profileUser.id, authUser.id), 
                this.checkIfBlockExists(authUser.id, profileUser.id),
                this.checkFollowStatus(authUser.id, profileUser.id)
            ]) 
            blockAgainstAuthUserExists = blockAgainstAuthUserExistsResult;
            blockAgainstProfileUserExists = blockAgainstProfileUserExistsResult;
            followStatus = followStatusResult;
        }

        if(
            authUser.id !== profileUser.id &&
            (blockAgainstAuthUserExists || 
            (profile.is_private_profile && (followStatus !== FollowStatus.APPROVED)))
        ){
            profileReturnData['is_private_profile'] = true;
        }else{
            profileReturnData['is_private_profile'] = false; 

            if(profileUser.accountType = AccountType.REGULAR){
                profileReturnData['about'] = {};
                profileReturnData['about']['bio'] = profile.bio;
                profileReturnData['about']['location'] = profile.locationText;
                profileReturnData['about']['gender'] = profile.gender;
            }
        }

        profileReturnData['social'] = {};
        profileReturnData['social']['user_viewed_is_blocked'] = blockAgainstProfileUserExists;
        profileReturnData['social']['follow_status'] = followStatus;

        return profileReturnData;


    }

    async unfollowUser(followerUserId: number, followedUserId: number): Promise<void> {

        await this.dataSource
        .getRepository(UserFollows)
        .createQueryBuilder('user_follows')
        .delete()
        .from(UserFollows)
        .where('follower_user_id = :followerUserId AND followedUserId = :followedUserId', {followerUserId, followedUserId})
        .execute();

    }


    async blockUser(blockerUserId: number, blockedUserId: number): Promise<void> {

        const [blockerUserData, blockedUserData] = await Promise.all([
            this.authService.fetchUserInfoById(blockerUserId), 
            this.authService.fetchUserInfoById(blockedUserId)
        ]);

        const highRoles = [UserRole.ADMIN, UserRole.STAFF, UserRole.SYSTEM];

        if(!blockerUserData || !blockedUserData){
            throw new NotFoundException();
        }

        if(blockerUserData.accountStatus === AccountStatus.NOT_VERIFIED){
            throw new AccountNotVerifiedException();
        }

        if(blockerUserData.accountStatus === AccountStatus.FROZEN){
            throw new AccountFrozenException();
        }

        if([AccountStatus.BANNED, AccountStatus.DEACTIVATED_BY_USER].includes(blockerUserData.accountStatus)){
            throw new AccountDeactivatedException();
        }

        if(highRoles.includes(blockedUserData.userRole) || highRoles.includes(blockerUserData.userRole)){
            throw new CannotBlockHighRoleUserException();
        }

        const blockAlreadyExists = this.checkIfBlockExists(blockerUserId, blockedUserId);

        if(blockAlreadyExists){
            throw new BlockAlreadyExistsException();
        }

        const userBlocksRepo = this.dataSource.getRepository(UserBlocks);
        const userBlock = new UserBlocks();
        userBlock.blocker_user_id = blockerUserId;
        userBlock.blocked_user_id = blockedUserId;

        await Promise.all([
            this.unfollowUser(blockerUserId, blockedUserId), 
            this.unfollowUser(blockedUserId, blockerUserId), 
            userBlocksRepo.save(userBlock)
        ]);

    }

    async unblockUser(blockerUserId: number, blockedUserId: number) {

        await this.dataSource
        .getRepository(UserBlocks)
        .createQueryBuilder('user_blocks')
        .delete()
        .from(UserBlocks)
        .where('blocker_user_id = :blockerUserId AND blocked_user_id = :blockedUserId', {blockerUserId, blockedUserId})
        .execute();

    }

}