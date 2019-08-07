import React from 'react';
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
  fontSize: '18px',
  listStyle: 'none',
  margin: 0,
  padding: 0,
});

const Breadcrumb = ({ items, ...otherProps }) => (
  <StyledUl {...otherProps}>
    {items.map(item => (
      <li key={item.text}>
        {item.link && <Link to={item.link}>{item.text} &gt;</Link>}
        {!item.link && <span>{item.text}</span>}
      </li>
    ))}
  </StyledUl>
);

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      link: PropTypes.string,
      text: PropTypes.string,
    }),
  ),
};

Breadcrumb.defaultProps = {
  items: {},
};

export default Breadcrumb;
