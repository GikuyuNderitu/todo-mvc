import React, { Component } from 'react';
import {List} from 'immutable';
import './App.css';
import Hoverable from './Hoverable';

const todoCreator = (todo = '') => {
  let completed = false;
  return {
    getTodo(){ return todo},
    getCompleted() { return completed},
    setCompleted(status) {
      completed = status
      return {...this};
    },
    setTodo(newTodo) {
      todo = newTodo;
      return {...this};
    }
  }
}

const FILTERS = {
  completed(val) {
    return val.getCompleted();
  },
  active(val) {
    return !val.getCompleted();
  }
}

const completionMap = bool => val => val.setCompleted(bool)

const mergeObjects = (...objs) => objs.reduce((obj, cur) => ({...obj, ...cur}), {});

const todoStyles = {
  toggle: {
    padding: 0,
    margin: 0,
    flexGrow: 1
  },
  item: {
    flexGrow: 10,
    textAlign: 'left',
    display: 'flex',
    flexBasis: '1',
    margin: '5px 0' 
  },
  checkbox: {
    display: 'inline-block',
    margin: '0'
  },
  checkBoxLabel:{
    display: 'inline-block',
    width: '25px',
    height: '25px',
    borderRadius: '50%',
    border: '1px solid #aaa',
    transition: 'background 150ms ease-in'
  },
  checkBoxLabelActive: {
    background: 'palegreen'
  },
  checkBoxLabelHovered: {
    cursor: 'pointer',
    background: 'rgb(199, 247, 199)',
    transition: 'background 250ms ease-in'
  },
  input: {
    flex: 'inherit',
    fontSize: 'inherit',
    fontFamily: 'inherit',
    outline: 0,
    border: '1px solid salmon',
    padding: '2px 7px',
    color: 'salmon'
  },
  itemTextContainer: {
    display: 'flex',
    width: '100%'
  },
  text:{
    flex: 12,
    marginLeft: '20px',
    transition: 'color 200ms ease-in, text-decoration 150ms ease-in, background 200ms ease-in'
  },
  textHovered: {
    background: 'white'
  },
  completedText: {
    textDecoration: 'line-through',
    color: '#888'
  },
  clear: {
    marginLeft: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButton: {
    fontSize: '1.2em',
    color: 'salmon',
    background: 'transparent'
  }
}

const HoverText = props => (
  props.hovered ? <p>Hover Text Rendered</p> : <p>Non Hovered</p>
)

const CheckBoxHoverable = props => (
  <div style={todoStyles.checkbox}>
    <label style={mergeObjects(
      todoStyles.checkBoxLabel,
      props.hoverStyles,
      props.checked ? todoStyles.checkBoxLabelActive : {},
    )} htmlFor={props.checkboxId}></label>
    <input 
      style={{display: 'none'}}
      id={props.checkboxId}
      type="checkbox"
      checked={props.checked}
      onChange={()=>props.handleTodoToggle(props.idx)} />
  </div>
)

const CheckBox = props => (
  <Hoverable style={{flex: 1}} hoverStyles={todoStyles.checkBoxLabelHovered} render={({hovered, hoverStyles}) => (
    <CheckBoxHoverable hovered={hovered} hoverStyles={hoverStyles} {...props} />
  )} />
)

const NewTodo = (props) => (
  <div className="New-Todo">
    <button onClick={props.toggleAll}>&#8964;</button>
    <input 
      type="text"
      placeholder="What needs to be done?" 
      name="newTodo"
      value={props.newItem}
      onChange={props.handleTextChange}
      onKeyUp={props.handleKeyUp} />
  </div>
)

const TodoItemText = props => {
  const hovered = props.hovered === props.idx;
  return (
    <div
      onMouseEnter={() => props.setHover(props.idx)} 
      onMouseLeave={() => props.setHover(-1)} 
      style={todoStyles.itemTextContainer}>
      <p style={mergeObjects(todoStyles.text, props.todo.getCompleted() ? todoStyles.completedText : {})} onDoubleClick={() => props.makeEdit(props.idx)}>{props.todo.getTodo()}</p>
      {hovered && <div style={todoStyles.clear}>
        <button onClick={() => props.clearItem(props.idx)} style={todoStyles.clearButton}>{'\u274C'}</button>
      </div>}
    </div>
  )
}
const TodoItemTextArea = props => (
  <div style={todoStyles.item} >
    {props.editing !== props.idx && <TodoItemText 
                                        setHover={props.setHover}
                                        clearItem={props.clearItem}
                                        idx={props.idx} 
                                        todo={props.todo}
                                        hovered={props.hovered}
                                        makeEdit={props.makeEdit} />}

    {props.editing === props.idx && <input
                        style={todoStyles.input}
                        autoFocus
                        type="text" 
                        onChange={({target}) => props.handleEditing(target.value, props.idx)}
                        onBlur={props.handleSubmission}
                        value={props.todo.getTodo()} />}
  </div>
)

const TodoItem = (props) => (
  <div className="Todo-Item">
    <CheckBox
      idx={props.idx}
      checkboxId={"checkbox"+props.idx}
      checked={props.todo.getCompleted()}
      style={todoStyles.toggle}
      handleTodoToggle={props.handleTodoToggle}
      type="checkbox" />
    <TodoItemTextArea
      clearItem={props.clearItem}
      makeEdit={props.makeEdit}
      todo={props.todo}
      idx={props.idx}
      hovered={props.hovered}
      editing={props.editing}
      setHover={props.setHover}
      handleEditing={props.handleTodoEdit}
      handleSubmission={props.todoEditSubmit} />
  </div>
)

class TodoWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newTodo: '',
      todos: List(),
      view: '',
      editing: -1,
      hovered: -1
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTodoToggle = this.handleTodoToggle.bind(this);
    this.handleTodoEdit = this.handleTodoEdit.bind(this);
    this.toggleAll = this.toggleAll.bind(this);
    this.clearItem = this.clearItem.bind(this);
  }

  clearItem(idx) {
    const {todos} = this.state;
    this.setState({todos: todos.remove(idx)})
  }

  handleTodoEdit(val, idx) {
    const {todos} = this.state;
    const todo = todos.get(idx);
    this.setState({todos: todos.set(idx, todo.setTodo(val))})
  }

  makeEdit(idx) {
    this.setState({editing: idx})
  }

  handleChange({target}) {
    this.setState({[target.name]: target.value})
  }

  toggleAll() {
    const {todos} = this.state;
    const completed = todos.filter(FILTERS.completed);

    if(todos.size === completed.size) this.setState({todos: todos.map(completionMap(false))});
    else this.setState({todos: todos.map(completionMap(true))})
  }

  handleSubmit({key}) {
    if(key === 'Enter') {
      this.addItem();
    }
  }

  addItem() {
    this.setState({todos: this.state.todos.push(todoCreator(this.state.newTodo)), newTodo: ''})
  }

  handleTodoToggle(idx) {
    const {todos} = this.state;
    const todo = todos.get(idx);

    this.setState({todos: todos.set(idx, todo.setCompleted(!todo.getCompleted()))})
  }

  getTodos(view) {
    const {todos} = this.state;
    switch(view) {
      case 'active':
        return todos.filter(FILTERS.active);
      case 'completed':
        return todos.filter(FILTERS.completed);
      default:
        return todos;
    }
  }

  renderTodos() {
    return this.getTodos(this.state.view).map((todo, idx) => (
      <TodoItem
        key={idx}
        idx={idx}
        todo={todo}
        setHover={(idx) => this.setState({hovered: idx})}
        editing={this.state.editing}
        clearItem={this.clearItem}
        handleTodoToggle={this.handleTodoToggle}
        hovered={this.state.hovered}
        handleTodoEdit={this.handleTodoEdit}
        makeEdit={(editing) => this.setState({editing})}
        todoEditSubmit={() => this.setState({editing: -1})} />

    ))
  }

  clearCompleted() {
    this.setState({todos: this.state.todos.filter(FILTERS.active)})
  }

  render() {
    const {newTodo, todos, view} = this.state;
    const remaining = todos.filter(FILTERS.active).size;
    const sString = remaining === 1 ? '' : 's';
    
    return (
      <main className="Todo-wrapper">
        <NewTodo
          toggleAll={this.toggleAll}
          handleTextChange={this.handleChange}
          handleKeyUp={this.handleSubmit}
          newItem={newTodo} />
        {this.renderTodos()}
        <hr/>
        <div className="Todo-Filters">
          <span className="items-remaining">{`${remaining} item${sString} left`}</span>
          <div className="filter-buttons">
            <button 
              className={view === '' ? 'active' : ''}
              onClick={() => this.setState({view: ''})}>All</button>
            <button
              className={view === 'active' ? 'active' : ''}
              onClick={() => this.setState({view: 'active'})}>Active</button>
            <button
              className={view === 'completed' ? 'active' : ''}
              onClick={() => this.setState({view: 'completed'})}>Completed</button>
          </div>
          <div>
            {todos.size > remaining && <button onClick={() => this.clearCompleted()} className="remove-All">{`Clear Completed (${todos.size-remaining})`}</button>}
          </div>
        </div>
      </main>
    )
  }
}

const App = (props) => (
  <div className="App">
    <header>
      <h1 className="App-title">todos</h1>
    </header>
  
    <TodoWrapper />
  </div>
)

export default App;
