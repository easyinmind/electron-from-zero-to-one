import React from "react";
import { Input } from "antd";
import "./index.css";
export const TodoContent = ({content, setContent}) => {

  return (
    <div className="todo-content">
      <Input.TextArea
        className='text-area-focus'
        onChange={({ target: { value } }) => {
          setContent(value);
        }}
        value={content}
        autoFocus
      />
    </div>
  );
};
