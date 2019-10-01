import React, { FunctionComponent, ReactNode } from 'react';
import { styledComponent } from '../../utils/styledComponent';
import { AddButton } from './AddButton';
import { colors } from '../../config/styles';

const StyledSection = styledComponent('section', {
  alignItems: 'center',
  border: `1px solid ${colors.form.stroke}`,
  borderRadius: '4px',
  display: 'flex',
  flexDirection: 'column',
  margin: '0 auto',
  textAlign: 'center',
  width: '500px',
});

type AddButtonProps = {
  children: ReactNode | string;
  entity: string;
  to?: string;
};

const ZeroState: FunctionComponent<AddButtonProps> = ({
  children,
  entity,
  to = '#',
}) => (
  <StyledSection>
    {children}
    <AddButton to={to}>Add {entity}</AddButton>
  </StyledSection>
);

export default ZeroState;
