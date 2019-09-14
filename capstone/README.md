# Serverless NOTE

To implement this project you need to implement a simple NOTE application using AWS Lambda and Serverless framework. Search for all the `NOTE:` comments in the code to find the placeholders that you need to implement.

# Functionality of the application

This appliation will allow to create/remove/update/get NOTE items. Each NOTE item can optionally have an attachment image. Each user only has access to NOTE items that he/she has created. 

# Functions to be implemented

This project was implemented with the following functions and configuration in the `serverless.yml` file:

* `Auth` - this function should implement a custom authorizer for API Gateway that should be added to all other functions.
* `GetNotes` - should return all NOTEs for a current user. 
* `CreateNote` - should create a new NOTE for a current user. A shape of data send by a client application to this function can be found in the `CreateNoteRequest.ts` file
* `UpdateNote` - should update a NOTE item created by a current user.
* `DeleteNote` - should delete a NOTE item created by a current user. Expects an id of a NOTE item to remove.
* `GenerateUploadUrl` - returns a presigned url that can be used to upload an attachment file for a NOTE item. 

All functions are already connected to appriate events from API gateway

An id of a user can be extracted from a JWT token passed by a client

You also need to add any necessary resources to the `resources` section of the `serverless.yml` file such as DynamoDB table and and S3 bucket.

# Unit tests

To access the unit tests of the backend application you should run `cd backend` and then `npm test` to run the 
tests written to the application.

# Frontend

The `client` folder contains a web application that can use the API that should be developed in the project.

To start the client application you should run `cd client` and then `npm start`.

To use it please edit the `config.ts` file in the `client` folder:

```ts
const apiId = '...' API Gateway id
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```
