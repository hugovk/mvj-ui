// @ flow
import React from 'react';
import {GeoJSON} from 'react-leaflet';

import {formatDate, getLabelOfOption} from '$util/helpers';

type Coordinate = Array<number>;

type RentBasisFeature = {
  geometry: {
    coordinates: Array<Coordinate>,
    type: string,
  },
  properties: Object,
  type: 'Feature',
}

export type RentBasisGeoJson = {
  crs?: {
    properties: {
      name: string,
    },
    type: string,
  },
  features: Array<RentBasisFeature>,
  type: 'FeatureCollection',
}

type Props = {
  color: string,
  financingOptions: Array<Object>,
  geoJSON: RentBasisGeoJson,
  indexOptions: Array<Object>,
  managementOptions: Array<Object>,
  plotTypeOptions: Array<Object>,
}

const RentBasisLayer = ({
  color,
  financingOptions,
  geoJSON,
  indexOptions,
  managementOptions,
  plotTypeOptions,
}: Props) => {
  const onMouseOver = (e) => {
    const layer = e.target;
    layer.setStyle({
      fillOpacity: 0.7,
    });
  };

  const onMouseOut = (e) => {
    const layer = e.target;
    layer.setStyle({
      fillOpacity: 0.2,
    });
  };

  return (
    <GeoJSON
      data={geoJSON}
      onEachFeature={(feature, layer) => {
        if (feature.properties) {
          const {
            detailed_plan_identifier,
            end_date,
            financing,
            id,
            index,
            lease_rights_end_date,
            management,
            plot_type,
            property_identifiers,
            start_date,
          } = feature.properties;

          const getPropertyIdentifierString = () => {
            if(property_identifiers && property_identifiers.length) {
              let text = '';
              property_identifiers.forEach((identifier, index) => {
                if(index + 1 < property_identifiers.length) {
                  text += `${identifier.identifier}, `;
                } else {
                  text += `${identifier.identifier}`;
                }
              });
              return text;
            }
            return '-';
          };

          const identifierText = getPropertyIdentifierString();
          const popupContent = `<p class='title'><strong>Vuokrausperusteet</strong></p>
            <p><strong>Id:</strong> ${id}</p>
            <p><strong>Tonttityyppi:</strong> ${getLabelOfOption(plotTypeOptions, plot_type) || '-'}</p>
            <p><strong>Alkupvm:</strong> ${formatDate(start_date) || '-'}</p>
            <p><strong>Loppupvm:</strong> ${formatDate(end_date) || '-'}</p>
            <p><strong>Kiinteistötunnukset:</strong> ${identifierText}</p>
            <p><strong>Asemakaava:</strong> ${detailed_plan_identifier || '-'}</p>
            <p><strong>Hallintamuoto:</strong> ${getLabelOfOption(managementOptions, management) || '-'}</p>
            <p><strong>Rahoitusmuoto:</strong> ${getLabelOfOption(financingOptions, financing) || '-'}</p>
            <p><strong>Vuokraoikeuspäättyy:</strong> ${formatDate(lease_rights_end_date) || '-'}</p>
            <p><strong>Indeksi:</strong> ${getLabelOfOption(indexOptions, index) || '-'}</p>`;
          layer.bindPopup(popupContent);
        }

        layer.on({
          mouseover: onMouseOver,
          mouseout: onMouseOut,
        });
      }}
      style={{
        color: color,
      }}
    />
  );
};

export default RentBasisLayer;