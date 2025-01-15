import { useState } from 'react'
import OpenAI from 'openai'
import './App.css'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

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

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
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
        <button 
          className="ai-btn"
          onClick={async () => {
            try {
              const completion = await openai.chat.completions.create({
                messages: [
                  {
                    role: "system",
                    content: "You are a helpful assistant that suggests creative todo items."
                  },
                  {
                    role: "user",
                    content: "Suggest one creative todo sentence in Japanese."
                  }
                ],
                model: "gpt-3.5-turbo",
              });
              
              const suggestedTodo = completion.choices[0].message.content;
              if (suggestedTodo) {
                setNewTodo(suggestedTodo);
              }
            } catch (error) {
              console.error('Error generating todo:', error);
              alert('Failed to generate todo. Please check your API key.');
            }
          }}
        >
          AI
        </button>
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
            <button 
              className="delete-btn"
              onClick={() => deleteTodo(todo.id)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App
