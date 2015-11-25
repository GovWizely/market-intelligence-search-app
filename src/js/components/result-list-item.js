import React, { PropTypes } from 'react';

import { findFirst } from '../utils/view-helper';

var ResultListItem = React.createClass({
  displayName: 'ResultListItem',
  propTypes: {
    fields: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired
  },
  render: function() {
    const { fields, item } = this.props;
    const url = findFirst(item, fields.url),
          title = findFirst(item, fields.title),
          snippet = findFirst(item, fields.snippet);
    return (
      <article className="article">
        <h1 className="title">
          <a target="_blank" href={ url } dangerouslySetInnerHTML={ { __html: title } }></a>
        </h1>
        <p className="url"><a target="_blank" href={ url }>{ url }</a></p>
        <p className="snippet" dangerouslySetInnerHTML={ { __html: snippet } }></p>
      </article>
    );
  }
});


export default ResultListItem;
