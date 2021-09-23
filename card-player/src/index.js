import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

class Game extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      decks: Array(10).fill(null),
    };
  }

  render(){
    return(
      <div className="game">
        test
        <Card/>
      </div>
      );
  }
}

class Card extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      name: 'abc',
    };
  }

  render(){
    return(
      <div className="card">
        card
      </div>
      );
  }

}

export default function CardDrag({isDragging, text}){
  const [{opacity}, dragRef] = useDrag(
    () => ({
      type: ItemTypes.CARDDRAG,
      item: {text},
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.5 : 1
      })
    }),
    []
  )

  return(
    <div ref={dragRef} style={{opacity}}>
      {text}
    </div>
  )
}

ReactDOM.render(
  <Game/>,
  document.getElementById('root')
  );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
