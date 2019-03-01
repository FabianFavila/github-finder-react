import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Detail from './Detail';


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
    this.seeDetails = this.seeDetails.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.setState({ modalOpen: false });
  }

  seeDetails() {
    this.setState({ 
      modalOpen: true, 
      currentRepo: this.props.repos.filter(repo => repo.id === this._newitem.props.index ) 
    });
  }

  eachRepo(repo, i) {
    const { classes } = this.props;

    return (
      <ListItem ref={item => this._newitem = item} onClick={this.seeDetails} className={classes.listitem} key={repo.id} index={repo.id}>
        <Avatar src={repo.owner.avatar_url} className={classes.avatar} />
        <ListItemText primary={repo.name} secondary={repo.full_name} />
      </ListItem>
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <div className="RepoList">
        <List className={classes.root}>
          {this.props.repos.map(this.eachRepo)}
          <Detail modalOpen={this.state.modalOpen} close={this.handleClose} repo={this.state.currentRepo} />
        </List>
      </div>
    );
  }
}

export default withStyles(styles)(RepoList);
