// @flow
import React, {PureComponent} from 'react';
import debounce from 'lodash/debounce';

import Button from '$components/button/Button';
import DualListBox from 'react-dual-listbox';
import FormText from '$components/form/FormText';
import Modal from '$components/modal/Modal';
import ModalButtonWrapper from '$components/modal/ModalButtonWrapper';
import TextAreaInput from '$components/inputs/TextAreaInput';
import {fetchUsers} from '$src/users/requestsAsync';
import {ButtonColors} from '$components/enums';
import {getUserOptions} from '$src/users/helpers';
import {sortByLabelAsc} from '$util/helpers';

type FilterProps = {
  available: string,
  selected: string,
}

type Props = {
  isOpen: boolean,
  onCancel: Function,
  onClose: Function,
  onSend: Function,
}

type State = {
  filter: FilterProps,
  selectedUsers: Array<Object>,
  text: string,
  userOptions: Array<Object>,
}

class SendEmailModal extends PureComponent<Props, State> {
  dualListBox: any

  state = {
    filter: {
      available: '',
      selected: '',
    },
    selectedUsers: [],
    text: '',
    userOptions: [],
  };

  componentDidUpdate(prevProps: Props) {
    if(!prevProps.isOpen && this.props.isOpen) {
      // Set focus on first field
      if(this.dualListBox) {
        this.dualListBox.focus();
      }

      // Clear inputs
      this.setState({
        filter: {
          available: '',
          selected: '',
        },
        selectedUsers: [],
        text: '',
      });

      // Get default user list
      this.getUserList('');
    }
  }

  getUserList = async(search: string) => {
    const {selectedUsers} = this.state;
    const users = await fetchUsers({search});
    // Both selected and available arrays on DualListBox use options for filtering. So add selectedUsers to search results and remove duplicates
    const uniqueUsers = [...getUserOptions(users), ...selectedUsers]
      .filter((a, index, array) => array.findIndex((b) => a.value === b.value) === index)
      .sort(sortByLabelAsc);

    this.setState({userOptions: uniqueUsers});
  };

  getUserListDebounced = debounce((search: string) => {
    this.getUserList(search);
  }, 500);

  handleUserListChange = (selected: Array<Object>) => {
    this.setState({selectedUsers: selected});
  }

  handleTextChange = (e: any) => {
    this.setState({
      text: e.target.value,
    });
  }

  handleFilterChange = (filter: FilterProps) => {
    const {filter: selectedFilter} = this.state;

    this.setState({filter});

    if(filter.available !== selectedFilter.available) {
      // Fetch users when available filter changes.
      this.getUserListDebounced(filter.available);
    }
  }

  handleSend = () => {
    const {onSend} = this.props;
    const {selectedUsers, text} = this.state;

    onSend({
      recipients: selectedUsers.map((user) => Number(user.value)),
      text,
    });
  }

  render() {
    const {
      isOpen,
      onCancel,
      onClose,
    } = this.props;
    const {filter, selectedUsers, text, userOptions} = this.state;

    return (
      <Modal
        className='modal-autoheight modal-center'
        title='Lähetä sähköposti'
        isOpen={isOpen}
        onClose={onClose}
      >
        <FormText>Valitse sähköpostin vastaanottajat</FormText>
        <DualListBox
          availableRef={(ref) => this.dualListBox = ref}
          canFilter
          filter={filter}
          filterPlaceholder='Hae vastaanottajia...'
          onChange={this.handleUserListChange}
          onFilterChange={this.handleFilterChange}
          options={userOptions}
          selected={selectedUsers}
          simpleValue={false}
        />

        <FormText><label htmlFor='send-email_text'> Sähköpostiin liittyvä kommentti</label></FormText>
        <TextAreaInput
          className="no-margin"
          id='send-email_text'
          onChange={this.handleTextChange}
          placeholder=''
          rows={4}
          value={text}
        />

        <ModalButtonWrapper>
          <Button
            className={ButtonColors.SECONDARY}
            onClick={onCancel}
            text='Peruuta'
          />
          <Button
            className={ButtonColors.SUCCESS}
            disabled={!selectedUsers.length}
            onClick={this.handleSend}
            text='Lähetä'
          />
        </ModalButtonWrapper>
      </Modal>
    );
  }
}


export default SendEmailModal;
