// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {initialize} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import CreateLeaseModal from './createLease/CreateLeaseModal';
import AreaNotesEditMap from '$src/areaNote/components/AreaNotesEditMap';
import IconRadioButtons from '$components/button/IconRadioButtons';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import MapIcon from '$components/icons/MapIcon';
import PageContainer from '$components/content/PageContainer';
import Pagination from '$components/table/Pagination';
import Search from './search/Search';
import SortableTable from '$components/table/SortableTable';
import TableFilters from '$components/table/TableFilters';
import TableIcon from '$components/icons/TableIcon';
import TableWrapper from '$components/table/TableWrapper';
import VisualisationTypeWrapper from '$components/table/VisualisationTypeWrapper';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {fetchAreaNoteList} from '$src/areaNote/actions';
import {
  createLease,
  fetchAttributes,
  fetchLeases,
} from '$src/leases/actions';
import {leaseStateFilterOptions} from '$src/leases/constants';
import {FormNames} from '$src/leases/enums';
import {getContentLeases, getLeasesFilteredByLeaseStates} from '$src/leases/helpers';
import {formatDate, getAttributeFieldOptions, getLabelOfOption, getSearchQuery} from '$util/helpers';
import {getRouteById} from '$src/root/routes';
import {getAreaNoteList} from '$src/areaNote/selectors';
import {
  getAttributes,
  getIsFetching,
  getLeasesList,
} from '$src/leases/selectors';

import type {LeaseList} from '../types';
import type {AreaNoteList} from '$src/areaNote/types';

const PAGE_SIZE = 25;

const visualizationTypeOptions = [
  {value: 'table', label: 'Taulukko', icon: <TableIcon className='icon-medium' />},
  {value: 'map', label: 'Kartta', icon: <MapIcon className='icon-medium' />},
];

type Props = {
  areaNotes: AreaNoteList,
  attributes: Object,
  createLease: Function,
  fetchAreaNoteList: Function,
  fetchAttributes: Function,
  fetchLeases: Function,
  initialize: Function,
  isFetching: boolean,
  leases: LeaseList,
  lessors: Array<Object>,
  location: Object,
  router: Object,
  receiveTopNavigationSettings: Function,
}

type State = {
  activePage: number,
  isModalOpen: boolean,
  leaseStates: Array<string>,
  visualizationType: string,
}

class LeaseListPage extends Component<Props, State> {
  firstLeaseModalField: any

  state = {
    activePage: 1,
    isModalOpen: false,
    leaseStates: [],
    visualizationType: 'table',
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  componentDidMount() {
    const {
      attributes,
      fetchAreaNoteList,
      fetchAttributes,
      initialize,
      receiveTopNavigationSettings,
    } = this.props;
    const {router: {location: {query}}} = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById('leases'),
      pageTitle: 'Vuokraukset',
      showSearch: false,
    });

    const page = query.page ? Number(query.page) : 1;
    this.setState({activePage: page});


    if(isEmpty(attributes)) {
      fetchAttributes();
    }

    fetchAreaNoteList();

    const searchQuery = {...query};

    const states = searchQuery.state;
    if(states) {
      this.setState({leaseStates: states});
    }

    delete searchQuery.page;
    delete searchQuery.state;
    initialize(FormNames.SEARCH, searchQuery);

    this.search();
  }

  componentDidUpdate(prevProps) {
    const {location: {query, search: currentSearch}, initialize} = this.props;
    const {location: {search: prevSearch}} = prevProps;
    const {activePage} = this.state;

    if(currentSearch !== prevSearch) {
      this.search();

      const searchQuery = {...query};
      delete searchQuery.page;

      if(!Object.keys(searchQuery).length) {
        this.setState({leaseStates: []});
        initialize(FormNames.SEARCH, {});
      }
    }

    const page = query.page ? Number(query.page) : 1;
    if(page !== activePage) {
      this.setState({activePage: page});
    }
  }

  showCreateLeaseModal = () => {
    this.setState({
      isModalOpen: true,
    });
  }

  hideCreateLeaseModal = () => {
    this.setState({
      isModalOpen: false,
    });
  }

  search = () => {
    const {fetchLeases, router: {location: {query}}} = this.props;

    const searchQuery = {...query};
    const page = searchQuery.page ? Number(searchQuery.page) : 1;
    if(page > 1) {
      searchQuery.offset = (page - 1) * PAGE_SIZE;
    }
    searchQuery.limit = PAGE_SIZE;
    delete searchQuery.page;

    fetchLeases(getSearchQuery(searchQuery));
  }

  handleSearchChange = (query) => {
    const {router} = this.context;

    this.setState({activePage: 1});

    return router.push({
      pathname: getRouteById('leases'),
      query,
    });
  }

  handleRowClick = (id) => {
    const {router} = this.context;
    const {router: {location: {query}}} = this.props;

    return router.push({
      pathname: `${getRouteById('leases')}/${id}`,
      query,
    });
  };

  handlePageClick = (page: number) => {
    const {router} = this.context;
    const {router: {location: {query}}} = this.props;

    if(page > 1) {
      query.page = page;
    } else {
      delete query.page;
    }

    this.setState({activePage: page});
    return router.push({
      pathname: getRouteById('leases'),
      query,
    });
  }

  getLeasesCount = (leases: LeaseList) => {
    return get(leases, 'count', 0);
  }

  getLeasesMaxPage = (leases: LeaseList) => {
    const count = this.getLeasesCount(leases);
    if(!count) {
      return 0;
    }
    else {
      return Math.ceil(count/PAGE_SIZE);
    }
  }

  handleLeaseStatesChange = (values: Array<string>) => {
    const {location: {query}} = this.props;

    const searchQuery = {...query};
    delete searchQuery.page;
    searchQuery.state = values;

    this.setState({leaseStates: values});
    this.handleSearchChange(searchQuery);
  }

  handleVisualizationTypeChange = (value: string) => {
    this.setState({visualizationType: value});
  }

  isBasicSearchByDefault = () => {
    const {location: {query}} = this.props;

    const searchQuery = {...query};
    delete searchQuery.page;

    if(Object.keys(searchQuery).length === 0) {
      return true;
    } else if(Object.keys(searchQuery).length === 1 && searchQuery['identifier'] || searchQuery['state']) {
      return true;
    }

    return false;
  }

  render() {
    const {
      activePage,
      isModalOpen,
      leaseStates,
      visualizationType,
    } = this.state;
    const {
      areaNotes,
      attributes,
      createLease,
      leases: content,
      isFetching,
    } = this.props;

    const leases = getContentLeases(content);
    const count = this.getLeasesCount(content);
    const maxPage = this.getLeasesMaxPage(content);
    //TODO: Filter leases by document type on front-end for demo purposes. Move to backend and end points are working
    const filteredLeases = getLeasesFilteredByLeaseStates(leases, leaseStates);
    const stateOptions = getAttributeFieldOptions(attributes, 'state', false);

    const isBasicSearchByDefault = this.isBasicSearchByDefault();

    return (
      <PageContainer>
        <CreateLeaseModal
          isOpen={isModalOpen}
          onClose={this.hideCreateLeaseModal}
          onSubmit={createLease}
        />
        <Row>
          <Column small={12} large={6}>
            <AddButtonSecondary
              className='no-top-margin'
              label='Luo vuokratunnus'
              onClick={this.showCreateLeaseModal}
            />
          </Column>
          <Column small={12} large={6}>
            <Search
              attributes={attributes}
              basicSearchByDefault={isBasicSearchByDefault}
              onSearch={this.handleSearchChange}
              states={leaseStates}
            />
          </Column>
        </Row>

        <Row>
          <Column small={12} medium={6}>
            <VisualisationTypeWrapper>
              <IconRadioButtons
                legend={'Kartta/taulukko'}
                onChange={this.handleVisualizationTypeChange}
                options={visualizationTypeOptions}
                radioName='visualization-type-radio'
                value={visualizationType}
              />
            </VisualisationTypeWrapper>
          </Column>
          <Column small={12} medium={6}>
            <TableFilters
              amountText={isFetching ? 'Ladataan...' : `Löytyi ${count} kpl`}
              filterOptions={leaseStateFilterOptions}
              filterValue={leaseStates}
              onFilterChange={this.handleLeaseStatesChange}
            />
          </Column>
        </Row>

        <TableWrapper>
          {isFetching &&
            <LoaderWrapper className='relative-overlay-wrapper'><Loader isLoading={isFetching} /></LoaderWrapper>
          }
          {visualizationType === 'table' && (
            <div>
              <SortableTable
                columns={[
                  {key: 'identifier', text: 'Vuokratunnus'},
                  {key: 'real_property_unit', text: 'Vuokrakohde'},
                  {key: 'address', text: 'Osoite'},
                  {key: 'tenant', text: 'Vuokralainen'},
                  {key: 'lessor', text: 'Vuokranantaja'},
                  {key: 'state', text: 'Tyyppi', renderer: (val) => getLabelOfOption(stateOptions, val)},
                  {key: 'start_date', text: 'Alkupvm', renderer: (val) => formatDate(val)},
                  {key: 'end_date', text: 'Loppupvm', renderer: (val) => formatDate(val)},
                ]}
                data={filteredLeases}
                onRowClick={this.handleRowClick}
              />
              <Pagination
                activePage={activePage}
                maxPage={maxPage}
                onPageClick={(page) => this.handlePageClick(page)}
              />
            </div>
          )}
          {visualizationType === 'map' && (
            <AreaNotesEditMap
              areaNotes={areaNotes}
              showEditTools={false}
            />
          )}
        </TableWrapper>
      </PageContainer>
    );
  }
}

export default flowRight(
  connect(
    (state) => {
      return {
        areaNotes: getAreaNoteList(state),
        attributes: getAttributes(state),
        isFetching: getIsFetching(state),
        leases: getLeasesList(state),
      };
    },
    {
      createLease,
      fetchAreaNoteList,
      fetchAttributes,
      fetchLeases,
      initialize,
      receiveTopNavigationSettings,
    },
  ),
)(LeaseListPage);
