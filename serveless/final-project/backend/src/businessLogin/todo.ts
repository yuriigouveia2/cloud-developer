import * as uuid from 'uuid';
import { TodoAccess } from '../dataLayer/todoAccess';
import { TodoItem } from '../models/TodoItem';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';



const groupAccess = new TodoAccess();


export async function deleteItem(id: string): Promise<TodoItem[]> {
    return groupAccess.DeleteItem(id);
}

export async function getAllTodos(): Promise<TodoItem[]> {
    return groupAccess.GetAllTodos();
}

export async function getItem(id: string): Promise<TodoItem> {
    return groupAccess.GetItem(id);
}

export async function UpdateTodo(
    id: string,
    updatedTodo: UpdateTodoRequest,
    // jwtToken: string
): Promise<TodoItem> {

    // Should I send it from frontend?
    updatedTodo.done = new Date(updatedTodo.dueDate).getTime() <= new Date().getTime();

    const todo: TodoItem = await groupAccess.GetItem(id);

    return await groupAccess.UpdateTodo(id, {
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
    // jwtToken: string
): Promise<TodoItem> {

    const itemId = uuid.v4();
    // const userId = getUserId(jwtToken);
    const itemDone: boolean = new Date(createTodoRequest.dueDate).getTime() <= new Date().getTime(); 

    return await groupAccess.CreateTodo({
        todoId: itemId,
        userId: 'static-temporary-userId',
        name: createTodoRequest.name,
        createdAt: new Date().toISOString(),
        dueDate: createTodoRequest.dueDate,
        done: itemDone
    });
}