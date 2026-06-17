import { BASE_URL } from "./baseUrl"
import CommonAPI from "./config"

export const fetchTodo = async () => {
    return CommonAPI("get", `${BASE_URL}/Todolist`, "")
}

export const addTodo = async (reqBody) => {
    return CommonAPI("post", `${BASE_URL}/Todolist`, reqBody)
}

export const deleteTodo = async (Id) => {
    return CommonAPI("delete", `${BASE_URL}/Todolist/${Id}`, {})
}

export const updateTodo = async (Id, reqBody) => {
    return CommonAPI("put", `${BASE_URL}/Todolist/${Id}`, reqBody)
}
