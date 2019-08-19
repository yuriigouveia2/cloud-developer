import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { JwtToken } from '../../auth/JwtToken'

const cert = `-----BEGIN CERTIFICATE-----
MIIDBzCCAe+gAwIBAgIJbdzA4aFI97F/MA0GCSqGSIb3DQEBCwUAMCExHzAdBgNV
BAMTFmRldi14ZTlmc2s3bi5hdXRoMC5jb20wHhcNMTkwODE2MDAwNTQxWhcNMzMw
NDI0MDAwNTQxWjAhMR8wHQYDVQQDExZkZXYteGU5ZnNrN24uYXV0aDAuY29tMIIB
IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6u+j3N8H3f1Z9XHLhR7VkPd1
8o5RIdbAd32/CljMMT8BnM6OIEc0rtmllIxw02CFTHIsd4nKZhGKuOoVNi+9O81E
RMpIXxuRdEXCggjhxSRf/03cKqLY9z1/l+VG8b8NAINjPiqYuOWy/6EDj97I7/ow
wwysACaZFGFhLah+p6154+Tx0Grz1sNNblIwG1CPb9jgaHNv1zocnps1EwEu2PIu
D61Eh+64YNhdVDF4obalj9N5dYW1aTQ1MtZ7yDffgmKwpcCGTAIn5y8xQdcOPrdw
3VG4cJOv1QKfCo/jms/V7U/LlZGKPYNKrnqfBWpfeWUQmLwr1VI5XwizHdXsgQID
AQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBQemCP9ptbnoHTezAkf
4eCWydCYjzAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAGU2uyhH
W4p1t1/CepAaXqx0zNGFSrm73TuSCnIlP6G47+2K2bXt6RGxrTjmypGPPkBjgjlH
ZJNJejKVh4imV5j4KSiPUoZjBJlCFhmOIiCUU5gp3QrnasfwkVZc3WxpMkTS/9R2
eu+ZiANUWxZeIqN61zhha1FuyzBfacxo1G+teZBY5re2aMHom9v0m8DCusLW3n0r
gwAk9tn080MK6T67Jq4bExzo6Oq6iejcVijDXnLrEEZP1IodUVeHZMi8pKOGThvA
IHAypJB3QIZ/l3TQOLlMe8/2/CgcZ+gUR2KNK2HQXGTqXJeDniGph0vuV2d4pr67
pvm4rFDhWJXKRSw=
-----END CERTIFICATE-----`;

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
    try {
      const jwtToken = verifyToken(event.authorizationToken)
      console.log('User was authorized', jwtToken)
  
      return {
        principalId: jwtToken.sub,
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
      console.log('User authorized', e.message)
  
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

function verifyToken(authHeader: string): JwtToken {
    if (!authHeader)
        throw new Error('No authentication header')

    if (!authHeader.toLowerCase().startsWith('bearer '))
        throw new Error('Invalid authentication header')

    const split = authHeader.split(' ')
    const token = split[1]

    return verify(token, cert, { algorithms: ['RS256'] }) as JwtToken
}