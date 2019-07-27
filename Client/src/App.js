import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import CanvasComponent from "./Components/Canvas/CanvasComponent";

class App extends Component {

    constructor(){
        super();
        this.state = {
            strokeColor: '#000000'
        };
        this.onColorChange = this.onColorChange.bind(this);
    }

    onColorChange(e) {
        this.setState({
            strokeColor: e.target.value
        })
    }

  render() {
    return (
        <div>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">React Drawboard</h1>
        </header>
      </div>
            <div className={'container'} >
                <span> <CanvasComponent
                strokeColor = {this.state.strokeColor} /> </span>
                <span> <input id = 'colorPicker' value={this.state.strokeColor}
                              onChange={this.onColorChange} type={'color'}/> </span>
            </div>
        </div>
    );
  }
}

export default App;
