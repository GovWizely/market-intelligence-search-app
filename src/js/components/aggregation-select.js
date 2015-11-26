var _      = require('lodash');
var React  = require('react');
var Select = require('react-select');

function validValues(values, items) {
  if (!values) return [];
  return _.intersection(
    values.split(','), _.map(items, v => v.key)
  );
}
export default React.createClass({
  displayName: 'AggregationSelect',
  propTypes: {
    items       : React.PropTypes.array.isRequired,
    onChange    : React.PropTypes.func.isRequired,
    onSubmit    : React.PropTypes.func,
    placeholder : React.PropTypes.string,
    value       : React.PropTypes.array
  },
  getDefaultProps: function() {
    return {
      items: [],
      placeholder: 'Select Options'
    };
  },
  getInitialState: function() {
    return {
      isLoading: _.isEmpty(this.props.items)
    };
  },
  componentWillReceiveProps: function(nextProps) {
    if (!_.isEmpty(nextProps.items)) {
      this.setState({ isLoading: false });
    }
  },
  options: function() {
    return _.map(this.props.items, function(item) {
      return { label: item.key, value: item.key };
    });
  },
  render: function() {
    const { items, value, onChange } = this.props;
    const values = validValues(value, items);
    return (
      <Select
        isLoading={ this.state.isLoading }
        multi
        options={ this.options() }
        onBlur={ () => {} }
        onChange={ (val, items) => onChange(val) }
        value={ values || [] } />
    );
  }
});
