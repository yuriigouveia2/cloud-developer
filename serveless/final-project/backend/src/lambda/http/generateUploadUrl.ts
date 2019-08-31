import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { GenerateUrl } from '../../businessLogic/todo';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const url = await GenerateUrl(todoId);

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  return {
    statusCode: 202,
    body: JSON.stringify({
      uploadUrl: url
    })
  };
}
