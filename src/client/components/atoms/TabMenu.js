import React from 'react';
import PropTypes from 'prop-types';
import { styledComponent } from '../../utils/styledComponent';
import { colors } from '../../config/styles';

const StyledDiv = styledComponent('div', {
  '& .active': {
    '& a': {
      color: colors.menu.active,
    },
    borderBottom: `2px solid ${colors.menu.active}`,
  },
  '& a': {
    color: colors.menu.links,
    textDecoration: 'none',
  },
  '& li': {
    listStyle: 'none',
    marginRight: '40px',
    paddingBottom: '10px',
  },
  '& ul': {
    bottom: '-2px',
    display: 'flex',
    justifyContent: 'flexStart',
    margin: '0',
    position: 'relative',
  },
  borderBottom: `1px solid ${colors.border}`,
  fontSize: '18px',
  fontWeight: '600',
  marginBottom: '20px',
});

const TabMenu = ({ children }) => {
  return (
    <StyledDiv>
      <ul>{children}</ul>
    </StyledDiv>
  );
};

TabMenu.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TabMenu;
