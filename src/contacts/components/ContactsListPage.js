// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {initialize} from 'redux-form';
import flowRight from 'lodash/flowRight';
import {Row, Column} from 'react-foundation';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import Authorization from '$components/authorization/Authorization';
import AuthorizationError from '$components/authorization/AuthorizationError';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import PageContainer from '$components/content/PageContainer';
import Pagination from '$components/table/Pagination';
import Search from './search/Search';
import SortableTable from '$components/table/SortableTable';
import TableFilters from '$components/table/TableFilters';
import TableWrapper from '$components/table/TableWrapper';
import {
  fetchContacts,
  initializeContactForm,
} from '../actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {LIST_TABLE_PAGE_SIZE} from '$src/constants';
import {DEFAULT_SORT_KEY, DEFAULT_SORT_ORDER} from '$src/contacts/constants';
import {FormNames, Methods, PermissionMissingTexts} from '$src/enums';
import {ContactFieldPaths} from '$src/contacts/enums';
import {getContactFullName, mapContactSearchFilters} from '$src/contacts/helpers';
import {
  getApiResponseCount,
  getApiResponseMaxPage,
  getApiResponseResults,
  getFieldOptions,
  getLabelOfOption,
  getSearchQuery,
  getUrlParams,
  isFieldAllowedToRead,
  isMethodAllowed,
  setPageTitle,
} from '$util/helpers';
import {getRouteById, Routes} from '$src/root/routes';
import {getContactList, getIsFetching} from '../selectors';
import {withContactAttributes} from '$components/attributes/ContactAttributes';

import type {ContactList} from '../types';
import type {Attributes, Methods as MethodsType} from '$src/types';
import type {RootState} from '$src/root/types';

type Props = {
  contactAttributes: Attributes,
  contactList: ContactList,
  contactMethods: MethodsType,
  fetchContacts: Function,
  history: Object,
  initializeContactForm: Function,
  initialize: Function,
  isFetching: boolean,
  isFetchingContactAttributes: boolean,
  location: Object,
  receiveTopNavigationSettings: Function,
  router: Object,
}

type State = {
  activePage: number,
  contactAttributes: Attributes,
  contactList: ContactList,
  contacts: Array<Object>,
  count: number,
  isSearchInitialized: boolean,
  maxPage: number,
  sortKey: string,
  sortOrder: string,
  typeOptions: Array<Object>,
}

class ContactListPage extends Component<Props, State> {
  _isMounted: boolean

  state = {
    activePage: 1,
    contactAttributes: null,
    contactList: {},
    contacts: [],
    count: 0,
    isSearchInitialized: false,
    maxPage: 0,
    sortKey: DEFAULT_SORT_KEY,
    sortOrder: DEFAULT_SORT_ORDER,
    typeOptions: [],
  }

  search: any

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.contactAttributes !== state.contactAttributes) {
      newState.contactAttributes = props.contactAttributes;
      newState.typeOptions = getFieldOptions(props.contactAttributes, ContactFieldPaths.TYPE);
    }

    if(props.contactList !== state.contactList) {
      newState.contactList = props.contactList;
      newState.count = getApiResponseCount(props.contactList);
      newState.contacts = getApiResponseResults(props.contactList);
      newState.maxPage = getApiResponseMaxPage(props.contactList, LIST_TABLE_PAGE_SIZE);
    }

    return newState;
  }

  componentDidMount() {
    const {receiveTopNavigationSettings} = this.props;

    setPageTitle('Asiakkaat');

    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.CONTACTS),
      pageTitle: 'Asiakkaat',
      showSearch: false,
    });

    this.setSearchFormValues();

    this.search();

    window.addEventListener('popstate', this.handlePopState);
    this._isMounted = true;
  }

  componentDidUpdate(prevProps) {
    const {location: {search: currentSearch}} = this.props;
    const {location: {search: prevSearch}} = prevProps;
    const searchQuery = getUrlParams(currentSearch);

    if(currentSearch !== prevSearch) {
      this.search();

      delete searchQuery.sort_key;
      delete searchQuery.sort_order;

      if(!Object.keys(searchQuery).length) {
        this.setSearchFormValues();
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.handlePopState);
    this._isMounted = false;
  }

  handlePopState = () => {
    this.setSearchFormValues();
  }

  setSearchFormValues = () => {
    const {location: {search}, initialize} = this.props;
    const searchQuery = getUrlParams(search);
    const page = searchQuery.page ? Number(searchQuery.page) : 1;

    const setSearchFormReady = () => {
      this.setState({isSearchInitialized: true});
    };

    const initializeSearchForm = async() => {
      const initialValues = {...searchQuery};
      delete initialValues.page;
      delete initialValues.sort_key;
      delete initialValues.sort_order;
      await initialize(FormNames.CONTACT_SEARCH, initialValues);
    };

    this.setState({
      activePage: page,
      isSearchInitialized: false,
      sortKey: searchQuery.sort_key ? searchQuery.sort_key : DEFAULT_SORT_KEY,
      sortOrder: searchQuery.sort_order ? searchQuery.sort_order : DEFAULT_SORT_ORDER,
    }, async() => {
      await initializeSearchForm();

      if(this._isMounted) {
        setSearchFormReady();
      }
    });
  }

  handleCreateButtonClick = () => {
    const {initializeContactForm} = this.props;
    const {history, location: {search}} = this.props;

    initializeContactForm({});

    return history.push({
      pathname: getRouteById(Routes.CONTACT_NEW),
      search: search,
    });
  }

  handleSearchChange = (query: any, resetActivePage?: boolean = false) => {
    const {history} = this.props;

    if(resetActivePage) {
      this.setState({activePage: 1});
    }

    return history.push({
      pathname: getRouteById(Routes.CONTACTS),
      search: getSearchQuery(query),
    });
  }

  search = () => {
    const {fetchContacts, location: {search}} = this.props;
    const searchQuery = getUrlParams(search);
    const page = searchQuery.page ? Number(searchQuery.page) : 1;

    if(page > 1) {
      searchQuery.offset = (page - 1) * LIST_TABLE_PAGE_SIZE;
    }

    searchQuery.limit = LIST_TABLE_PAGE_SIZE;
    delete searchQuery.page;

    searchQuery.sort_key = searchQuery.sort_key || DEFAULT_SORT_KEY;
    searchQuery.sort_order = searchQuery.sort_order || DEFAULT_SORT_ORDER;

    fetchContacts(mapContactSearchFilters(searchQuery));
  }

  handleRowClick = (id) => {
    const {history, location: {search}} = this.props;

    return history.push({
      pathname: `${getRouteById(Routes.CONTACTS)}/${id}`,
      search: search,
    });
  };

  handlePageClick = (page: number) => {
    const {history, location: {search}} = this.props;
    const query = getUrlParams(search);

    if(page > 1) {
      query.page = page;
    } else {
      delete query.page;
    }

    this.setState({activePage: page});

    return history.push({
      pathname: getRouteById(Routes.CONTACTS),
      search: getSearchQuery(query),
    });
  }

  getColumns = () => {
    const {contactAttributes} = this.props;
    const {typeOptions} = this.state;
    const columns = [];

    if(isFieldAllowedToRead(contactAttributes, ContactFieldPaths.TYPE)) {
      columns.push({
        key: 'type',
        text: 'Asiakastyyppi',
        renderer: (val) => getLabelOfOption(typeOptions, val),
        sortable: false,
      });
    }
    if(isFieldAllowedToRead(contactAttributes, ContactFieldPaths.FIRST_NAME) ||
      isFieldAllowedToRead(contactAttributes, ContactFieldPaths.LAST_NAME) ||
      isFieldAllowedToRead(contactAttributes, ContactFieldPaths.NAME)) {
      columns.push({
        key: 'names',
        text: 'Nimi',
        renderer: (val, row) => getContactFullName(row),
      });
    }
    if(isFieldAllowedToRead(contactAttributes, ContactFieldPaths.BUSINESS_ID)) {
      columns.push({
        key: 'business_id',
        text: 'Y-tunnus',
      });
    }

    return columns;
  }

  handleSortingChange = ({sortKey, sortOrder}) => {
    const {location: {search}} = this.props;
    const searchQuery = getUrlParams(search);

    searchQuery.sort_key = sortKey;
    searchQuery.sort_order = sortOrder;

    this.setState({
      sortKey,
      sortOrder,
    });

    this.handleSearchChange(searchQuery);
  }

  render() {
    const {contactMethods, isFetching, isFetchingContactAttributes} = this.props;
    const {
      activePage,
      contacts,
      count,
      isSearchInitialized,
      maxPage,
      sortKey,
      sortOrder,
    } = this.state;
    const columns = this.getColumns();

    if(isFetchingContactAttributes) return <PageContainer><Loader isLoading={true} /></PageContainer>;

    if(!contactMethods) return null;

    if(!isMethodAllowed(contactMethods, Methods.GET)) return <PageContainer><AuthorizationError text={PermissionMissingTexts.CONTACT} /></PageContainer>;

    return(
      <PageContainer>
        <Row>
          <Column small={12} large={4}>
            <Authorization allow={isMethodAllowed(contactMethods, Methods.POST)}>
              <AddButtonSecondary
                className='no-top-margin'
                label='Luo asiakas'
                onClick={this.handleCreateButtonClick}
              />
            </Authorization>
          </Column>
          <Column small={12} large={8}>
            <Search
              isSearchInitialized={isSearchInitialized}
              onSearch={this.handleSearchChange}
              sortKey={sortKey}
              sortOrder={sortOrder}
            />

            <TableFilters
              amountText={isFetching ? 'Ladataan...' : `Löytyi ${count} kpl`}
              filterOptions={[]}
              filterValue={[]}
            />
          </Column>
        </Row>

        <TableWrapper>
          {isFetching &&
            <LoaderWrapper className='relative-overlay-wrapper'><Loader isLoading={isFetching} /></LoaderWrapper>
          }
          <SortableTable
            columns={columns}
            data={contacts}
            listTable
            onRowClick={this.handleRowClick}
            onSortingChange={this.handleSortingChange}
            serverSideSorting
            sortable
            sortKey={sortKey}
            sortOrder={sortOrder}

          />
          <Pagination
            activePage={activePage}
            maxPage={maxPage}
            onPageClick={this.handlePageClick}
          />
        </TableWrapper>
      </PageContainer>
    );
  }
}

export default flowRight(
  withContactAttributes,
  withRouter,
  connect(
    (state: RootState) => {
      return {
        contactList: getContactList(state),
        isFetching: getIsFetching(state),
      };
    },
    {
      fetchContacts,
      initialize,
      initializeContactForm,
      receiveTopNavigationSettings,
    },
  ),
)(ContactListPage);
