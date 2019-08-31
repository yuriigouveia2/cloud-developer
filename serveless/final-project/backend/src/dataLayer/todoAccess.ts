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

    async UpdateTodo(id: string, todo: TodoItem): Promise<TodoItem> {
        const logger = createLogger('update-todo');
        logger.info('Updating a todo item ', {...todo});

        await this.docClient.update({
            TableName: this.todoTable,
            Key: { 'todoId': id },
            UpdateExpression: 'set info.name = :n, info.done = :d, info.dueDate = :dt',
            ExpressionAttributeValues: {
                ':n' : todo.name,
                ':d' : todo.done,
                ':dt': todo.dueDate
            },
            ReturnValues: 'UPDATED_NEW'
        }).promise()

        return todo;
    }

    async GetItem(id: string): Promise<TodoItem> {
        const logger = createLogger('get-item');
        logger.info('Getting signle todo item');

        const result = await this.docClient.get({
            TableName: this.todoTable,
            Key: { 'todoId': id }
        }).promise();

        return result.Item as TodoItem;

    }

    async GetAllTodos(): Promise<TodoItem[]> {
        const logger = createLogger('get-todos');
        logger.info('Getting all todo items ');

        const result = await this.docClient.scan({
            TableName: this.todoTable
        }).promise();

        const items = result.Items;

        return items as TodoItem[];
    }

}