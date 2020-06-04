import React, { useState, useEffect, useRef } from "react";
import { List, Button, Input, Checkbox, Empty } from "antd";
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
    return <div style={{display: 'flex',justifyContent: 'space-between'}}>
    <Button type='primary' disabled={list.some((v) => v.edit)} onClick={() => addItem()}>新建</Button>
    <Button onClick={() => {store.clear();setList([])}}>清空</Button>
    {/* <Button onClick={() => {console.log(store.get())}}>look all</Button> */}
    </div>;
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
          locale={{emptyText: <div>还没有添加备忘哦...<br />^v^</div>}}
          renderItem={(item, index) => (
            <List.Item
              onClick={() => {
                setCurrent(index)
              }}
              onDoubleClick={() => {
                if(item.finshed) {
                  return
                }
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
              {item.edit ? RenderItem(item, index) : <div className={item.finshed ? "finshed text" : "text"}>
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
                <div className="title">
                {item.title}
                </div>
                </div>}
              </div>
            </List.Item>
          )}
        />
      </div>
      <div className={list[current] && list[current].finshed ? "todo-content-finshed" : "todo-content"}>
        <Input.TextArea
          ref={focusRef}
          disabled={list.length === 0 || list[current] && list[current].finshed}
          placeholder={list.length === 0 ? '回车添加备忘' : ''}
          onChange={({ target: { value } }) => {
            const newList = list.map((v, i) => {
              if (i === current) {
                v.content = value;
              }
              return v;
            });
            setList(newList);
            store.set(`files`, newList);
          }}
          value={list[current] && list[current].content ? list[current].content : ''}
          autoFocus
        />}
      </div>
    </div>
  );
};
