// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {formValueSelector, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';

import Authorization from '$components/authorization/Authorization';
import Button from '$components/button/Button';
import FormField from '$components/form/FormField';
import FormText from '$components/form/FormText';
import Modal from '$components/modal/Modal';
import {FormNames} from '$src/enums';
import {LeaseAreasFieldPaths, LeaseAreasFieldTitles} from '$src/leases/enums';
import {ButtonColors} from '$components/enums';
import {getUiDataLeaseKey} from '$src/uiData/helpers';
import {getFieldAttributes, isFieldAllowedToRead} from '$util/helpers';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/types';

type Props = {
  archivedNote: string,
  archivedDecision: ?number,
  attributes: Attributes,
  decisionOptions: Array<Object>,
  label: string,
  onArchive: Function,
  onCancel: Function,
  onClose: Function,
  open: boolean,
  valid: boolean,
}

class ArchiveAreaModal extends Component<Props> {
  firstField: any

  componentDidUpdate(prevProps: Props) {
    if(!prevProps.open && this.props.open) {
      if(this.firstField) {
        this.firstField.focus();
      }
    }
  }

  setRefForFirstField = (element: any) => {
    this.firstField = element;
  }

  handleArchive = () => {
    const {archivedDecision, archivedNote, onArchive} = this.props;

    onArchive({
      archived_at: new Date().toISOString(),
      archived_note: archivedNote,
      archived_decision: archivedDecision,
    });
  }

  render() {
    const {
      attributes,
      decisionOptions,
      onCancel,
      onClose,
      open,
      valid,
    } = this.props;

    return (
      <div>
        <Modal
          className='modal-small modal-autoheight modal-center'
          title='Arkistoi kohde'
          isOpen={open}
          onClose={onClose}
        >
          <FormText>Haluatko varmasti arkistoida kohteen?</FormText>
          <Row>
            <Column>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.ARCHIVED_DECISION)}>
                <FormField
                  setRefForField={this.setRefForFirstField}
                  fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.ARCHIVED_DECISION)}
                  name='archived_decision'
                  overrideValues={{
                    label: LeaseAreasFieldTitles.ARCHIVED_DECISION,
                    options: decisionOptions,
                  }}
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.ARCHIVED_DECISION)}
                />
              </Authorization>
            </Column>
          </Row>
          <Row>
            <Column>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.ARCHIVED_NOTE)}>
                <FormField
                  fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.ARCHIVED_NOTE)}
                  name='archived_note'
                  overrideValues={{label: LeaseAreasFieldTitles.ARCHIVED_NOTE}}
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.ARCHIVED_NOTE)}
                />
              </Authorization>
            </Column>
          </Row>
          <div className='confirmation-modal__footer'>
            <Button
              className={ButtonColors.SECONDARY}
              onClick={onCancel}
              text='Peruuta'
            />
            <Button
              className={ButtonColors.SUCCESS}
              disabled={!valid}
              onClick={this.handleArchive}
              text='Arkistoi'
            />
          </div>
        </Modal>
      </div>
    );
  }
}

const formName = FormNames.LEASE_ARCHIVE_AREA;
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        archivedDecision: selector(state, 'archived_decision'),
        archivedNote: selector(state, 'archived_note'),
        attributes: getAttributes(state),
      };
    },
  ),
  reduxForm({
    form: formName,
  }),
)(ArchiveAreaModal);
