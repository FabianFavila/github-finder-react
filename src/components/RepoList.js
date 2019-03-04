import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Detail from './Detail';
import axios from 'axios';


const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  avatar: {
    margin: 10,
  },
  listitem: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: fade(theme.palette.common.black, 0.25),
    },
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500],
  },
});


class RepoList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalOpen: false
    }

    this.eachRepo = this.eachRepo.bind(this);
    this.getDetails = this.getDetails.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.setState({ modalOpen: false });
  }

  seeDetails = (id) => () => {
    let currRepo = this.props.repos.filter(repo => repo.id == id);

    this.setState({
      modalOpen: true,
      currentRepo: currRepo[0]
    }, this.getDetails(currRepo[0].url));
  }

  getDetails(url) {
    axios.get(url + '/commits')
      .then(result => {
        this.setState({
          commits: result.data
        });
      })
      .then(() => {
        return axios.get(url + '/comments');
      }).then((result) => {
        this.setState({
          comments: result.data
        });
      })
      .then(() => {
        return axios.get(url + '/topics', { headers: { Accept: 'application/vnd.github.mercy-preview+json' } });
      }).then((result) => {
        this.setState({
          topics: result.data
        });
      })
      .catch(err => {
        this.props.errHandler(err);
      });
  }

  eachRepo(repo) {
    const { classes } = this.props;

    return (
      <ListItem onClick={this.seeDetails(repo.id)} className={classes.listitem} key={repo.id} index={repo.id}>
        <Avatar src={repo.owner.avatar_url} className={classes.avatar} />
        <ListItemText primary={repo.name} secondary={repo.full_name} />
      </ListItem>
    );
  }

  render() {
    const { classes, repos } = this.props;
    const { modalOpen, currentRepo, commits, comments, topics } = this.state;

    return (
      <div className="RepoList">
        <List className={classes.root}>
          {repos.map(this.eachRepo)}
          <Detail modalOpen={modalOpen} close={this.handleClose}
            repo={currentRepo} commits={commits} comments={comments} topics={topics} />
        </List>
      </div>
    );
  }
}

export default withStyles(styles)(RepoList);
