import _ from 'lodash';
import React, { PropTypes } from 'react';
import { Map } from 'immutable';
import assign from 'object-assign';

function checkbox(item, options) {
  return (
    <li className="list-item" key={ item }>
      <label>
        <input
          type="checkbox"
          value={ item }
          checked={ options.values.has(item) } readOnly />
        <span> { item }</span>
      </label>
      { options.nested ? list(options.items[item], options) : null }
    </li>
  );
}

function list(items, options) {
  if (_.isEmpty(items)) return null;
  return (
    <ul className="list">
      { _.keys(items).map(item => checkbox(item, options)) }
    </ul>
  );
}

var CheckboxTree = React.createClass({
  displayName: 'CheckboxTree',
  propTypes: {
    itemCssClass: PropTypes.string,
    itemLimit: PropTypes.number,
    items: PropTypes.object.isRequired,
    label: PropTypes.string,
    listCssClass: PropTypes.string,
    maxHeight: PropTypes.number,
    name: PropTypes.string.isRequired,
    nested: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    values: PropTypes.array
  },
  getDefaultProps: function() {
    return {
      listCssClass: 'list-group',
      itemCssClass: 'list-group-item mi-checkbox',
      itemLimit: 5,
      items: {},
      label: 'Untitled',
      maxHeight: 180,
      nested: false,
      values: []
    };
  },

  getInitialState: function() {
    return {
      visible: true,
      showAll: false
    };
  },

  handleClick: function(e) {
    const { name, values } = this.props;
    const { target } = e;
    let valueSet = new Set(values);

    target.checked ? valueSet.add(target.value) : valueSet.delete(target.value);
    this.props.onChange({ name: name, items: Array.from(valueSet) });
  },

  toggleVisibility: function(e) {
    e.preventDefault();
    this.setState({ visible: !this.state.visible });
  },

  toggleShowAll: function(e) {
    e.preventDefault();
    this.setState({ showAll: !this.state.showAll });
  },

  displayableItems: function() {
    if (this.state.showAll) return this.props.items;

    let i = 0;
    let items = {};
    for (var key in this.props.items) {
      if (typeof this.props.items[key] == 'object') {
        items[key] = assign(this.props.items[key]);
      } else {
        items[key] = this.props.items[key];
      }
      i++;
      if (i >= this.props.itemLimit) break;
    }
    return items;
  },

  render: function() {
    if (_.isEmpty(this.props.items)) return null;

    const { name, values } = this.props;
    const items = this.displayableItems();
    const { showAll, visible } = this.state;
    const options = assign({}, this.props, {
      values: new Set(values),
      onClick: this.handleClick
    });
    const hrefCSS = visible ? '' : 'collapsed';
    const view = visible ?  (
      <div name={ name }>{ list(items, options) }</div>
    ) : null;
    const showAllText = showAll ? 'Less' : 'More';
    const showAllLink = Object.keys(this.props.items).length > this.props.itemLimit ? <a onClick={ this.toggleShowAll } className="uk-text-small">+ See { showAllText }</a> : null;

    return (
      <section className="mi-checkbox-tree" onChange={ this.handleClick }>
        <fieldset>

          <legend>
            <a role="button" className={ hrefCSS } onClick={ this.toggleVisibility } href="#">{ this.props.label }</a>
          </legend>
            { view }
            { showAllLink }
        </fieldset>

      </section>
    );
  }
});

export default CheckboxTree;