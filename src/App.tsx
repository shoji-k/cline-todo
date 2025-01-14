import { useState } from 'react'
import './App.css'

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (newTodo.trim() === '') return;
    setTodos([...todos, {
      id: Date.now(),
      text: newTodo,
      completed: false
    }]);
    setNewTodo('');
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? {...todo, completed: !todo.completed} : todo
    ));
  };

  return (
    <div className="app">
      <h1>Todo App</h1>
      <div className="add-todo">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add new todo..."
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span>{todo.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App
