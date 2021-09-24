import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
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
    fetch(this.state.value)
    // fetch("https://reqres.in/api/users?page=2")
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          isLoaded: true,
          items: result.items
        });
        console.log('result');
        console.log(result);
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
        console.log('error')
      }
    )
    alert(
      'Data was submitted: ' +
      this.state.value
    );
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
