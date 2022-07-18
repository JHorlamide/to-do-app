const isOverdue = (todo) => {
  return todo.due_date <= new Date().getTime();
};

export default isOverdue;
