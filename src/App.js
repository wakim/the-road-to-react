import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
    order: 0,
  },
  {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 100,
    objectID: 1,
    order: 1,
  }
];

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      list,
      searchTerm: '',
      nextObjectId: 2,
      url: '',
      title: '',
      author: '',
    };

    this.onTextChanged = this.onTextChanged.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onAdd = this.onAdd.bind(this);
  }

  onRemove(objectID) {
    const isNotId = item => item.objectID !== objectID;
    const updatedList = this.state.list.filter(isNotId);

    this.setState({ list: updatedList });
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onTextChanged(event, attr) {
    this.setState({ [attr]: event.target.value });
  }

  onAdd(event) {
    event.preventDefault();

    const {
      url,
      title,
      author,
      list,
    } = this.state;

    let nextObjectId = this.state.nextObjectId;

    const newObject = {
      title: title,
      url: url,
      author: author,
      num_comments: 0,
      points: 0,
      objectID: nextObjectId++,
      order: list.length,
    };

    this.setState({title: '', url: '', author: '', list: [...list, newObject], nextObjectId: nextObjectId});
  }

  render() {
    const {
      list,
      searchTerm,
      url,
      title,
      author,
    } = this.state;

    const isSearched = (item) => !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());

    return (
      <div className="App">
        <form>
          <input
            type="text"
            onChange={this.onSearchChange} />
        </form>
        {
          list.sort((item1, item2) => item1.order - item2.order)
          .filter(isSearched)
          .map(item =>
            <div key={item.objectID}>
              <span>
                <a href={item.url}>{item.title}</a>
              </span>
              <span>{item.author}</span>
              <span>{item.num_comments}</span>
              <span>{item.points}</span>
              <span>
                <button
                  onClick={() => this.onRemove(item.objectID)}>Remove</button>
              </span>
            </div>)
        }

        <form onSubmit={this.onAdd}>
          <input type="text" required="required" value={url} onChange={(e) => this.onTextChanged(e, "url")} placeholder="URL" />
          <input type="text" required="required" value={title} onChange={(e) => this.onTextChanged(e, "title")} placeholder="Title" />
          <input type="text" required="required" value={author} onChange={(e) => this.onTextChanged(e, "author")} placeholder="Author" />
          <input type="submit" value="Add" />
        </form>
      </div>
    );
  }
}

export default App;
