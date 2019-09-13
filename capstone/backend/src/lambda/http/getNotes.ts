import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger';
import { getAllNotes } from '../../businessLogic/note';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const logger = createLogger('get-notes');
  logger.info('Processing event ', event);

  const notes = await getAllNotes(event);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items: notes
    })
  };
}
