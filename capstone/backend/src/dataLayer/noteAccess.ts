import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { NoteItem } from "../models/NoteItem";
import * as AWS from "aws-sdk";
import { createLogger } from "../utils/logger";

export class NoteAccess {

    constructor(
        private readonly awsRegion = process.env.REGION || 'sa-east-1',
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient({region: awsRegion}),
        private readonly s3: AWS.S3 = new AWS.S3({ signatureVersion: 'v4', region: awsRegion}),
        private readonly noteTable = process.env.NOTE_TABLE || 'Note-dev',
        private readonly bucketName = process.env.IMAGES_S3_BUCKET || 'serverless-images-note-dev',
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION || 300
    ) { }
    
    async GenerateUrl(noteId: string) {
        const logger = createLogger('generate-url');
        logger.info('Generating image url', {
            Bucket: this.bucketName,
            Key: noteId,
            Expires: Number(this.urlExpiration),
            REGION: this.awsRegion
        }); 

        return this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: noteId,
            Expires: Number(this.urlExpiration)
          })
    }

    async DeleteItem(id: string, userId: string): Promise<NoteItem[]> {
        const logger = createLogger('delete-note');
        logger.info('Deleting note item'); 

        await this.docClient.delete({
            TableName: this.noteTable,
            Key: { "noteId": id, 'userId': userId}
        }).promise()

        return [];
    }

    async CreateNote(note: NoteItem): Promise<NoteItem> {
        const logger = createLogger('create-note');
        logger.info('Creating a note item ', {...note});

        await this.docClient.put({
            TableName: this.noteTable,
            Item: note
        }).promise();

        return note;
    }

    async UpdateNote(id: string, userId: string,  note: NoteItem): Promise<NoteItem> {
        const logger = createLogger('update-note');
        logger.info('Updating a note item ', {...note});

        await this.docClient.update({
            TableName: this.noteTable,
            Key: { 'noteId': id, 'userId': userId },
            UpdateExpression: 'set #text = :t',
            ExpressionAttributeNames:{
                "#text": "text"
            },
            ExpressionAttributeValues: {
                ':t' : note.text
            },
            ReturnValues: 'UPDATED_NEW'
        }).promise()

        return note;
    }

    async GetItem(id: string, userId: string): Promise<NoteItem> {
        const logger = createLogger('get-item');
        logger.info('Getting signle note item');

        const result = await this.docClient.get({
            TableName: this.noteTable,
            Key: { 'noteId': id, 'userId': userId }
        }).promise();

        return result.Item as NoteItem;

    }

    async GetAllNotes(userId: string): Promise<NoteItem[]> {
        const logger = createLogger('get-notes');
        logger.info('Getting all note items ');

        const result = await this.docClient.query({
            TableName: this.noteTable,
            KeyConditionExpression: '#userId = :userId',
            ExpressionAttributeNames: {
                '#userId': 'userId',
            },
            ExpressionAttributeValues: {
                ':userId': userId,
            }
        }).promise();

        const items = result.Items;

        return items as NoteItem[];
    }

    async noteExists(noteId: string, userId: string): Promise<boolean> {
        const result = await this.docClient.get({
            TableName: this.noteTable,
            Key: { "noteId": noteId, 'userId': userId}
        }).promise();

        return !!result.Item;
    }

}