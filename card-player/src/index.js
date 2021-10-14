import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './card.css';
import $ from 'jquery';
import parse from 'html-react-parser';
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
        <Deck cards = {this.props.cards}/>
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
    // console.log(this.state.value);
    let urlCheck = this.state.value.split('/');
    let url;

    if(urlCheck[urlCheck.length -1] == 'api'){
      url = this.state.value;
    }else{
      url = this.state.value.concat('/api');
    }
    $.ajaxSetup({
      headers:{
        "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      }
    });

    fetch(url)
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

class Deck extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      name: 'no name',
      owner: 'player 1',
      cards: this.props.cards,
      back: null,
      clicks: 1,
    }
  }

  addClick = () => {
    this.setState({clicks: this.state.clicks + 1});
  }

  render(){
    const deck = this;
    return(
      <div>
        {
          this.props.cards.map((card, index) => 
            <Card 
            text = {card.outerHTML} 
            key = {index}
            clicks = {this.state.clicks}
            addClick = {this.addClick}
            />)
        }
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
      positionX: '50%',
      positionY: '50%',
      zIndex: '100',
      front: this.props.text,
      back: null,
    };
  }

  handleEvent = (event) => {
    //on click/mousedown
    if(event.type === "mousedown"){
      this.props.addClick();
      this.setState({
        zIndex: 1000 + this.props.clicks,
      })
    //on drag
    }else if(event.type === "drag"){
      //while dragging
      if(event.clientX !== 0 && event.clientY !== 0){
        this.setState({
        positionX: event.clientX + "px",
        positionY: event.clientY + "px",
      });
      //on drag release
      }else{
        this.setState({
        zIndex: 100 + this.props.clicks,
      });
      }
    }else if(event.type === "contextmenu"){
      event.preventDefault();
    }else{
      console.log(event.type);
    }
  }

  render(){
    return(
      <div className="cardWrap" 
      style={{
        top: this.state.positionY, 
        left: this.state.positionX,
        zIndex: this.state.zIndex,
      }}
      onClick={this.handleClick}
      onMouseDown={this.handleEvent}
      onMouseUp={this.handleEvent}
      onDrag={this.handleEvent}
      onContextMenu = {this.handleEvent}
      onDoubleClick = {this.handleEvent}
      >
        {parse(String(this.state.front))}
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
