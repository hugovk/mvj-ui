// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import AreaNotesLayer from '$src/areaNote/components/AreaNotesLayer';
import AreaNotesEditMap from '$src/areaNote/components/AreaNotesEditMap';
import LeaseListLayer from './LeaseListLayer';
import {fetchAreaNoteList} from '$src/areaNote/actions';
import {defaultZoom, mapColors} from '$src/constants';
import {MAX_ZOOM_LEVEL_TO_FETCH_LEASES} from '$src/leases/constants';
import {LeaseFieldPaths} from '$src/leases/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {getContentLeasesGeoJson} from '$src/leases/helpers';
import {
  getApiResponseResults,
  getFieldOptions,
  getUrlParams,
  hasPermissions,
} from '$util/helpers';
import {getBoundsFromBBox} from '$util/map';
import {getAreaNoteList} from '$src/areaNote/selectors';
import {getAttributes as getLeaseAttributes, getLeasesByBBox} from '$src/leases/selectors';
import {getUsersPermissions} from '$src/usersPermissions/selectors';

import type {Attributes, LeafletGeoJson} from '$src/types';
import type {AreaNoteList} from '$src/areaNote/types';
import type {LeaseList} from '$src/leases/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type Props = {
  areaNotes: AreaNoteList,
  fetchAreaNoteList: Function,
  isLoading: boolean,
  leaseAttributes: Attributes,
  leasesData: LeaseList,
  location: Object,
  onViewportChanged: Function,
  usersPermissions: UsersPermissionsType,
}

type State = {
  bounds: ?Object,
  leaseAttributes: Attributes,
  leasesData: LeaseList,
  leasesGeoJson: LeafletGeoJson,
  stateOptions: Array<Object>,
  zoom: number,
}

class LeaseListMap extends PureComponent<Props, State> {
  state = {
    bounds: null,
    leaseAttributes: null,
    leasesData: null,
    leasesGeoJson: {
      features: [],
      type: 'FeatureCollection',
    },
    stateOptions: [],
    zoom: defaultZoom,
  }

  componentDidMount() {
    const {fetchAreaNoteList, usersPermissions} = this.props;

    this.setState({bounds: this.getMapBounds()});

    if(hasPermissions(usersPermissions, UsersPermissions.VIEW_AREANOTE)) {
      fetchAreaNoteList({});
    }
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.leasesData !== state.leasesData) {
      newState.leasesData = props.leasesData;
      newState.leasesGeoJson = getContentLeasesGeoJson(getApiResponseResults(props.leasesData));
    }
    if(props.leaseAttributes !== state.leaseAttributes) {
      newState.leaseAttributes = props.leaseAttributes;
      newState.stateOptions = getFieldOptions(props.leaseAttributes, LeaseFieldPaths.STATE);
    }

    return !isEmpty(newState) ? newState : null;
  }

  getMapBounds = () => {
    const {location: {search}} = this.props;
    const searchQuery = getUrlParams(search);

    return getBoundsFromBBox(searchQuery.in_bbox);
  }

  getOverlayLayers = () => {
    const layers = [];
    const {
      areaNotes,
      usersPermissions,
    } = this.props;
    const {leasesGeoJson, stateOptions} = this.state;

    {hasPermissions(usersPermissions, UsersPermissions.VIEW_AREANOTE) &&
      layers.push({
        checked: false,
        component: <AreaNotesLayer
          key='area_notes'
          allowToEdit={false}
          areaNotes={areaNotes}
        />,
        name: 'Muistettavat ehdot',
      });
    }

    layers.push({
      checked: true,
      component: <LeaseListLayer
        key='leases'
        color={mapColors[0 % mapColors.length]}
        leasesGeoJson={leasesGeoJson}
        stateOptions={stateOptions}
      />,
      name: 'Vuokraukset',
    });

    return layers;
  }

  handleViewportChanged = (mapOptions: Object) => {
    const {onViewportChanged} = this.props;

    this.setState({zoom: mapOptions.zoom});

    onViewportChanged(mapOptions);
  }


  render() {
    const {isLoading} = this.props;
    const {bounds, zoom} = this.state;
    const overlayLayers = this.getOverlayLayers();

    return(
      <Fragment>
        <AreaNotesEditMap
          allowToEdit={false}
          bounds={bounds}
          isLoading={isLoading}
          onViewportChanged={this.handleViewportChanged}
          overlayLayers={overlayLayers}
          showZoomLevelWarning={zoom < MAX_ZOOM_LEVEL_TO_FETCH_LEASES}
          zoomLevelWarningText='Tarkenna lähemmäksi kartalla hakeaksesi vuokraukset'
        />
      </Fragment>
    );
  }
}

export default flowRight(
  // $FlowFixMe
  withRouter,
  connect(
    (state) => {
      return {
        areaNotes: getAreaNoteList(state),
        leaseAttributes: getLeaseAttributes(state),
        leasesData: getLeasesByBBox(state),
        usersPermissions: getUsersPermissions(state),
      };
    },
    {
      fetchAreaNoteList,
    }
  ),
)(LeaseListMap);
