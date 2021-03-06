import React, { FunctionComponent, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { styledComponent } from '../../utils/styledComponent';
import { colors } from '../../config/styles';

const StyledUl = styledComponent('ul', {
  '& a:link': {
    color: colors.links,
    textDecoration: 'none',
  },
  '& li': {
    display: 'inline',
    paddingRight: '5px',
  },
  '@media print': {
    display: 'none',
  },
  fontSize: '18px',
  listStyle: 'none',
  margin: 0,
  padding: 0,
});

type BreadCrumbProps = {
  items: Array<{
    link: string;
    text: string;
  }>;
};

const Breadcrumb: FunctionComponent<BreadCrumbProps> = ({
  items,
  ...otherProps
}) => (
  <StyledUl {...otherProps}>
    {items.map((item, i) => (
      <li key={i}>
        {item.link && <Link to={item.link}>{item.text} &gt;</Link>}
        {!item.link && <span>{item.text}</span>}
      </li>
    ))}
  </StyledUl>
);

export default Breadcrumb;
