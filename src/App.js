import React, { Component } from 'react';
import SearchBox from './components/SearchBox'
import RepoList from './components/RepoList'
import axios from 'axios'
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';

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
    this.handleError = this.handleError.bind(this);
    this.getRepos = this.getRepos.bind(this);
  }

  handleInputChange(newSearchString) {
    this.setState({
      searchString: newSearchString,
      isLoading: true
    }, this.getRepos);

  }

  handleError(error){
    this.setState({
      error,
      isLoading: false
    });
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
    const { isLoading, error, repos, searchString } = this.state;

    return (
      <div className="App">
        <SearchBox handleInputChange={this.handleInputChange}></SearchBox>
        {isLoading && <div className={classes.root}>
          <LinearProgress color="secondary" />
        </div>
        }
        <RepoList repos={repos} errHandler={this.handleError}></RepoList>
        {repos.length == 0 && searchString != "" && 
          <Typography component="div" style={{ padding: 8 * 3 }}><h1>Unfortunately, there were no results :(</h1></Typography>
        }
        {error != null && 
          <Snackbar autoHideDuration={5000} anchorOrigin={{horizontal:'right', vertical:'bottom'}}>
          <SnackbarContent
            className={classes.snackbar}
            message={error.toString()} /></Snackbar>
        }
        {searchString == '' && <Typography component="div" style={{ padding: 8 * 3 }}>
          <h1>Start typing a keyword on the text box from the top bar :) </h1>
        </Typography>}
      </div>
    );
  }
}

export default withStyles(styles)(App);
