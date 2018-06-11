// @flow
import React from 'react';
import {connect} from 'react-redux';

import Table from '$components/table/Table';
import {getContentBasisOfRents} from '$src/leases/helpers';
import {
  formatNumber,
  getAttributeFieldOptions,
  getLabelOfOption,
  sortByOptionsAsc,
  sortByOptionsDesc,
  sortNumberByKeyAsc,
  sortNumberByKeyDesc,
} from '$util/helpers';
import {getAttributes, getCurrentLease} from '$src/leases/selectors';

import type {Attributes, Lease} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  currentLease: Lease,
}

const BasisOfRents = ({attributes, currentLease}: Props) => {
  const basisOfRents = getContentBasisOfRents(currentLease);
  const intendedUseOptions = getAttributeFieldOptions(attributes,
    'basis_of_rents.child.children.intended_use');

  return (
    <div>
      <Table
        data={basisOfRents}
        dataKeys={[
          {key: 'intended_use', label: 'Käyttötarkoitus', renderer: (val) => getLabelOfOption(intendedUseOptions, val) || '-', ascSortFunction: (a, b, key) => sortByOptionsAsc(a, b, key, intendedUseOptions), descSortFunction: (a, b, key) => sortByOptionsDesc(a, b, key, intendedUseOptions)},
          {key: 'floor_m2', label: 'K-m2', renderer: (val) => formatNumber(val) || '-', ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
          {key: 'index', label: 'Indeksi', renderer: (val) => formatNumber(val) || '-', ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
          {key: 'amount_per_floor_m2_index_100', label: '€/k-m2 (ind 100)', renderer: (val) => formatNumber(val) || '-', ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
          {key: 'amount_per_floor_m2_index', label: '€/k-m2 (ind)', renderer: (val) => formatNumber(val) || '-', ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
          {key: 'percent', label: 'Prosenttia', renderer: (val) => val ? `${formatNumber(val)} %` : '-', ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
          {key: 'year_rent_index_100', label: 'Perusvuosivuokra €/v (ind 100)', renderer: (val) => formatNumber(val) || '-', ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
          {key: 'year_rent_index', label: 'Alkuvuosivuokra €/v (ind)', renderer: (val) => formatNumber(val) || '-', ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
        ]}
        noDataText='Ei vuokranperusteita'
        secondaryTable
        sortable
      />
    </div>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
      currentLease: getCurrentLease(state),
    };
  },
)(BasisOfRents);
