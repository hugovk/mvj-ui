// @flow
import React from 'react';
import get from 'lodash/get';

import Collapse from '../../../../components/Collapse';
import * as helpers from '../../../helpers';
import Rule from './Rule';
import {Row, Column} from 'react-foundation';

type Props = {
  rules: Array<Object>,
}
const Rules = ({rules}: Props) => {

  return (
    <div className='lease-section'>
      {rules && rules.length > 0 && rules.map((rule, index) =>
        <Collapse key={index}
          defaultOpen={false}
          header={
            <Row>
              <Column small={4}>
                <svg className='doc-icon' viewBox="0 0 30 30">
                  <path d="M3.75.38H18.8l.42.28L26 7.41l.28.42v21.79H3.75V.38zM6 2.62v24.76h18v-18h-6.75V2.62zm3.38 9h11.24v2.26H9.38zm0 4.5h11.24v2.26H9.38zm0 4.5h11.24v2.26H9.38zM19.5 4.24v2.88h2.88z"/>
                </svg>
                <span className='collapse__header-title'>Päätös {get(rule, 'rule_clause')}</span>
              </Column>
              <Column small={4}><span className='collapse__header-subtitle'>{helpers.formatDate(get(rule, 'rule_date'))}</span></Column>
              <Column small={4}><span className='collapse__header-subtitle'>{get(rule, 'rule_maker')}</span></Column>
            </Row>
          }
        >
          <Rule rule={rule} />
        </Collapse>
      )}
    </div>
  );
};

export default Rules;