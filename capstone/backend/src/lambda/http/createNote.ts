import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateNoteRequest } from '../../requests/CreateNoteRequest'
import { CreateNote } from '../../businessLogic/note';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newNote: CreateNoteRequest = JSON.parse(event.body);
  const newItem = await CreateNote(newNote, event);

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      newItem
    })
  };
}
