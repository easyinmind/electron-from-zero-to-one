import React from "react";
import "./App.css";
import { TodoList } from "./components/TodoList";
import { TodoContent } from "./components/TodoContent";

function App() {
  return (
    <div className="App">
      <TodoList />
    </div>
  );
}

export default App;
