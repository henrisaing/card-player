import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './card.css';
import $ from 'jquery';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

/*
* Game class, highest level parent.
* Holds all other elements.
*
* @class
*/
class Game extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      decks: Array(10).fill(null),
    };
  }

  render(){
    return(
      <div
        className="game">
        Game
        <DeckForm/>
        <Board/>
      </div>
      );
  }
}

/*
* Board class, parent.
* Holds Card-class children.
*
* @class
*/
class Board extends React.Component{
  constructor(props){
    super(props);
    this.state = {

    };
  }

  render(){
    return(
      <div className="board">
        Board
        <Card/>
      </div>
    );
  }
}

class DeckForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      value: '',
      error: null,
      isLoaded: false,
      items: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event){
    this.setState({
      value: event.target.value
    });
  }

  handleSubmit(event){
    $.ajaxSetup({
      headers:{
        "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      }
    });
    let cards = [];
    fetch(this.state.value)
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          isLoaded: true,
          items: result.cards,
          name: result.name
        });
        
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    );

    console.log(this.state);
    console.log(this.state.name);
    event.preventDefault();
  }

  render(){
    return(
      <div className="deck-form">
        <form onSubmit={this.handleSubmit}>
          <label> Deck:
            <input 
              type="text" 
              value={this.state.value}
              onChange={this.handleChange}
            />
          </label>
          <input type="submit" value="Get Deck" />

        </form>
      </div>
    );
  }

}


/*
* Board class, parent.
* Holds Card-class children.
*
* @class
*/
class Card extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      name: 'abc',
      positionX: 0,
      positionY: 0,
      front: null,
      back: null,
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


ReactDOM.render(
  <Game/>,
  document.getElementById('root')
  );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
