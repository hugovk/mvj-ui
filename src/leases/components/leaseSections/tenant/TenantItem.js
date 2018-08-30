// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';

import ContactTemplate from '$src/contacts/components/templates/ContactTemplate';
import ExternalLink from '$components/links/ExternalLink';
import FormWrapper from '$components/form/FormWrapper';
import FormWrapperLeft from '$components/form/FormWrapperLeft';
import FormWrapperRight from '$components/form/FormWrapperRight';
import {getContactFullName} from '$src/contacts/helpers';
import {formatDate, formatNumber} from '$util/helpers';
import {getRouteById} from '$src/root/routes';

type Props = {
  contact: ?Object,
  tenant: Object,
};

const TenantItem = ({
  contact,
  tenant,
}: Props) => {
  const getInvoiceManagementShare = () => {
    if(!tenant ||
      !tenant.share_numerator ||
      !isNumber(Number(tenant.share_numerator)) ||
      !tenant.share_denominator ||
      !isNumber(Number(tenant.share_denominator))) {
      return null;
    }
    return (Number(tenant.share_numerator)*100/Number(tenant.share_denominator));
  };

  if(!contact) {
    return null;
  }

  const share = getInvoiceManagementShare();
  return (
    <div>
      <FormWrapper>
        <FormWrapperLeft>
          <Row>
            <Column small={12} medium={6} large={8}>
              <label>Asiakas</label>
              {contact
                ? <p><ExternalLink
                  href={`${getRouteById('contacts')}/${contact.id}`}
                  label={getContactFullName(contact)}
                /></p>
                : <p>-</p>
              }
            </Column>
          </Row>
        </FormWrapperLeft>
        <FormWrapperRight>
          <Row>
            <Column small={12} medium={6} large={4}>
              <label>Osuus murtolukuna:</label>
              <p>{get(tenant, 'share_numerator', '')} / {get(tenant, 'share_denominator', '')}</p>
            </Column>
            <Column small={12} medium={6} large={4}>
              <label>Laskun hallintaosuus</label>
              <p>{share ? `${formatNumber(share)} %` : '-'}</p>
            </Column>
            <Column small={12} medium={6} large={4}>
              <Row>
                <Column>
                  <label>Alkupvm</label>
                  <p>{formatDate(get(tenant, 'tenant.start_date'))}</p>
                </Column>
                <Column>
                  <label>Loppupvm</label>
                  <p>{formatDate(get(tenant, 'tenant.end_date'))}</p>
                </Column>
              </Row>
            </Column>
          </Row>
        </FormWrapperRight>
      </FormWrapper>
      <ContactTemplate
        contact={contact}
      />
      <FormWrapper>
        <FormWrapperLeft>
          <Row>
            <Column>
              <label>Viite</label>
              <p>{tenant.reference || '-'}</p>
            </Column>
          </Row>
        </FormWrapperLeft>
      </FormWrapper>
    </div>
  );
};

export default TenantItem;
