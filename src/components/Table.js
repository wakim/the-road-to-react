import React from 'react';
export default function Table({list = [], onRemove}) {
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
