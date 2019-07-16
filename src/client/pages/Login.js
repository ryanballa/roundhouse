import React from 'react';
import PropTypes from 'prop-types';
import SingleColumn from '../components/layout/SingleColumn';

function Login({ history }) {
  return (
    <SingleColumn history={history}>
      <h1>Login</h1>
      <p>This will be where you log in.</p>
    </SingleColumn>
  );
}

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default Login;
