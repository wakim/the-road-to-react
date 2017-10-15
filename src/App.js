import React, { Component } from 'react';
import { DebounceInput } from 'react-debounce-input';

import logo from './logo.svg';
import './App.css';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

function Search({value, onChange, children}) {
  return (
    <form>
      {children}
      <DebounceInput
        type="text"
        debounceTimeout={300}
        value={value}
        onChange={(e) => onChange(e.target.value)} />
    </form>
  );
}

function Table({list = [], onRemove}) {
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
      <div className="table-header">
        <span style={largeColumn}>Title</span>
        <span style={midColumn}>Author</span>
        <span style={smallColumn}>Comments</span>
        <span style={smallColumn}>Points</span>
        <span style={smallColumn}></span>
      </div>
      {
        list.map(item =>
          <div key={item.objectID} className="table-row">
            <span style={largeColumn}>
              <a href={item.url}>{item.title}</a>
            </span>
            <span style={midColumn}>{item.author}</span>
            <span style={smallColumn}>{item.num_comments}</span>
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

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    };

    this.setSearchTopstories = this.setSearchTopstories.bind(this);
    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onRemove = this.onRemove.bind(this);
  }

  setSearchTopstories(result) {
    this.setState({ result });
  }

  fetchSearchTopstories(searchTerm) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
    .then(response => response.json())
    .then(result => this.setSearchTopstories(result))
    .catch(e => e);
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopstories(searchTerm);
  }

  onRemove(objectID) {
    const isNotId = item => item.objectID !== objectID;
    const updatedHits = this.state.result.hits.filter(isNotId);

    this.setState({result: {...this.state.result, hits: updatedHits}});
  }

  onSearchChange(searchTerm) {
    this.setState({ searchTerm });
    this.fetchSearchTopstories(searchTerm);
  }

  render() {
    const {
      result,
      searchTerm,
    } = this.state;

    if (!result) {
      return null;
    }

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}>Search Article: </Search>
        </div>
        <Table
          list={result.hits}
          onRemove={this.onRemove} />
      </div>
    );
  }
}
