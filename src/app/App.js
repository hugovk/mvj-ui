// @flow

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import i18n from '../root/i18n';
import {Sizes} from '../foundation/enums';
import {revealContext} from '../foundation/reveal';
import classnames from 'classnames';

import {clearError} from '../api/actions';
import {getError} from '../api/selectors';
import ApiErrorModal from '../api/ApiErrorModal';
import TopNavigation from '../components/topNavigation/TopNavigation';
import SideMenu from '../components/sideMenu/SideMenu';
import {isAllowedLanguage} from '../util/helpers';
import {Languages} from '../constants';

import type {ApiError} from '../api/types';
import type {RootState} from '../root/types';

type Props = {
  apiError: ApiError,
  clearError: typeof clearError,
  children: any,
  params: Object,
  closeReveal: Function,
};

type State = {
  displaySideMenu: boolean,
};

class App extends Component {
  props: Props

  state: State = {
    displaySideMenu: false,
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  componentDidMount() {
    const {params: {language}} = this.props;

    if (language !== i18n.language) {
      if (isAllowedLanguage(language)) {
        i18n.changeLanguage(language);
      } else {
        i18n.changeLanguage(Languages.EN);
      }
    }
  }

  toggleSideMenu = () => {
    console.log('toggle');
    return this.setState({
      displaySideMenu: !this.state.displaySideMenu,
    });
  };

  handleDismissErrorModal = () => {
    this.props.closeReveal('apiError');
    this.props.clearError();
  };

  render() {
    const {apiError, children} = this.props;
    const {displaySideMenu} = this.state;

    return (
      <div className={'app'}>
        <TopNavigation toggleSideMenu={this.toggleSideMenu}/>
        <section className="app__content">
          <SideMenu isOpen={displaySideMenu} />
          <div className={classnames('wrapper', {'is-sidemenu-closed': !displaySideMenu}, {'is-sidemenu-open': displaySideMenu})}>{children}</div>
        </section>
        <ApiErrorModal size={Sizes.LARGE}
          data={apiError}
          isOpen={Boolean(apiError)}
          handleDismiss={this.handleDismissErrorModal}/>
      </div>
    );
  }
}

export default flowRight(
  withRouter,
  connect(
    (state: RootState) => ({
      apiError: getError(state),
    }),
    {
      clearError,
    },
  ),
  revealContext(),
)(App);
