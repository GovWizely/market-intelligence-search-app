import _ from 'lodash';
import React, { PropTypes } from 'react';

var SearchMessage = React.createClass({
  displayName: 'SearchMessage',
  propTypes: {
    keyword: PropTypes.string,
    total: PropTypes.number
  },
  message: function() {
    if (this.props.total === null) return null;

    var msg = this.props.total ? 'results' : 'result';
    msg = msg.concat(' were found');

    if (!_.isEmpty(this.props.keyword)) {
      msg = msg.concat(' for the search for');
    } else {
      msg = msg.concat('.');
    }
    return msg;
  },
  count: function() {
    return <strong className="text-danger">{ this.props.total }</strong>;
  },
  keyword: function() {
    if (!this.props.keyword) return null;
    return <strong className="text-danger">{ this.props.keyword }.</strong>;
  },
  render: function() {
    return (
      <div className="search-message">
        <h5>{ this.count() } { this.message() } { this.keyword() }</h5>
      </div>
    );
  }
});

export default SearchMessage;
