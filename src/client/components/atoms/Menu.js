import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { styledComponent } from '../../utils/styledComponent';

const StyledDiv = styledComponent('header', {
  '& .icon': {
    marginRight: '10px',
  },
  '& button': {
    '&.open svg.arrow': {
      transform: 'rotate(180deg)',
    },
    '&:hover': {
      cursor: 'pointer',
    },
    border: 'none',
    fontSize: '26px',
    outline: 'none',
  },
  '& svg.arrow': {
    marginLeft: '6px',
    position: 'relative',
    top: '5px',
  },
  '& ul': {
    backgroundColor: '#ffffff',
    left: 0,
    margin: 0,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: '30px',
  },
  '& ul li': {
    '& a': {
      color: '#61A3C5',
      display: 'block',
      fontSize: '24px',
      padding: '20px',
      textDecoration: 'none',
      width: '100%',
    },
    '& a:hover': {
      textDecoration: 'underline',
    },
    listStyle: 'none',
    margin: '0',
    padding: '0',
  },
  '& ul.closed': {
    display: 'none',
  },
  '& ul.open': {
    border: '1px solid #dadada',
    borderTop: 'none',
    boxShadow: '1px 4px 3px #e8e8e8',
    display: 'block',
    margin: 0,
    width: '100%',
  },
  position: 'relative',
  width: '300px',
});

const Menu = ({ children, icon, title }) => {
  const [openToggle, setOpenToggle] = useState(false);

  function handleMenuOpen() {
    setOpenToggle(!openToggle);
  }

  return (
    <StyledDiv>
      <button
        className={openToggle ? 'open' : 'closed'}
        onClick={handleMenuOpen}
        type="button"
      >
        <span className="icon">{icon}</span>
        {title}
        <svg
          className="arrow"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 15L12 9L6 15"
            stroke="#626262"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <ul className={openToggle ? 'open' : 'closed'}>{children}</ul>
    </StyledDiv>
  );
};

Menu.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.node,
  title: PropTypes.string,
};

Menu.defaultProps = {
  icon: null,
  title: 'Click Here',
};

export default Menu;
