// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import FormTitleAndText from '$components/form/FormTitleAndText';
import ListItem from '$components/content/ListItem';
import ListItems from '$components/content/ListItems';
import SubTitle from '$components/content/SubTitle';
import {RentTypes, RentDueDateTypes} from '$src/leases/enums';
import {
  formatDate,
  formatNumber,
  getAttributeFieldOptions,
  getLabelOfOption,
} from '$util/helpers';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

const formatDueDate = (date: Object) => {
  return `${date.day}.${date.month}`;
};

const displayDueDates = (dates: Object) => {
  return dates.map((date) => formatDueDate(date)).join(', ');
};

type Props = {
  attributes: Attributes,
  rent: Object,
  rentType: ?string,
}

const BasicInfoIndex = ({attributes, rent}: Props) => {
  const typeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.type');
  const cycleOptions = getAttributeFieldOptions(attributes, 'rents.child.children.cycle');
  const indexTypeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.index_type');
  const dueDatesTypeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.due_dates_type');
  const intendedUseOptions = getAttributeFieldOptions(attributes, 'rents.child.children.fixed_initial_year_rents.child.children.intended_use');

  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Vuokralaji'
            text={getLabelOfOption(typeOptions, rent.type) || '-'}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormTitleAndText
            title='Alkupvm'
            text={formatDate(rent.start_date) || '-'}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormTitleAndText
            title='Loppupvm'
            text={formatDate(rent.end_date) || '-'}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Vuokrakausi'
            text={getLabelOfOption(cycleOptions, rent.cycle) || '-'}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Indeksin tunnusnumero'
            text={getLabelOfOption(indexTypeOptions, rent.index_type) || '-'}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Laskutusjako'
            text={getLabelOfOption(dueDatesTypeOptions, rent.due_dates_type) || '-'}
          />
        </Column>
        {rent.due_dates_type === RentDueDateTypes.CUSTOM &&
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Eräpäivät'
              text={rent.due_dates && !!rent.due_dates.length
                ? displayDueDates(rent.due_dates)
                : 'Ei eräpäiviä'
              }
            />
          </Column>
        }
        {rent.due_dates_type === RentDueDateTypes.FIXED &&
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Eräpäivät'
              text={rent.yearly_due_dates && !!rent.yearly_due_dates.length
                ? displayDueDates(rent.yearly_due_dates)
                : 'Ei eräpäiviä'
              }
            />
          </Column>
        }
      </Row>
      <Row>
        {(!!rent.elementary_index || !!rent.index_rounding) &&
          <Column small={12} medium={4} large={2}>
            <FormTitleAndText
              title='Perusindeksi/pyöristys'
              text={`${rent.elementary_index || '-'} / ${rent.index_rounding || '-'}`}
            />
          </Column>
        }
        {!!rent.x_value &&
          <Column small={4} medium={2} large={1}>
            <FormTitleAndText
              title='X-luku'
              text={rent.x_value || '-'}
            />
          </Column>
        }
        {!!rent.y_value &&
          <Column small={4} medium={2} large={1}>
            <FormTitleAndText
              title='Y-luku'
              text={rent.y_value || '-'}
            />
          </Column>
        }
        {!!rent.y_value_start &&
          <Column small={4} medium={2} large={1}>
            <FormTitleAndText
              title='Y-alkaen'
              text={rent.y_value_start || '-'}
            />
          </Column>
        }
        {(rent.equalization_start_date || rent.equalization_end_date) &&
          <Column small={12} medium={4} large={2}>
            <Row>
              <Column small={6}>
                <FormTitleAndText
                  title='Tasaus alkupvm'
                  text={formatDate(rent.equalization_start_date) || '-'}
                />
              </Column>
              <Column small={6}>
                <FormTitleAndText
                  title='Tasaus loppupvm'
                  text={formatDate(rent.equalization_end_date) || '-'}
                />
              </Column>
            </Row>

          </Column>
        }
      </Row>
      <SubTitle>Kiinteät alkuvuosivuokrat</SubTitle>
      {!rent.fixed_initial_year_rents || !rent.fixed_initial_year_rents.length &&
        <FormText>Ei kiinteitä alkuvuosivuokria</FormText>
      }
      {!!rent.fixed_initial_year_rents && !!rent.fixed_initial_year_rents.length &&
        <ListItems>
          <Row>
            <Column small={3} medium={3} large={2}>
              <FormTextTitle title='Käyttötarkoitus' />
            </Column>
            <Column small={3} medium={3} large={2}>
              <FormTextTitle title='Kiinteä alkuvuosivuokra' />
            </Column>
            <Column small={3} medium={3} large={1}>
              <FormTextTitle title='Alkupvm' />
            </Column>
            <Column small={3} medium={3} large={1}>
              <FormTextTitle title='Loppupvm' />
            </Column>
          </Row>
          {rent.fixed_initial_year_rents.map((item, index) => {
            return (
              <Row key={index}>
                <Column small={3} medium={3} large={2}>
                  <ListItem>{getLabelOfOption(intendedUseOptions, item.intended_use) || '-'}</ListItem>
                </Column>
                <Column small={3} medium={3} large={2}>
                  <ListItem>{item.amount ? `${formatNumber(item.amount)} €` : '-'}</ListItem>
                </Column>
                <Column small={3} medium={3} large={1}>
                  <ListItem>{formatDate(item.start_date) || '-'}</ListItem>
                </Column>
                <Column small={3} medium={3} large={1}>
                  <ListItem>{formatDate(item.end_date) || '-'}</ListItem>
                </Column>
              </Row>
            );
          })}
        </ListItems>
      }
      <Row>
        <Column>
          <FormTitleAndText
            title='Huomautus'
            text={rent.note || '-'}
          />
        </Column>
      </Row>
    </div>
  );
};

const BasicInfoOneTime = ({attributes, rent}: Props) => {
  const typeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.type');

  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Vuokralaji'
            text={getLabelOfOption(typeOptions, rent.type) || '-'}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormTitleAndText
            title='Alkupvm'
            text={formatDate(rent.start_date) || '-'}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormTitleAndText
            title='Loppupvm'
            text={formatDate(rent.end_date) || '-'}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Kertakaikkinen vuokra'
            text={formatNumber(rent.amount) || '-'}
          />
        </Column>
      </Row>
      <Row>
        <Column>
          <FormTitleAndText
            title='Huomautus'
            text={rent.note || '-'}
          />
        </Column>
      </Row>
    </div>
  );
};

const BasicInfoFixed = ({attributes, rent}: Props) => {
  const typeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.type');
  const dueDatesTypeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.due_dates_type');

  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Vuokralaji'
            text={getLabelOfOption(typeOptions, rent.type) || '-'}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormTitleAndText
            title='Alkupvm'
            text={formatDate(rent.start_date) || '-'}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormTitleAndText
            title='Loppupvm'
            text={formatDate(rent.end_date) || '-'}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Laskutusjako'
            text={getLabelOfOption(dueDatesTypeOptions, rent.due_dates_type) || '-'}
          />
        </Column>
        {rent.due_dates_type === RentDueDateTypes.CUSTOM &&
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Eräpäivät'
              text={rent.due_dates && !!rent.due_dates.length
                ? displayDueDates(rent.due_dates)
                : 'Ei eräpäiviä'
              }
            />
          </Column>
        }
        {rent.due_dates_type === RentDueDateTypes.FIXED &&
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title=''
              text={rent.yearly_due_dates && !!rent.yearly_due_dates.length
                ? displayDueDates(rent.yearly_due_dates)
                : 'Ei eräpäiviä'
              }
            />
          </Column>
        }
      </Row>
      <Row>
        <Column>
          <FormTitleAndText
            title='Huomautus'
            text={rent.note || '-'}
          />
        </Column>
      </Row>
    </div>
  );
};

const BasicInfoFree = ({attributes, rent}: Props) => {
  const typeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.type');

  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Vuokralaji'
            text={getLabelOfOption(typeOptions, rent.type) || '-'}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormTitleAndText
            title='Alkupvm'
            text={formatDate(rent.start_date) || '-'}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormTitleAndText
            title='Loppupvm'
            text={formatDate(rent.end_date) || '-'}
          />
        </Column>
      </Row>
      <Row>
        <Column>
          <FormTitleAndText
            title='Huomautus'
            text={rent.note || '-'}
          />
        </Column>
      </Row>
    </div>
  );
};

const BasicInfo = ({attributes, rent, rentType}: Props) => {
  return (
    <div>
      {!rentType &&
        <FormText>Vuokralajia ei ole valittu</FormText>
      }
      {rentType === RentTypes.INDEX &&
        <BasicInfoIndex
          attributes={attributes}
          rent={rent}
          rentType={rentType}
        />
      }
      {rentType === RentTypes.ONE_TIME &&
        <BasicInfoOneTime
          attributes={attributes}
          rent={rent}
          rentType={rentType}
        />
      }
      {rentType === RentTypes.FIXED &&
        <BasicInfoFixed
          attributes={attributes}
          rent={rent}
          rentType={rentType}
        />
      }
      {rentType === RentTypes.FREE &&
        <BasicInfoFree
          attributes={attributes}
          rent={rent}
          rentType={rentType}
        />
      }
      {rentType === RentTypes.MANUAL &&
        <BasicInfoIndex
          attributes={attributes}
          rent={rent}
          rentType={rentType}
        />
      }
    </div>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
    };
  },
)(BasicInfo);
