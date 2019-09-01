import * as uuid from 'uuid';
import { TodoAccess } from '../dataLayer/todoAccess';
import { TodoItem } from '../models/TodoItem';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { getUserId } from '../lambda/utils';
import { APIGatewayProxyEvent } from 'aws-lambda';



const groupAccess = new TodoAccess();
const bucketName = process.env.IMAGES_S3_BUCKET

export async function GenerateUrl(todoId: string) {
    return groupAccess.GenerateUrl(todoId);
}

export async function deleteItem(id: string, event: APIGatewayProxyEvent): Promise<TodoItem[]> {
    const userId = getUserId(event);
    return groupAccess.DeleteItem(id, userId);
}

export async function getAllTodos(event: APIGatewayProxyEvent): Promise<TodoItem[]> {
    const userId = getUserId(event);
    return groupAccess.GetAllTodos(userId);
}

export async function getItem(id: string, event: APIGatewayProxyEvent): Promise<TodoItem> {
    const userId = getUserId(event);
    return groupAccess.GetItem(id, userId);
}

export async function UpdateTodo(
    id: string,
    updatedTodo: UpdateTodoRequest,
    event: APIGatewayProxyEvent
): Promise<TodoItem> {

    const userId = getUserId(event);
    const todo: TodoItem = await groupAccess.GetItem(id, userId);

    return await groupAccess.UpdateTodo(id, userId, {
        todoId: id,
        createdAt: todo.createdAt,
        userId: todo.userId,
        dueDate: updatedTodo.dueDate,
        name: updatedTodo.name,
        done: updatedTodo.done
    });
}

export async function CreateTodo(
    createTodoRequest: CreateTodoRequest,
    event: APIGatewayProxyEvent
): Promise<TodoItem> {

    const itemId = uuid.v4();
    const userId = getUserId(event);
    const itemDone: boolean = new Date(createTodoRequest.dueDate).getTime() <= new Date().getTime(); 

    return await groupAccess.CreateTodo({
        todoId: itemId,
        userId: userId,
        name: createTodoRequest.name,
        createdAt: new Date().toISOString(),
        dueDate: createTodoRequest.dueDate,
        done: itemDone,
        attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${itemId}`
    });
}