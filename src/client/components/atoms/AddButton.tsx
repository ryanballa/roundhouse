import React, { FunctionComponent, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { styledComponent } from '../../utils/styledComponent';
import { colors } from '../../config/styles';

const StyledLink = styledComponent('div', {
  '& a.link': {
    color: `${colors.form.buttonPrimaryBacgkround} !important`,
    display: 'flex',
    fontSize: '18px',
    fontWeight: '800',
    textDecoration: 'none',
  },
  '& svg': {
    marginRight: '10px',
  },
  '&:hover': {
    cursor: 'pointer',
  },
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'flex-end',
  marginBottom: '15px',
});

type AddButtonProps = {
  children: ReactNode;
  onClick: () => {};
  to?: string;
};

export const AddButton: FunctionComponent<AddButtonProps> = ({
  children,
  to = '#',
  ...otherProps
}) => (
  <StyledLink {...otherProps}>
    <Link className="link" to={to}>
      <svg
        width="27"
        height="27"
        viewBox="0 0 27 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="27" height="27" rx="4" fill="#61A3C5" />
        <path
          d="M14 7.16667V18.8333"
          stroke="#E8E8E8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.16667 13H19.8333"
          stroke="#E8E8E8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {children}
    </Link>
  </StyledLink>
);
