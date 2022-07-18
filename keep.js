useEffect(() => {
  fetch('http://localhost:3001/')
    .then((response) => response.json())
    .then((todos) => setTodos(todos));
}, [setTodos]);

function addTodo(text) {
  fetch('http://localhost:3001/', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ text }),
  })
    .then((response) => response.json())
    .then((todo) => {
      setTodos([...todos, todo])
    });
  setNewTodoText('');
}

function toggleTodoCompleted(id) {
  fetch(`http://localhost:3001/${id}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify({
      completed: !todos.find((todo) => todo.id === id).completed,
    }),
  }).then(() => {
    const newTodos = [...todos];
    const modifiedTodoIndex = newTodos.findIndex((todo) => todo.id === id);
    newTodos[modifiedTodoIndex] = {
      ...newTodos[modifiedTodoIndex],
      completed: !newTodos[modifiedTodoIndex].completed,
    };

    setTodos(newTodos);
  });
}

function deleteTodo(id) {
  fetch(`http://localhost:3001/${id}`, {
    method: 'DELETE',
  }).then(() => {
    // setTodos(todos.filter((todo) => todo.id !== id))
  });
}


app.post('/seed', async (req, res) => {
  try {
    const todoArr = [
      { text: 'Todo A' },
      { text: 'Todo B' },
      { text: 'Todo C' },
      { text: 'Todo D' },
      { text: 'Todo E' },
      { text: 'Todo F' },
      { text: 'Todo G' },
      { text: 'Todo H' },
      { text: 'Todo I' },
      { text: 'Todo J' },
      { text: 'Todo K' },
      { text: 'Todo L' },
      { text: 'Todo M' },
      { text: 'Todo N' },
      { text: 'Todo O' },
      { text: 'Todo P' },
      { text: 'Todo Q' },
      { text: 'Todo R' },
      { text: 'Todo S' },
      { text: 'Todo T' },
      { text: 'Todo U' },
      { text: 'Todo V' },
      { text: 'Todo W' },
      { text: 'Todo X' },
      { text: 'Todo Y' },
      { text: 'Todo Z' },
    ];

    const todos = await database.client
      .db('todos')
      .collection('todos')
      .insertMany(todoArr);

    res.status(201).send(todos);
  } catch (error) {
    res.status(500).send(e);
  }
});

useEffect(() => {
  fetch(`http://localhost:3001/todos?page_number=${page_number}`)
    .then((response) => {
      setLoading(true);
      setError(false);
      return response.json();
    })
    .then((todos) => {
      setTodos((prevTodos) => [
        ...new Set([...prevTodos, ...todos.map((todo) => todo)]),
      ]);
      setLoading(false);
    })
    .catch((error) => {
      setError(true);
    });
}, [page_number]);


















import React, { useState, useRef, useCallback } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { Container, Typography, Paper, Box } from "@mui/material";
import TodoList from "./components/TodoList";
import CreateTodoForm from "./components/CreateTodoForm";
import useTodoHandler from "./hooks/useTodoHandler";
import { DragDropContext } from "react-beautiful-dnd";
import DroppableColumn from "./components/TodoList/DroppableColumn/index";

const useStyles = makeStyles({
  todosContainer: { marginTop: 10, padding: 10 },
});

function Todos() {
  const classes = useStyles();
  const observer = useRef();
  const [skip, setSkip] = useState(0);
  const {
    loading,
    error,
    todos,
    handleOnDragEnd,
    deleteTodo,
    toggleTodoCompleted,
  } = useTodoHandler(skip);

  const lastTodoElementRef = useCallback(
    (node) => {
      if (loading) {
        return;
      }

      if (observer.current) {
        return observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setSkip((prevSkip) => prevSkip + 5);
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [loading]
  );

  return (
    <Container maxWidth="md">
      <CreateTodoForm />

      {todos.length > 0 ? (
        <Paper className={classes.todosContainer}>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <DroppableColumn>
              {todos.map(({ id, text, due_date, completed }, index) => (
                <TodoList
                  key={id}
                  id={id}
                  index={index}
                  text={text}
                  due_date={due_date}
                  completed={completed}
                  deleteTodo={deleteTodo}
                  toggleTodoCompleted={toggleTodoCompleted}
                />
              ))}
            </DroppableColumn>
          </DragDropContext>
          {loading && <Typography>Loading...</Typography>}
          {error && <Typography>Error!</Typography>}
        </Paper>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 5,
          }}
        >
          <Typography variant="h5">No todo list yet!</Typography>
        </Box>
      )}
    </Container>
  );
}

export default Todos;

