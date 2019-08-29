import * as uuid from 'uuid';
import { TodoAccess } from '../dataLayer/todoAccess';
import { TodoItem } from '../models/TodoItem';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';



const groupAccess = new TodoAccess();

export async function getAllTodos(): Promise<TodoItem[]> {
    return groupAccess.GetAllTodos();
}

export async function CreateTodo(
    createTodoRequest: CreateTodoRequest,
    // jwtToken: string
): Promise<TodoItem> {

    const itemId = uuid.v4();
    // const userId = getUserId(jwtToken);

    return await groupAccess.CreateTodo({
        todoId: itemId,
        userId: 'userId',
        name: createTodoRequest.name,
        createdAt: new Date().toISOString(),
        dueDate: new Date().toISOString(),
        done: false
    });
}