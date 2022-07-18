import makeStyles from "@mui/styles/makeStyles";
import { Typography, Button, Icon, Paper, Box, TextField } from "@mui/material";
import { useState } from "react";
import { createTodo } from "../../api/axios";
import PropTypes from "prop-types";
import dateformat from "dateformat";

const useStyles = makeStyles({
  addTodoButton: { marginLeft: 5 },
  todosContainer: { marginTop: 10, padding: 10 },
});

const CreateTodoForm = ({ setTodos }) => {
  const default_date = dateformat(new Date(), "yyyy-mm-dd");
  const classes = useStyles();
  const [error, setError] = useState("");
  const [newTodo, setNewTodo] = useState({
    text: "",
    due_date: default_date,
  });

  const handleChange = (e) => {
    setNewTodo((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emptyFields = Object.keys(newTodo).some((field) => {
      return !newTodo[field];
    });

    if (emptyFields) {
      setError("Please fill out all fields");
      return;
    }

    const todo = {
      text: newTodo.text,
      due_date: new Date(newTodo.due_date).getTime(),
    };

    createTodo(todo)
      .then((todo) => {
        setTodos((prevTodos) => [...prevTodos, todo]);
        setNewTodo({ text: "", due_date: default_date });
      })
      .catch((error) => {
        setError(error.toString());
      });
  };

  const handlePress = (event) => {
    event.preventDefault();

    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="create-todo">
      <Typography sx={{ marginY: 3 }} variant="h3" component="h1" gutterBottom>
        Todos
      </Typography>

      <Paper className={classes.addTodoContainer}>
        <Typography
          sx={{ textAlign: "center", paddingY: 2 }}
          variant="h5"
          gutterBottom
        >
          Create New Todo
        </Typography>

        {error && (
          <Typography
            sx={{ textAlign: "center", padding: 2 }}
            color="red"
            variant="body1"
            data-testid="errorMessage"
          >
            {error}
          </Typography>
        )}

        <Box
          sx={{ paddingX: 5, paddingY: 5 }}
          display="flex"
          flexDirection="row"
        >
          <TextField
            name="text"
            type="text"
            fullWidth
            value={newTodo.text}
            onChange={handleChange}
            sx={{ marginX: 2 }}
            placeholder="e.g Go Shopping"
          />

          <TextField
            type="date"
            name="due_date"
            fullWidth
            value={newTodo.due_date}
            onChange={handleChange}
            sx={{
              width: { sm: 200, md: 400 },
            }}
            data-testid="datetime"
          />

          <Button
            role="button"
            sx={{ marginX: 1, marginBottom: 3 }}
            className={classes.addTodoButton}
            startIcon={<Icon>add</Icon>}
            onClick={handleSubmit}
            onKeyPress={handlePress}
          >
            Add
          </Button>
        </Box>
      </Paper>
    </form>
  );
};

CreateTodoForm.propTypes = {
  setTodos: PropTypes.func.isRequired,
};

export default CreateTodoForm;
