import React, { useState, useEffect, useRef } from "react";
import { List, Button, Input, Checkbox } from "antd";
import {TodoContent} from '../TodoContent'
import "./index.css";

const Store = window.require('electron-store');
const store = new Store();
if(!store.get('files')) {
  store.set('files', [])
}

export const TodoList = () => {
  const [list, setList] = useState(() => {
    const defaultList = store.get('files')
    return defaultList;
  });
  const [current, setCurrent] = useState(0)
  const focusRef = useRef(null);
  const addItem = () => {
    const newItemValue = {
      title: "",
      edit: true,
    };
    setList([newItemValue, ...list]);
    setCurrent(0)
  };

  const HeaderBtn = () => {
    return <>
    <Button type='primary' disabled={list.some((v) => v.edit)} onClick={() => addItem()}>新建</Button>
    <Button onClick={() => {store.clear();setList([])}}>清空</Button>
    {/* <Button onClick={() => {console.log(store.get())}}>look all</Button> */}
    </>;
  };

  const RenderItem = (item, index) => {
    const setItemvalue = (key, value) => {
      const newList = list.map((v, i) => {
        if (i === index) {
          v[key] = value;
        }
        return v;
      });
      setList(newList);
      store.set(`files`, newList);
    };
    const delTitle = () => {
      const newList = list.filter((v, i) => {
        
         return i !== index
      });
      setList(newList);
      store.set(`files`, newList);
    }

    return (
      <Input
        autoFocus
        value={item.title}
        onChange={({ target: { value } }) => {
          setItemvalue("title", value);
        }}
        onPressEnter={({ target: { value } }) => {
          setItemvalue("edit", false);
          focusRef.current.focus()
          if(!value) {
            delTitle()
          }
        }}
        onBlur={({ target: { value } }) => {
          setItemvalue("edit", false);
          if(!value) {
            delTitle()
          }
        }}
      />
    );
  };

  useEffect(() => {
    const fn = e => {
      if(e.keyCode === 8 && e.target.className !== 'ant-input') {
        const newList = list.filter((v, i) => {
        
          return i !== current
       });
       if(current === list.length - 1 ) {
        setCurrent(current - 1)
       }
       setList(newList);
       store.set(`files`, newList);
       
      }else if(e.keyCode === 13 && e.target.className !== 'ant-input') {
        addItem()
      }else if(e.keyCode === 27 && e.target.nodeName === 'TEXTAREA') {
        focusRef.current.blur()
      }
    }

    document.body.addEventListener('keydown', fn)
    return () => {
      document.body.removeEventListener('keydown',fn)
    }
  }, [current,list])

  return (
    <div className='box'>
      <div className="todo-list">
        <List
          header={HeaderBtn()}
          dataSource={list}
          renderItem={(item, index) => (
            <List.Item
              onClick={() => {
                setCurrent(index)
              }}
              onDoubleClick={() => {
                const newList = list.map((v, i) => {
                  if (i === index) {
                    v.edit = true;
                  }
                  return v;
                });
                setList(newList);
              }}
            >
              <div className={index === current ? "current item" : "item"}>
              {/* ({index + 1} - {current}) */}
              {item.edit ? RenderItem(item, index) : <div className={item.finshed ? "finshed" : ""}>
                <Checkbox checked={item.finshed} onChange={e => {
                  const newList = list.map((v, i) => {
                    if (i === index) {
                      v.finshed = e.target.checked;
                    }
                    return v;
                  });
                  setList(newList);
                  store.set(`files`, newList);
                }} />
                {item.title}
                </div>}
              </div>
            </List.Item>
          )}
        />
      </div>
      <div className="todo-content">
        <Input.TextArea
          ref={focusRef}
          onChange={({ target: { value } }) => {
            // setContent(value);
            const newList = list.map((v, i) => {
              if (i === current) {
                v.content = value;
              }
              return v;
            });
            setList(newList);
            store.set(`files`, newList);
          }}
          value={(list[current]) ? list[current].content : ''}
          autoFocus
        />
      </div>
      {/* <TodoContent
       content={(list[current]) ? list[current].content : ''}
       setContent={(value) => {
        const newList = list.map((v, i) => {
          if (i === current) {
            v.content = value;
          }
          return v;
        });
        setList(newList);
        store.set(`files`, newList);
       }} 
      /> */}
    </div>
  );
};
