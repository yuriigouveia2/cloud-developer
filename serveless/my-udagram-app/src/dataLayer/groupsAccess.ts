import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Group } from "../models/Group";
import * as AWS from "aws-sdk";
import * as AWSXRay from 'aws-xray-sdk';

const XAWS = AWSXRay.captureAWS(AWS)

export class GroupAccess {
    constructor(
        private readonly docClient: DocumentClient = CreateDynamoDBClient(),
        private readonly groupsTable = process.env.GROUPS_TABLE
    ) { }

    async GetAllGroups(): Promise<Group[]> {
        console.log('Get all groups')

        const result = await this.docClient.scan({
            TableName: this.groupsTable
        }).promise();

        const items = result.Items;
        return items as Group[];
    }

    async CreateGroup(group: Group): Promise<Group> {
        console.log('Creating group with id ', group.id);

        await this.docClient.put({
            TableName: this.groupsTable,
            Item: group
        }).promise();

        return group;
    }
}

function CreateDynamoDBClient() {
    if(process.env.IS_OFFLINE) {
        console.log('Creating a local DynamoDB instance')

        return new XAWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    }

    return new XAWS.DynamoDB.DocumentClient()
}