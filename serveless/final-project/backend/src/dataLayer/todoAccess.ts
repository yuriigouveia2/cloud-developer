import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { TodoItem } from "../models/TodoItem";
import * as AWS from "aws-sdk";
import { createLogger } from "../utils/logger";

export class TodoAccess {

    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly todoTable = process.env.TODO_TABLE
    ) { }

    async CreateTodo(todo: TodoItem): Promise<TodoItem> {
        const logger = createLogger('create-todo');
        logger.info('Creating a todo item ', {...todo});

        await this.docClient.put({
            TableName: this.todoTable,
            Item: todo
        }).promise();

        return todo;
    }

    async GetAllTodos(): Promise<TodoItem[]> {
        const logger = createLogger('get-todo');
        logger.info('Getting all todo items ');

        const result = await this.docClient.scan({
            TableName: this.todoTable
        }).promise();

        const items = result.Items;

        return items as TodoItem[];
    }

}