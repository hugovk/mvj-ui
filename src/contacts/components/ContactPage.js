// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import ContactEdit from './ContactEdit';
import ContactReadonly from './ContactReadonly';
import ControlButtonBar from '$components/controlButtons/ControlButtonBar';
import ControlButtons from '$components/controlButtons/ControlButtons';
import Loader from '$components/loader/Loader';
import PageContainer from '$components/content/PageContainer';
import {
  editContact,
  fetchAttributes,
  fetchSingleContact,
  hideEditMode,
  initializeContactForm,
  showEditMode,
} from '../actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {getRouteById} from '$src/root/routes';
import {getAttributes, getContactFormValues, getCurrentContact, getIsEditMode, getIsFetching} from '../selectors';

import type {RootState} from '$src/root/types';
import type {Attributes, Contact} from '../types';

type Props = {
  attributes: Attributes,
  contact: Contact,
  contactFormValues: Contact,
  editContact: Function,
  fetchAttributes: Function,
  fetchSingleContact: Function,
  hideEditMode: Function,
  initializeContactForm: Function,
  isEditMode: boolean,
  isFetching: boolean,
  location: Object,
  params: Object,
  receiveTopNavigationSettings: Function,
  showEditMode: Function,
}

class ContactPage extends Component {
  props: Props

  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    const {
      fetchAttributes,
      fetchSingleContact,
      params: {contactId},
      receiveTopNavigationSettings,
    } = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById('contacts'),
      pageTitle: 'Asiakkaat',
      showSearch: false,
    });
    fetchAttributes();
    fetchSingleContact(contactId);
  }

  copyContact = () => {
    // const {criteria, initializeRentCriteria, router} = this.props;
    // initializeRentCriteria(criteria);
    // return router.push({
    //   pathname: getRouteById('newrentcriteria'),
    // });
  }

  saveContact = () => {
    const {contactFormValues, editContact} = this.props;
    editContact(contactFormValues);
  }

  hideEditMode = () => {
    const {hideEditMode} = this.props;
    hideEditMode();
  }

  showEditMode = () => {
    const {
      contact,
      initializeContactForm,
      showEditMode,
    } = this.props;
    initializeContactForm(contact);
    showEditMode();
  }


  render() {
    const {attributes, contact, isEditMode, isFetching} = this.props;

    if(isFetching) {
      return (
        <PageContainer>
          <Loader isLoading={true} />
        </PageContainer>
      );
    }

    return (
      <PageContainer>
        <ControlButtonBar
          buttonComponent={
            <ControlButtons
              isCopyDisabled={false}
              isEditMode={isEditMode}
              isSaveDisabled={false}
              onCancelClick={this.hideEditMode}
              onCopyClick={this.copyContact}
              onEditClick={this.showEditMode}
              onSaveClick={this.saveContact}
              showCommentButton={false}
              showCopyButton={true}
            />
          }
          // infoComponent={
          //   <RentCriteriaInfo
          //     identifier={criteria.id}
          //   />
          // }
        />
        {isEditMode
          ? <ContactEdit
              attributes={attributes}
            />
          : <ContactReadonly
              attributes={attributes}
              contact={contact}
            />
        }
      </PageContainer>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    attributes: getAttributes(state),
    contact: getCurrentContact(state),
    contactFormValues: getContactFormValues(state),
    isEditMode: getIsEditMode(state),
    isFetching: getIsFetching(state),
  };
};

export default flowRight(
  connect(
    mapStateToProps,
    {
      editContact,
      fetchAttributes,
      fetchSingleContact,
      hideEditMode,
      initializeContactForm,
      receiveTopNavigationSettings,
      showEditMode,
    }
  ),
)(ContactPage);
