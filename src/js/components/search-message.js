var _     = require('lodash');
var React = require('react');

var ArticleStore = require('../stores/article-store');

module.exports = React.createClass({
  displayName: 'SearchMessage',
  getInitialState: function() {
    return {
      total: 0,
      query: ArticleStore.getQuery()
    };
  },
  componentDidMount: function() {
    ArticleStore.addListener(this._onChange);
  },
  componentWillUnmount: function() {
    ArticleStore.removeListener(this._onChange);
  },
  _onChange: function() {
    this.setState({ total: ArticleStore.getMetadata().total });
    this.setState({ query: ArticleStore.getQuery() });
  },
  message: function() {
    if (this.state.total === null) return null;

    var msg = this.state.total ? 'results' : 'result';
    msg = msg.concat(' were found');

    if (!_.isEmpty(this.state.query.q)) {
      msg = msg.concat(' for the search for');
    } else {
      msg = msg.concat('.');
    }
    return msg;
  },
  count: function() {
    return <strong className="text-danger">{ this.state.total }</strong>;
  },
  keyword: function() {
    if (!this.state.query.q) return null;
    return <strong className="text-danger">{ this.state.query.q }.</strong>;
  },
  render: function() {
    return (
      <div className="search-message">
        <h5>{ this.count() } { this.message() } { this.keyword() }</h5>
      </div>
    );
  }
});