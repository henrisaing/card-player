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
      cardBacks: [],
    };
  }

  callbackFunction = (childData) => {
    console.log(childData);
    let childCards = $.parseHTML(childData.items)[0].innerHTML;
    let cardBacks = $.parseHTML(childData.cardBack)[0].innerHTML;

    let deckCards;
    let div = document.createElement('div');
    div.innerHTML = childCards;
    deckCards = [].slice.call(div.getElementsByClassName("card"));

    // console.log(childData.cardBack);
    
    // console.log(cardBack);
    let cardBack;
    let cbDiv = document.createElement('div');
    cbDiv.innerHTML = cardBacks;
    cardBack = [].slice.call(cbDiv.getElementsByClassName("card"));
    console.log(cardBack[0]);
    this.setState({
      cards: deckCards,
      cardBacks: cardBack[0],
    });
    // console.log(childData.name);
    // console.log(deckCards);
  };

  render(){
    return(
      <div
        className="game">
        Game
        <DeckForm parentCallback = {this.callbackFunction}/>
        <Board 
        cards = {this.state.cards}
        backs = {this.state.cardBacks}
        />
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
    if(urlCheck[urlCheck.length -1] == 'api'){
      url = this.state.value;
    }else{
      url = this.state.value.concat('/api');
    }

    if(backUrlCheck[backUrlCheck.length -1] == 'api'){
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

    // fetch(backUrl)
    // .then(res => res.json())
    // .then(
    //   (result) => {
    //     console.log('cardback setstate');
    //     this.setState({
    //       cardBack: result.cards,
    //     });
    //     // this.props.parentCallback(this.state);
    //   },
    //   (error) => {
    //     console.log('backUrl error');
    //     this.setState({
    //       isLoaded: false,
    //       error
    //     });
    //   }
    // // );
    // console.log(this.state);
    // console.log(this.state.items);
    // console.log(this.state.name);
    // this.props.parentCallback(this.state);
    
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
          </label>
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
    console.log(this.props.backs);
    console.log(this.state.cards);
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
      showFront: true,
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
      console.log('context');
      console.log(this.state.back);
      console.log(this.state.front);
      this.setState({
        showFront: this.state.showFront ? false : true
      });
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
