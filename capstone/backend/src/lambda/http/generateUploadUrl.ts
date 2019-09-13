import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { GenerateUrl } from '../../businessLogic/note';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const noteId = event.pathParameters.noteId
  const url = await GenerateUrl(noteId);

  // note: Return a presigned URL to upload a file for a note item with the provided id
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers':'*'
    },
    body: JSON.stringify({
      uploadUrl: url
    })
  };
}
