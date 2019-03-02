import React, { Component } from 'react';
import SearchBox from './components/SearchBox'
import RepoList from './components/RepoList'
import axios from 'axios'
import './styles/App.css';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Snackbar from '@material-ui/core/Snackbar';

const API = 'https://api.github.com/search/repositories?q=in:name,description+topic:';

const styles = theme => ({
  snackbar: {
    margin: theme.spacing.unit,
  },
  root: {
    flexGrow: 1,
  },
});

class App extends Component {
  constructor(props) {
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

  handleInputChange(newSearchString) {
    this.setState({
      searchString: newSearchString,
      isLoading: true
    }, this.getRepos);

  }

  getRepos() {
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
    const { classes } = this.props;

    return (
      <div className="App">
        <SearchBox handleInputChange={this.handleInputChange}></SearchBox>
        {this.state.isLoading == true && <div className={classes.root}>
          <LinearProgress color="secondary" />
        </div>
        }
        <RepoList repos={this.state.repos}></RepoList>
        {this.state.error != null && 
          <Snackbar autoHideDuration={5000} anchorOrigin={{horizontal:'right', vertical:'bottom'}}>
          <SnackbarContent
            className={classes.snackbar}
            message={this.state.error.toString()} /></Snackbar>
        }
      </div>
    );
  }
}

export default withStyles(styles)(App);
