// @flow
import React from 'react';

type Props = {
  children?: any,
}

const FormWrapper = ({children}: Props) =>
  <div className='form-wrapper'>{children}</div>;

export default FormWrapper;
