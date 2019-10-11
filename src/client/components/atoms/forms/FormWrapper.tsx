/* eslint-disable complexity */
import React, { FunctionComponent, ReactNode } from 'react';
import { styledComponent } from '../../../utils/styledComponent';

const StyledFormWrapper = styledComponent('div', {
  '& button': {
    marginTop: '28px',
  },
  '& li': {
    listStyle: 'none',
    marginBottom: '15px',
    marginRight: '15px',
  },
  '& ul': {
    paddingLeft: 0,
  },
});

type FormProps = {
  children: ReactNode;
};

const FormWrapper: FunctionComponent<FormProps> = ({ children }) => (
  <StyledFormWrapper>{children}</StyledFormWrapper>
);

export default FormWrapper;
