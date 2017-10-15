import React, { Component } from 'react';
import { DebounceInput } from 'react-debounce-input';

import logo from './logo.svg';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = '100';
const DEFAULT_TAG = 'story';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_TAGS = 'tags=';
const PARAM_HPP = 'hitsPerPage=';

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
      page: DEFAULT_PAGE,
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onRemove = this.onRemove.bind(this);
  }

  setSearchTopStories(result) {
    const { hits, page } = result;

    const oldHits = page !== 0 ? this.state.result.hits : [];
    const updatedHits = [...oldHits, ...hits];

    this.setState({
      result: { hits: updatedHits, page }
    });
  }

  fetchSearchTopStories(searchTerm, page) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}&${PARAM_TAGS}${DEFAULT_TAG}`)
    .then(response => response.json())
    .then(result => this.setSearchTopStories(result))
    .catch(e => e);

    this.setState({ page });
  }

  componentDidMount() {
    const {
      searchTerm,
      page
    } = this.state;

    this.fetchSearchTopStories(searchTerm, page);
  }

  onRemove(objectID) {
    const isNotId = item => item.objectID !== objectID;
    const updatedHits = this.state.result.hits.filter(isNotId);

    this.setState({result: {...this.state.result, hits: updatedHits}});
  }

  onSearchChange(searchTerm) {
    this.setState({ searchTerm });
    this.fetchSearchTopStories(searchTerm, DEFAULT_PAGE);
  }

  render() {
    const {
      result,
      searchTerm,
    } = this.state;

    const page = (result && result.page) || DEFAULT_PAGE;

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}>Search Article: </Search>
        </div>
        { result &&
          <Table
            list={result.hits}
            onRemove={this.onRemove} />
        }

        <div className="interactions">
          <button onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>More</button>
        </div>
      </div>
    );
  }
}
