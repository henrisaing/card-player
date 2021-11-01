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
      decks: [],
      cards: [],
      cardBacks: [],
      counters: [],
    };
  }

  callbackFunction = (childData) => {
    let childCards = $.parseHTML(childData.items)[0].innerHTML;
    let cardBacks = $.parseHTML(childData.cardBack)[0].innerHTML;

    let deckCards;
    let div = document.createElement('div');
    div.innerHTML = childCards;
    deckCards = [].slice.call(div.getElementsByClassName("card"));

    let cardBack;
    let cbDiv = document.createElement('div');
    cbDiv.innerHTML = cardBacks;
    cardBack = [].slice.call(cbDiv.getElementsByClassName("card"));

    this.setState({
      cards: deckCards,
      cardBacks: cardBack[0],
    });
  };

  addCounter = (event) => {
    console.log('counter');
    this.setState({
      counters: this.state.counters.concat([0])
    });
  }

  render(){
    return(
      <div
        className="game">

        <button onClick={this.addCounter}>Add Counter</button>
        <DeckForm parentCallback = {this.callbackFunction}/>
        <Board 
        cards = {this.state.cards}
        backs = {this.state.cardBacks}
        />

        {
          this.state.counters.map((counter, index) => 
            <Counter 
            value = {counter}
            key = {index}
            />)
        }
      </div>
      );
  }
}

class Counter extends React.Component{
  constructor(props){
    super(props);
    this.state ={
      value: this.props.value,
      positionX: "10%",
      positionY: "10%",
    }
  }

  handleEvent = (event) => {
    if(event.type === "drag"){
      //while dragging
      if(event.clientX !== 0 && event.clientY !== 0){
        this.setState({
          positionX: event.clientX + "px",
          positionY: event.clientY + "px",
        });
      }
    }
  }

  updateCounter = (event) => {
    console.log(event);
    this.setState({
      value: parseInt(event.target.value),
    });
  }

  //gets button clicked
  //add buttons value to this.state.value
  buttonClick = (event) => {
    switch(event.target.attributes[0].value){
      case "1000":
        this.setState({value: (this.state.value + 1000)});
        break;

      case "100":
        this.setState({value: (this.state.value + 100)});
        break;

      case "10":
        this.setState({value: (this.state.value + 10)});
        break;

      case "1":
        this.setState({value: (this.state.value + 1)});
        break;

      case "-1000":
        this.setState({value: (this.state.value - 1000)});
        break;

      case "-100":
        this.setState({value: (this.state.value - 100)});
        break;

      case "-10":
        this.setState({value: (this.state.value - 10)});
        break;

      case "-1":
        this.setState({value: (this.state.value - 1)});
        break;

      default:
    }
  }

  render(){
    return(
      <div 
      className="counter" 
      draggable="true"
      onDrag={this.handleEvent}
      style={{
        top: this.state.positionY, 
        left: this.state.positionX,
      }}
      >
        <div className="button-bar-top">
          <button onClick={this.buttonClick} value="1000">+</button>
          <button onClick={this.buttonClick} value="100">+</button>
          <button onClick={this.buttonClick} value="10">+</button>
          <button onClick={this.buttonClick} value="1">+</button>
        </div>
        <span><input onChange={this.updateCounter} type="number" value={this.state.value}/></span>

        <div className="button-bar-bottom">
          <button onClick={this.buttonClick} value="-1000">-</button>
          <button onClick={this.buttonClick} value="-100">-</button>
          <button onClick={this.buttonClick} value="-10">-</button>
          <button onClick={this.buttonClick} value="-1">-</button>
        </div>
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
    // let cardsList = this.props.cards.map((card) => card);
  }

  render(){
    return(
      <div className="board">
        <Deck 
        cards = {this.props.cards}
        backs = {this.props.backs}
        />
      </div>
    );
  }
}

class DeckForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      value: '',
      back: '',
      error: null,
      isLoaded: false,
      items: [],
      cardBack: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeBack = this.handleChangeBack.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event){
    this.setState({
      value: event.target.value,
    });
  }

  handleChangeBack(event){
    this.setState({
      back: event.target.value,
    });
  }

  handleSubmit(event){
    event.preventDefault();
    // console.log(this.state.value);
    let urlCheck = this.state.value.split('/');
    let url;
    let backUrl;
    let backUrlCheck = this.state.back.split('/');
    console.log(this.state.value);
    console.log(this.state.back);
    if(urlCheck[urlCheck.length -1] === 'api'){
      url = this.state.value;
    }else{
      url = this.state.value.concat('/api');
    }

    if(backUrlCheck[backUrlCheck.length -1] === 'api'){
      backUrl = this.state.back;
    }else{
      backUrl = this.state.back.concat('/api');
    }
    $.ajaxSetup({
      headers:{
        "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      }
    });

    // loads front, 
    //then loads back, 
    //then sends callback
    //super nasty code REFACTOR LATER
    fetch(url)
    .then(res => res.json())
    .then(
      (result) => {
        console.log('front setstate');
        this.setState({
          isLoaded: true,
          items: result.cards,
          name: result.name
        });
        // this.props.parentCallback(this.state);

        //gets card back
        fetch(backUrl)
        .then(res => res.json())
        .then(
          (result) => {
            console.log('cardback setstate');
            this.setState({
              cardBack: result.cards,
            });
            this.props.parentCallback(this.state);
          },
          (error) => {
            console.log('backUrl error');
            this.setState({
              isLoaded: false,
              error
            });
          }
        );
      },
      (error) => {
        console.log('url error');
        this.setState({
          isLoaded: false,
          error
        });
      }
    );
    
  }

  render(){
    return(
      <div className="deck-form">
        <form onSubmit={this.handleSubmit}>
          <label> Deck:
            <input 
              name="card"
              type="text" 
              value={this.state.value}
              onChange={this.handleChange}
            />
          </label> <br/>
          <label> Back:
            <input 
              name="cardBack"
              type="text" 
              value={this.state.back}
              onChange={this.handleChangeBack}
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
      back: this.props.backs,
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
            back = {this.props.backs.outerHTML}
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
      back: this.props.back,
      showFront: false,
      scale: 0.5,
    };
  }

  handleEvent = (event) => {
    //on click/mousedown
    console.log(event.button)
    if(event.type === "mousedown"){
      console.log('mousedown:'+this.props.clicks);
      this.props.addClick();
      this.setState({
        zIndex: 100 + this.props.clicks,
      })

      if(event.button === 1){
        console.log("middle mouse");
        console.log(this);

        if(this.state.scale === 0.5){
          this.setState({scale:1.0});
        }else{
          this.setState({scale: 0.5});
        }
      }
    //on drag
    }else if(event.type === "drag"){
      //while dragging
      if(event.clientX !== 0 && event.clientY !== 0){
        this.setState({
        positionX: event.clientX + "px",
        positionY: event.clientY + "px",
      });
      }else{
        //on drag release
      }
    }else if(event.type === "click"){
      console.log('click event');
    }else if(event.type === "dblclick"){
      this.setState({
        showFront: this.state.showFront ? false : true
      });
    }else if(event.type === "contextmenu"){
      event.preventDefault();
    }else{
      console.log(event.type+":"+this.props.clicks);
    }
  }

  render(){
    return(
      <div className="cardWrap" 
      style={{
        top: this.state.positionY, 
        left: this.state.positionX,
        zIndex: this.state.zIndex,
        transform: 'translate(-50%, -50%) scale('+this.state.scale+')',
      }}
      onMouseDown={this.handleEvent}
      onMouseUp={this.handleEvent}
      onDrag={this.handleEvent}
      onContextMenu = {this.handleEvent}
      onDoubleClick = {this.handleEvent}
      draggable = "false"
      >
        {this.state.showFront ? parse(String(this.state.front)) : parse(String(this.state.back))}
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
