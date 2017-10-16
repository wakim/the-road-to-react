import React, { Component } from 'react';

import Search from './components/Search';
import Table from './components/Table';

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

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchTerm: DEFAULT_QUERY,
    };

    this.needsToSearchTopstories = this.needsToSearchTopstories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onRemove = this.onRemove.bind(this);
  }

  needsToSearchTopstories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  setSearchTopStories(result) {
    debugger;
    const { hits, page } = result;
    const { results, searchTerm } = this.state;

    const oldHits = results && results[searchTerm]
      ? results[searchTerm].hits
      : [];

    const updatedHits = [...oldHits, ...hits];
    const _results = { ...results, [searchTerm]: { hits: updatedHits, page } };

    this.setState({ results: _results });
  }

  fetchSearchTopStories(searchTerm, page) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}&${PARAM_TAGS}${DEFAULT_TAG}`)
    .then(response => response.json())
    .then(result => this.setSearchTopStories(result))
    .catch(e => e);
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm, DEFAULT_PAGE);
  }

  onRemove(objectID) {
    const isNotId = item => item.objectID !== objectID;

    const { searchTerm, results } = this.state;
    const { hits, page } = results[searchTerm];

    const updatedHits = hits.filter(isNotId);
    const _results = { ...results, [searchTerm]: { hits: updatedHits, page }};

    this.setState({results: _results});
  }

  onSearchChange(searchTerm) {
    this.setState({ searchTerm });

    if (this.needsToSearchTopstories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm, DEFAULT_PAGE);
    }
  }

  render() {
    const {
      results,
      searchTerm,
    } = this.state;

    const result = results && results[searchTerm];
    const page = (result && result.page) || DEFAULT_PAGE;
    const list = result && result.hits;

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}>Search Article: </Search>
        </div>
        { list &&
          <Table
            list={list}
            onRemove={this.onRemove} />
        }
        <div className="interactions">
          <button onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>More</button>
        </div>
      </div>
    );
  }
}
