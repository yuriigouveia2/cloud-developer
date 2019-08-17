import { CustomAuthorizerEvent, CustomAuthorizerResult, CustomAuthorizerHandler } from 'aws-lambda'
import 'source-map-support/register'
import { verify } from 'jsonwebtoken'
import { JwtToken } from '../../auth/JwtToken'
import * as AWS from 'aws-sdk'

const auth0SecretId = process.env.AUTH_0_SECRET_ID;
const auth0SecretField = process.env.AUTH_0_SECRET_FIELD;

const cliente = new AWS.SecretsManager()

let cachedSecret: string;

export const handler: CustomAuthorizerHandler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
    try{
        const decodedToken = await verifyToken(event.authorizationToken);

        console.log('User authorized')

        return {
            principalId: decodedToken.sub,
            policyDocument: {
              Version: '2012-10-17',
              Statement: [
                {
                  Action: 'execute-api:Invoke',
                  Effect: 'Allow',
                  Resource: '*'
                }
              ]
            }
          }

    } catch (e) {
        console.log(JSON.stringify(e))
        console.log('User was not authorized ', e.message)

        return {
            principalId: 'user',
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Deny',
                        Resource: '*'
                    }
                ]
            }
        }
    }
}

async function verifyToken(authHeader: string): Promise<JwtToken> {

    if(!authHeader) {
        throw new Error('No authorization header')
    }

    if(!authHeader.toLocaleLowerCase().startsWith('bearer ')) {
        throw new Error('Invalid authorization header')
    }

    const split = authHeader.split(' ')
    const token = split[1]

    const secretObj: any = await getSecret()
    const secret = secretObj[auth0SecretField]
    console.log('Secret ', JSON.stringify(secretObj[auth0SecretField]))


    const jwt = verify(token, secret, { algorithms: ['HS256'] }) as JwtToken
    console.log("Token: ", JSON.stringify(jwt))

    return jwt
}

async function getSecret() {
    if(cachedSecret) return cachedSecret

    const data = await cliente
        .getSecretValue({
            SecretId: auth0SecretId
        }).promise()

        cachedSecret = data.SecretString
        console.log(JSON.stringify(cachedSecret))

        return JSON.parse(cachedSecret)
}