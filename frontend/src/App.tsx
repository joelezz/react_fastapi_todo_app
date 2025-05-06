// App.js
import './App.css'
import React from 'react'

// Base API URL to make the code more maintainable
const API_BASE_URL = 'http://127.0.0.1:8000/todos';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      list: [],
      isLoading: false,
      isAdding: false,
      deletingIds: [],
      error: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleAddTask = this.handleAddTask.bind(this);
    this.handleDeleteTask = this.handleDeleteTask.bind(this);
  }

  componentDidMount() {
    this.fetchTasks();
  }

  fetchTasks = async () => {
    this.setState({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      if (!response.ok) {
        throw new Error(`Failed to fetch tasks (Status: ${response.status})`);
      }
      const data = await response.json();
      this.setState({ list: data, isLoading: false });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      this.setState({ 
        error: `Error fetching tasks: ${error.message}`, 
        isLoading: false 
      });
    }
  }

  handleChange(event) {
    this.setState({ input: event.target.value });
  }

  handleAddTask = async () => {
    if (this.state.input.trim() === '') return;
    
    this.setState({ isAdding: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: this.state.input }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to add task (Status: ${response.status})`);
      }
      
      const newTask = await response.json();
      
      this.setState((prevState) => ({
        list: [...prevState.list, newTask],
        input: '',
        isAdding: false
      }));
    } catch (error) {
      console.error('Error adding task:', error);
      this.setState({ 
        error: `Error adding task: ${error.message}`, 
        isAdding: false 
      });
    }
  }

  handleDeleteTask = async (taskId) => {
    this.setState(prevState => ({ 
      deletingIds: [...prevState.deletingIds, taskId],
      error: null 
    }));
    
    try {
      const response = await fetch(`${API_BASE_URL}/${taskId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete task (Status: ${response.status})`);
      }
      
      this.setState(prevState => ({
        list: prevState.list.filter(task => task.id !== taskId),
        deletingIds: prevState.deletingIds.filter(id => id !== taskId)
      }));
    } catch (error) {
      console.error('Error deleting task:', error);
      this.setState(prevState => ({ 
        error: `Error deleting task: ${error.message}`,
        deletingIds: prevState.deletingIds.filter(id => id !== taskId)
      }));
    }
  }

  handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      this.handleAddTask();
    }
  }

  render() {
    const { input, list, isLoading, isAdding, deletingIds, error } = this.state;
    
    return (
      <div className="todo-app">
        <h1 className="app-title">Todo App</h1>
        
        {error && (
          <div className="error-message">
            {error}
            <button 
              className="dismiss-error" 
              onClick={() => this.setState({ error: null })}
            >
              ✕
            </button>
          </div>
        )}
        
        <div className="task-input">
          <input 
            value={input} 
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
            placeholder="Enter a task"
            disabled={isAdding}
          />
          <button 
            type="button" 
            onClick={this.handleAddTask} 
            disabled={isAdding || input.trim() === ''}
            className="add-button"
          >
            {isAdding ? 'Adding...' : 'Add Task'}
          </button>
        </div>
        
        {isLoading ? (
          <div className="loading-message">Loading tasks...</div>
        ) : (
          <>
            {list.length > 0 ? (
              <ul className="task-list">
                {list.map((task) => (
                  <li key={task.id} className="task-item">
                    <span className="task-title">{task.task}</span>
                    <button 
                      onClick={() => this.handleDeleteTask(task.id)}
                      disabled={deletingIds.includes(task.id)}
                      className="delete-button"
                    >
                      {deletingIds.includes(task.id) ? 'Deleting...' : 'Delete'}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-list">No tasks yet. Add your first task!</div>
            )}

      
           
          </>
        )}
      </div>
    );
  }
}

export default App;