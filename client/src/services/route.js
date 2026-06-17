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

export const registerUser = async (reqBody) => {
    return CommonAPI("post", `${BASE_URL}/users`, reqBody)
}

export const loginUser = async (reqBody) => {
    try {
        const url = `${BASE_URL}/users?email=${encodeURIComponent(reqBody.email)}&password=${encodeURIComponent(reqBody.password)}`
        const response = await CommonAPI("get", url, "")
        
        if (response && response.data && response.data.length > 0) {
            return {
                status: 200,
                data: response.data[0]
            }
        } else {
            const error = new Error("Invalid email or password")
            error.response = { status: 401, data: { message: "Invalid email or password" } }
            throw error
        }
    } catch (error) {
        throw error
    }
}