import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    numComments: 3,
    points: 4,
    objectID: 0,
    order: 0,
  },
  {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    numComments: 2,
    points: 100,
    objectID: 1,
    order: 1,
  }
];

function Search({value, onChange, children}) {
  return (
    <form>
      {children}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)} />
    </form>
  );
}

function Table({list, pattern, onRemove}) {
  const isSearched = item => !pattern || item.title.toLowerCase().includes(pattern.toLowerCase());

  const largeColumn = {
    width: '40%',
  };
  const midColumn = {
    width: '30%',
  };
  const smallColumn = {
    width: '10%',
  };

  return (
    <div className="table">
      {
        list.sort((item1, item2) => item1.order - item2.order)
            .filter(isSearched)
            .map(item =>
              <div key={item.objectID} className="table-row">
                <span style={largeColumn}>
                  <a href={item.url}>{item.title}</a>
                </span>
                <span style={midColumn}>{item.author}</span>
                <span style={smallColumn}>{item.numComments}</span>
                <span style={smallColumn}>{item.points}</span>
                <span style={smallColumn}>
                  <button
                    className="button-inline"
                    onClick={() => onRemove(item.objectID)}>Remove</button>
                </span>
              </div>)
      }
     </div>
  );
}

class NewArticle extends Component {

  constructor(props) {
    super(props);

    this.state = {
      newArticle: { url: '', title: '', author: '' }
    };

    this.onAdd = this.onSubmit.bind(this);
    this.onTextChanged = this.onTextChanged.bind(this);
  }

  onTextChanged(event, attr) {
    const target = event.target;

    this.setState((prevState, props) => {
      const newArticle = prevState.newArticle;

      newArticle[attr] = target.value;

      return { newArticle };
    });
  }

  onSubmit(e) {
    e.preventDefault();

    this.setState({newArticle: {url: '', title: '', author: ''}});
    this.props.onAdd(this.state.newArticle);
  }

  render() {
    const {
      url,
      title,
      author,
    } = this.state.newArticle;

    const { children = 'Add' } = this.props;

    return (
      <form onSubmit={this.onAdd}>
        <input type="text" required="required" value={url} onChange={(e) => this.onTextChanged(e, "url")} placeholder="URL" />
        <input type="text" required="required" value={title} onChange={(e) => this.onTextChanged(e, "title")} placeholder="Title" />
        <input type="text" required="required" value={author} onChange={(e) => this.onTextChanged(e, "author")} placeholder="Author" />
        <input type="submit" value={children} className="button" />
      </form>
    );
  }
}

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      list,
      searchTerm: '',
      nextObjectId: 2,
      newArticle: { url: '', title: '', author: '' },
    };

    this.onSearchChange = this.onSearchChange.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onAdd = this.onAdd.bind(this);
  }

  onRemove(objectID) {
    const isNotId = item => item.objectID !== objectID;
    const updatedList = this.state.list.filter(isNotId);

    this.setState({ list: updatedList });
  }

  onSearchChange(searchTerm) {
    this.setState({ searchTerm });
  }

  onAdd(newArticle) {
    const {
      list,
    } = this.state;

    let nextObjectId = this.state.nextObjectId;

    const newObject = Object.assign({
      numComments: 0,
      points: 0,
      objectID: nextObjectId++,
      order: list.length,
    }, newArticle);

    this.setState({list: [...list, newObject], nextObjectId: nextObjectId});
  }

  render() {
    const {
      list,
      searchTerm,
    } = this.state;

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}>Search Article: </Search>
        </div>
        <Table
          list={list}
          pattern={searchTerm}
          onRemove={this.onRemove} />
        <div className="interactions">
          <NewArticle onAdd={this.onAdd}>Add new article</NewArticle>
        </div>
      </div>
    );
  }
}
