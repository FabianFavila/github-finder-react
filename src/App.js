import React, { Component } from 'react';
import SearchBox from './components/SearchBox'
import RepoList from './components/RepoList'
import './styles/App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <SearchBox></SearchBox>
        <RepoList></RepoList>
      </div>
    );
  }
}

export default App;
