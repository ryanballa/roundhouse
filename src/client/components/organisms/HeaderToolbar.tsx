import React, { ReactNode } from 'react';
import { styledComponent } from '../../utils/styledComponent';

const StyledHeader = styledComponent('ul', {
    '& .butonWrapper': {
        display: 'flex',
        alignItems: 'center',
      },
      '& h1': {
        margin: 0,
      },
      '.intro': {
        display: 'block',
      },
      '.printButton': {
        marginLeft: '10px',
      },
      '@media print': {
        '& .introDesc': {
          display: 'none',
        },
        '& .butonWrapper': {
          display: 'none',
        },
      },
      display: 'flex',
      justifyContent: 'space-between',
      margin: '25px 0',
});

type HeaderToolbarProps = {
    children: ReactNode;
    description: String;
    title: String;
}

export const HeaderToolbar:  React.FC<HeaderToolbarProps> = ({ children, description, title }) => {
    return (<StyledHeader>
    <div className="intro">
        <h1>{title}</h1>
        <p className="introDesc">{description}</p>
    </div>
    <div className="butonWrapper">
        {children}
    </div>
  </StyledHeader>
)};
