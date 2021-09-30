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
      cards: [],
    };
  }

  callbackFunction = (childData) => {
    let childCards = $.parseHTML(childData.items)[0].innerHTML;
    let deckCards;
    let div = document.createElement('div');

    div.innerHTML = childCards;
    deckCards = [].slice.call(div.getElementsByClassName("card"));

    this.setState({cards: deckCards});
    console.log(childData.name);
    console.log(deckCards);
  };

  render(){
    return(
      <div
        className="game">
        Game
        <DeckForm parentCallback = {this.callbackFunction}/>
        <Board cards = {this.state.cards}/>
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
      decks: [],
    };
    let cardsList = this.props.cards.map((card) => card);
    console.log(cardsList);
    console.log(this.props.cards);
  }

  render(){
    return(
      <div className="board">
        <Card/>
        {
          this.props.cards.map((card) => <Card text = {card.outerHTML}/>)
        }
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

    fetch(this.state.value)
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          isLoaded: true,
          items: result.cards,
          name: result.name
        });
        this.props.parentCallback(this.state);
      },
      (error) => {
        this.setState({
          isLoaded: false,
          error
        });
      }
    );

    // console.log(this.state.items);
    // console.log(this.state.name);
    
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
        {this.props.text}
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
