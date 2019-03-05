import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DialogContentText from '@material-ui/core/DialogContentText';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';


const DialogTitle = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500],
  },
}))(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit,
  },
}))(MuiDialogActions);

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
});

const InformationTab = ({
  currRepo: {
    html_url,
    name,
    full_name,
    created_at,
    description,
    updated_at,
    license,
    language,
    watchers_count,
    forks_count,
    owner
    }
  }) => {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      <h1>General Information</h1>
      <h2>Name: </h2><a href={html_url}>{name}</a>
      <h2>Full name: </h2>{full_name}
      <h2>Date Created: </h2>{created_at}
      <h2>Description: </h2>{description}
      <h2>Last update: </h2>{updated_at}
      <h2>License: </h2>{license.name}
      <h2>Language: </h2>{language}
      <h2>Watchers: </h2>{watchers_count}
      <h2>Forks: </h2>{forks_count}
      <h1>Author</h1>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt="Author" src={owner.avatar_url} />
        </ListItemAvatar>
        <ListItemText
          primary={owner.login}
          secondary={<a href={owner.html_url}>{owner.html_url}</a>}
        />
      </ListItem>
    </Typography>
  );
};

const CommitsTab = ({
    commits,
    classes:{ root, inline }
  }) => {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      <List className={root}>
        {commits.map(({ commit:{author,message}, author:{avatar_url} }) =>
          <ListItem alignItems="flex-start">
            {author && <ListItemAvatar>
              <Avatar alt={author.name} src={avatar_url} />
            </ListItemAvatar>}
            <ListItemText
              primary={message}
              secondary={
                <React.Fragment>
                  <Typography component="span" className={inline} color="textPrimary">
                    {author.name} -
                  </Typography>
                  {author.date}
                </React.Fragment>
              }
            />
          </ListItem>
        )}
      </List>
    </Typography>
  );
}

const CommentsTab = ({
    comments,
    classes:{ root, inline }
  }) => {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {comments && <List className={root}>
        {comments.map(({ user:{login,avatar_url}, html_url, body, created_at} ) =>
          <ListItem alignItems="flex-start">
            {avatar_url && <ListItemAvatar>
              <Avatar alt={login} src={avatar_url} />
            </ListItemAvatar>}
            <ListItemText
              primary={<a href={html_url}>{body}</a>}
              secondary={
                <React.Fragment>
                  <Typography component="span" className={inline} color="textPrimary">
                    {login} -
                  </Typography>
                  {created_at}
                </React.Fragment>
              }
            />
          </ListItem>
        )}
      </List>}
    </Typography>
  );
}

function TopicsTab(props) {
  const { topics } = props;

  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {topics && <div>
        {topics.names.map((topic) => <List component="nav">
          <ListItem button>
            <ListItemText primary={topic} />
          </ListItem>
        </List>)}
      </div>}
    </Typography>
  );
}

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    }

    if (Object.entries(props.repo).length === 0) {
      return null;
    }
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { modalOpen, close, repo, commits, comments, topics, classes } = this.props;
    const { value } = this.state;

    return (
      <Dialog
        onClose={close}
        aria-labelledby="customized-dialog-title"
        open={modalOpen}
        maxWidth='lg'
        fullWidth={true}
      >
        <DialogTitle id="customized-dialog-title" onClose={close}>
          Repository Details
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            <DialogContentText>
              <div className={classes.root}>
                <AppBar position="static">
                  <Tabs value={value} onChange={this.handleChange} centered>
                    <Tab label="Information" />
                    <Tab label="Commits" />
                    <Tab label="Comments" />
                    <Tab label="Topics" />
                  </Tabs>
                </AppBar>
                {value === 0 && <InformationTab classes={classes} currRepo={repo} />}
                {value === 1 && <CommitsTab classes={classes} commits={commits} />}
                {value === 2 && <CommentsTab classes={classes} comments={comments} />}
                {value === 3 && <TopicsTab classes={classes} topics={topics} />}
              </div>
            </DialogContentText>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={close} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

}

Detail.defaultProps = {
  repo: {}
};

export default withStyles(styles)(Detail);;
