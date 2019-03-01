import React, { Component } from 'react';
import SearchBox from './components/SearchBox'
import RepoList from './components/RepoList'
import axios from 'axios'
import './styles/App.css';

const API = 'https://api.github.com/search/repositories?q=in:name,description+topic:';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      searchString: "",
      repos: [],
      isLoading: false,
      error: null
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.getRepos = this.getRepos.bind(this);
  }

  handleInputChange(newSearchString){
    this.setState({
      searchString: newSearchString,
      isLoading: true
    });
    this.getRepos();
  }

  getRepos(){
    axios.get(API + this.state.searchString)
      .then(result => this.setState({
        repos: result.data.items,
        isLoading: false
      }))
      .catch(error => this.setState({
        error,
        isLoading: false
      }));
  }

  render() {
    return (
      <div className="App">
        <SearchBox handleInputChange={this.handleInputChange}></SearchBox>
        <RepoList repos={this.state.repos}></RepoList>
      </div>
    );
  }
}

export default App;
