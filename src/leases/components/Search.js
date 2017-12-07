// @flow
import React, {Component} from 'react';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import TextInput from '../../components/TextInput';
import SelectInput from '../../components/SelectInput';
import SingleCheckboxInput from '../../components/SingleCheckboxInput';

type State = {
  isBasicSearch: boolean,
  keyword: string,
  customer: string,
  roles: Array<string>,
  oldCustomer: boolean,
  types: Array<string>,
  leaseType: string,
  leaseMunicipality: string,
  leaseDistrict: string,
  leaseSequence: string,
  inEffect: boolean,
  finished: boolean,
  propertyType: string,
  propertyMunicipality: string,
  propertyDistrict: string,
  propertySequence: string,
  address: string,
  documentType: string,
}


class Search extends Component {
  state: State = {
    isBasicSearch: true,
    keyword: '',
    customer: '',
    roles: [],
    oldCustomer: false,
    types: [],
    leaseType: '',
    leaseMunicipality: '',
    leaseDistrict: '',
    leaseSequence: '',
    inEffect: false,
    finished: false,
    propertyType: '',
    propertyMunicipality: '',
    propertyDistrict: '',
    propertySequence: '',
    address: '',
    documentType: 'all',
  }

  handleTextInputChange = (e: any, id: string) => {
    this.setState({[id]: e.target.value});
  }

  handleCheckboxChange = (id:string) => {
    this.setState({[id]: !this.state[id]});
  }

  handleMultiSelectInputChange = (selectedOptions: Array<Object>, id: string) => {
    const options = selectedOptions.map((option) => {
      return (
        get(option, 'value')
      );
    });
    this.setState({[id]: options});
  }

  toggleSearchType = () => {
    this.setState({isBasicSearch: !this.state.isBasicSearch});
  }

  render () {
    const {
      isBasicSearch,
      keyword,
      customer,
      oldCustomer,
      roles,
      types,
      leaseType,
      leaseMunicipality,
      leaseDistrict,
      leaseSequence,
      inEffect,
      finished,
      propertyType,
      propertyMunicipality,
      propertyDistrict,
      propertySequence,
      address,
    } = this.state;

    return (
      <div className='search'>
        {isBasicSearch && (
          <div>
            <Row>
              <Column  className='search-box' large={12}>
                <TextInput placeholder={'Hae hakusanalla'} onChange={(e) => this.handleTextInputChange(e, 'keyword')} value={keyword}/>
              </Column>
            </Row>
          </div>
        )}
        {!isBasicSearch && (
          <div>
            <Row>
              <Column large={12}>
                <div className='advanced-search-row-wrapper'>
                  <div className='column-text-input-first'>
                    <label className='label-long'>Vuokralainen</label>
                    <TextInput placeholder={'Vuokralainen'} onChange={(e) => this.handleTextInputChange(e, 'customer')} value={customer}/>
                  </div>
                  <div className='column-checkbox'>
                    <SingleCheckboxInput
                      isChecked={oldCustomer}
                      onChange={() => this.handleCheckboxChange('oldCustomer')}
                      label='Vain vanhat asiakkaat'
                    />
                  </div>
                  <div className='column-select'>
                    <label className='label-medium'>Rooli</label>
                    <SelectInput
                      multi={true}
                      onChange={(e) => this.handleMultiSelectInputChange(e, 'roles')}
                      options={[
                        {value: '1', label: 'Vuokralainen'},
                        {value: '2', label: 'Laskun saaja'},
                        {value: '3', label: 'Yhteyshenkilö'},
                      ]}
                      searchable={false}
                      value={roles}
                    />
                  </div>
                </div>
              </Column>
            </Row>
            <Row>
              <Column large={12}>
                <div className='advanced-search-row-wrapper'>
                  <div className='column-text-input-first'>
                    <label className='label-long'>Vuokraus</label>
                    <div className='short-input'>
                      <TextInput onChange={(e) => this.handleTextInputChange(e, 'leaseType')} value={leaseType}/>
                    </div>
                    <div className='short-input'>
                      <TextInput onChange={(e) => this.handleTextInputChange(e, 'leaseMunicipality')} value={leaseMunicipality}/>
                    </div>
                    <div className='short-input'>
                      <TextInput onChange={(e) => this.handleTextInputChange(e, 'leaseDistrict')} value={leaseDistrict}/>
                    </div>
                    <div className='short-input'>
                      <TextInput onChange={(e) => this.handleTextInputChange(e, 'leaseSequence')} value={leaseSequence}/>
                    </div>
                  </div>
                  <div className='column-checkbox'>
                    <SingleCheckboxInput
                      isChecked={inEffect}
                      onChange={() => this.handleCheckboxChange('inEffect')}
                      label='Voimassa'
                    />
                    <SingleCheckboxInput
                      isChecked={finished}
                      onChange={() => this.handleCheckboxChange('finished')}
                      label='Päättyneet'
                    />
                  </div>
                  <div className='column-select'>
                    <label className='label-medium'>Tyyppi</label>
                    <SelectInput
                      multi={true}
                      onChange={(e) => this.handleMultiSelectInputChange(e, 'types')}
                      options={[
                        {value: '1', label: 'Hakemus'},
                        {value: '2', label: 'Varaus'},
                        {value: '3', label: 'Vuokraus'},
                        {value: '4', label: 'Lupa'},
                        {value: '5', label: 'Muistettavat ehdot'},
                      ]}
                      searchable={false}
                      value={types}
                    />
                  </div>
                </div>
              </Column>
            </Row>
            <Row>
              <Column large={12}>
                <div className='advanced-search-row-wrapper'>
                  <div className='column-text-input-first'>
                    <label className='label-long'>Kiinteistö</label>
                    <div className='short-input'>
                      <TextInput onChange={(e) => this.handleTextInputChange(e, 'propertyType')} value={propertyType}/>
                    </div>
                    <div className='short-input'>
                      <TextInput onChange={(e) => this.handleTextInputChange(e, 'propertyMunicipality')} value={propertyMunicipality}/>
                    </div>
                    <div className='short-input'>
                      <TextInput onChange={(e) => this.handleTextInputChange(e, 'propertyDistrict')} value={propertyDistrict}/>
                    </div>
                    <div className='short-input'>
                      <TextInput onChange={(e) => this.handleTextInputChange(e, 'propertySequence')} value={propertySequence}/>
                    </div>
                  </div>
                  <div className='column-text-input-second'>
                    <label className='label-small'>Osoite</label>
                    <div className='nomargin-input'>
                      <TextInput placeholder={'Osoite'} onChange={(e) => this.handleTextInputChange(e, 'address')} value={address}/>
                    </div>
                  </div>
                </div>
              </Column>
            </Row>
          </div>
        )}
        <Row>
          <Column large={12}>
            <a onClick={this.toggleSearchType} className='readme-link'>{isBasicSearch ? 'Tarkennettu haku' : 'Yksinkertainen haku'}</a>
          </Column>
        </Row>
      </div>
    );
  }
}

export default Search;