import * as uuid from 'uuid';
import { GroupAccess } from '../dataLayer/groupsAccess';
import { Group } from '../models/Group';
import { CreateGroupRequest } from '../requests/createGroupRequests';
import { getUserId } from '../auth/utils';



const groupAccess = new GroupAccess();

export async function getAllGroups(): Promise<Group[]> {
    return groupAccess.GetAllGroups();
}

export async function CreateGroup(
    createGroupRequest: CreateGroupRequest,
    jwtToken: string
): Promise<Group> {

    const itemId = uuid.v4();
    const userId = getUserId(jwtToken);

    return await groupAccess.CreateGroup({
        id: itemId,
        userId: userId,
        name: createGroupRequest.name,
        description: createGroupRequest.description,
        timestamp: new Date().toISOString()
    });
}