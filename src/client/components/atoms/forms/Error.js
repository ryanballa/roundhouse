import React from 'react';
import { styledComponent } from '../../../utils/styledComponent';
import { colors } from '../../../config/styles';

const StyledDiv = styledComponent('div', {
  color: colors.error,
  paddingTop: '5px',
});

const Error = ({children}) => (
  <StyledDiv>
    {children}
  </StyledDiv>
);

export default Error;
