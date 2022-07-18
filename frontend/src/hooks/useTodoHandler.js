import { useEffect, useState } from "react";
import { getTodos, toggleCompleted, removeTodo } from "../api/axios";
import isOverdue from "../helper/isOverdue";

const useTodoHandler = (page_number = 0) => {
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState({});
  const [isError, setIsError] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [filter, setFilter] = useState(false);

  useEffect(() => {
    setLoading(true);
    setIsError(false);
    setError({});

    //This will cancel the request when the component unmount
    const controller = new AbortController();
    const { signal } = controller;

    getTodos(page_number, { signal })
      .then((todos) => {
        setTodos((prevTodos) => [...prevTodos, ...todos]);
        setHasNextPage(Boolean(todos.length));
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (signal.aborted) return;
        setIsError(true);
        setError({ message: error.message });
      });

    // Anytime the component unmount it will abort the controller;
    return () => controller.abort();
  }, [page_number]);

  const filteredTodo = todos.filter((todo) => {
    return !filter || isOverdue(todo);
  });

  const filterTodo = () => {
    setFilter(!filter);
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(filteredTodo);
    const [reorderItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderItem);

    setTodos(items); // Todo no update properly after dragging and dropping
  };

  const toggleTodoCompleted = (id) => {
    const completed = !todos.find((todo) => todo.id === id).completed;

    toggleCompleted({ completed }, id).then(() => {
      const newTodos = [...todos];
      const modifiedTodoIndex = newTodos.findIndex((todo) => todo.id === id);
      newTodos[modifiedTodoIndex] = {
        ...newTodos[modifiedTodoIndex],
        completed: !newTodos[modifiedTodoIndex].completed,
      };

      setTodos(newTodos);
    });
  };

  const deleteTodo = (id) => {
    removeTodo(id).then(() => {
      setTodos(todos.filter((todo) => todo.id !== id));
    });
  };

  return {
    error,
    loading,
    isError,
    filter,
    hasNextPage,
    filteredTodo,
    setTodos,
    deleteTodo,
    filterTodo,
    handleOnDragEnd,
    toggleTodoCompleted,
  };
};

export default useTodoHandler;

// const filteredTodo = todos.filter((todo) => {
//   return !filter || isOverdue(todo);
// });

// const filterTodo = () => {
//   setFilter(!filter);
// };
