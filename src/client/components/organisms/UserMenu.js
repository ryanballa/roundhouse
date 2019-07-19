import React from 'react';
import { Link } from 'react-router-dom';
import { styledComponent } from '../../utils/styledComponent';
import { userState } from '../../UserProvider';
// import { colors } from '../../config/styles';

const StyledUserMenu = styledComponent('menu', {
  '& li': {
    color: 'black',
    display: 'inline',
    listStyle: 'none',
    marginRight: '20px',
  },
  marginLeft: 'auto',
});

const UserMenu = () => {
  const { user } = userState();
  return (
    <StyledUserMenu>
      <ul>
        <li>{user && user.username}</li>
        <li>{user && <Link to="/logout">Logout</Link>}</li>
      </ul>
    </StyledUserMenu>
  );
};

export default UserMenu;
