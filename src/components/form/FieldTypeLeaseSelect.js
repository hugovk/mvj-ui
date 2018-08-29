// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Select from 'react-select';
import fetch from 'isomorphic-fetch';
import classNames from 'classnames';
import debounce from 'lodash/debounce';

import createUrl from '$src/api/createUrl';
import {getContentLeaseOption} from '$src/leases/helpers';
import {getApiToken} from '$src/auth/selectors';

const arrowRenderer = () => <i className='select-input__arrow-renderer'/>;

type Props = {
  apiToken: string,
  creatable?: boolean,
  disabled?: boolean,
  displayError: boolean,
  input: Object,
  isDirty: boolean,
  onChange: Function,
  placeholder?: string,
}

class FieldTypeLessorSelect extends Component<Props> {
  static defaultProps = {
    creatable: false,
    disabled: false,
    value: '',
  };

  handleBlur = () => {
    const {input: {onBlur, value}} = this.props;
    onBlur(value);
  };

  handleChange = (value: Object) => {
    const {input: {onChange}} = this.props;
    onChange(value);
  }

  getOptions = (json: Object) => json.map((lease) => getContentLeaseOption(lease));

  getLeases = debounce((input, callback) => {
    const {apiToken} = this.props;
    if (!apiToken) {return Promise.resolve({options: []});}

    const request = new Request(createUrl(`lease/?succinct=true&identifier=${input}`));
    request.headers.set('Authorization', `Bearer ${apiToken}`);

    fetch(request)
      .then((response) => response.json())
      .then((json) => {
        callback(null, {
          options: this.getOptions(json.results),
          complete: true,
        });
      });
  }, 500);

  handleFilterOptions = (options: Array<Object>) => options;

  render() {
    const {
      creatable,
      disabled,
      displayError,
      input,
      input: {value},
      isDirty,
      placeholder,
    } = this.props;

    const AsyncComponent = creatable
      ? Select.AsyncCreatable
      : Select.Async;

    return(
      <AsyncComponent
        {...input}
        arrowRenderer={arrowRenderer}
        autoload={false}
        autosize={false}
        backspaceRemoves={false}
        className={classNames(
          'form-field__select',
          {'has-error': displayError},
          {'is-dirty': isDirty})
        }
        clearable={false}
        disabled={disabled}
        filterOptions={this.handleFilterOptions}
        loadingPlaceholder='Ladataan...'
        loadOptions={this.getLeases}
        multi={false}
        noResultsText={'Ei tuloksia'}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        placeholder={placeholder || 'Valitse...'}
        searchPromptText='Hae vuokratunnuksella...'
        value={value}
      />
    );
  }
}

export default connect(
  (state) => {
    return {
      apiToken: getApiToken(state),
    };
  }
)(FieldTypeLessorSelect);