import React from 'react';
import PropTypes from 'prop-types';

const UserStateContext = React.createContext();
const UserDispatchContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case 'set': {
      return {
        user: action.user ? action.user.data.status : null,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
function UserProvider({ children }) {
  const [state, dispatch] = React.useReducer(userReducer, {
    user: null,
  });
  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}
function userState() {
  const context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error('userState must be used within a UserProvider');
  }
  return context;
}
function userDispatch() {
  const context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error('userDispatch must be used within a UserProvider');
  }
  return context;
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { UserProvider, userState, userDispatch };
