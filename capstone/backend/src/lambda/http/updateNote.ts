import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateNoteRequest } from '../../requests/UpdateNoteRequest'
import { UpdateNote } from '../../businessLogic/note';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const noteId = event.pathParameters.noteId
  const updatedNote: UpdateNoteRequest = JSON.parse(event.body)

  const updatedItem = await UpdateNote(noteId, updatedNote, event);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      updatedItem
    })
  };
}
