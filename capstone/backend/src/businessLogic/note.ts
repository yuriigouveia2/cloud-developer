import * as uuid from 'uuid';
import { NoteAccess } from '../dataLayer/noteAccess';
import { NoteItem } from '../models/NoteItem';
import { CreateNoteRequest } from '../requests/CreateNoteRequest';
import { UpdateNoteRequest } from '../requests/UpdateNoteRequest';
import { getUserId } from '../lambda/utils';
import { APIGatewayProxyEvent } from 'aws-lambda';



const groupAccess = new NoteAccess();
const bucketName = process.env.IMAGES_S3_BUCKET

export async function GenerateUrl(noteId: string) {
    return groupAccess.GenerateUrl(noteId);
}

export async function deleteItem(id: string, event: APIGatewayProxyEvent): Promise<NoteItem[]> {
    const userId = getUserId(event);
    return groupAccess.DeleteItem(id, userId);
}

export async function getAllNotes(event: APIGatewayProxyEvent): Promise<NoteItem[]> {
    const userId = getUserId(event);
    return groupAccess.GetAllNotes(userId);
}

export async function getItem(id: string, event: APIGatewayProxyEvent): Promise<NoteItem> {
    const userId = getUserId(event);
    return groupAccess.GetItem(id, userId);
}

export async function UpdateNote(
    id: string,
    updatedNote: UpdateNoteRequest,
    event: APIGatewayProxyEvent
): Promise<NoteItem> {

    const userId = getUserId(event);
    const note: NoteItem = await groupAccess.GetItem(id, userId);

    return await groupAccess.UpdateNote(id, userId, {
        noteId: id,
        createdAt: note.createdAt,
        userId: note.userId,
        text: updatedNote.text
    });
}

export async function CreateNote(
    createNoteRequest: CreateNoteRequest,
    event: APIGatewayProxyEvent
): Promise<NoteItem> {

    const itemId = uuid.v4();
    const userId = getUserId(event);

    return await groupAccess.CreateNote({
        noteId: itemId,
        userId: userId,
        text: createNoteRequest.text,
        createdAt: new Date().toISOString(),
        attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${itemId}`
    });
}