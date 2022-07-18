import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001/",
});

export const getTodos = async (page_number = 0, options = {}) => {
  const response = await api.get(`/todos?page_number=${page_number}`, options);
  return response.data;
};

export const createTodo = async (todo_object) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  const response = await api.post(
    "/todos",
    JSON.stringify(todo_object),
    config
  );

  return response.data;
};

export const toggleCompleted = async (todo_object, todo_id) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  const response = await api.put(
    `/todos/${todo_id}`,
    JSON.stringify(todo_object),
    config
  );

  return response.data;
};

export const removeTodo = async (todo_id) => {
  const response = await api.delete(`/todos/${todo_id}`);
  return response.data;
};
