import React, { Fragment, useEffect } from 'react';
import { Pane, toaster } from 'evergreen-ui';
import axios from 'axios';
import PropTypes from 'prop-types';
import SingleColumn from '../components/layout/SingleColumn';
import { userDispatch } from '../UserProvider';

function Logout({ history }) {
  const dispatch = userDispatch();

  useEffect(() => {
    const fetchData = () => {
      axios
        .get('/auth/logout/')
        .then(
          /* istanbul ignore next */ () => {
            /* istanbul ignore next */
            dispatch({ type: 'set', user: null });
            toaster.success('Logout Successful');
            history.push('/login');
          },
        )
        .catch(() => {});
    };
    fetchData();
  }, []);

  return (
    <SingleColumn history={history}>
      <h1>Logout</h1>
      <Fragment>
        <Pane>Logging out...</Pane>
      </Fragment>
    </SingleColumn>
  );
}

Logout.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default Logout;
