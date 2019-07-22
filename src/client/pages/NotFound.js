import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import SingleColumn from '../components/layout/SingleColumn';

function NotFound({ history }) {
  return (
    <SingleColumn history={history} authProtected={false}>
      <h1>Not Found</h1>
      <p>
        We cannot find that. Maybe it was deleted or your link is incorrect.
      </p>
      <b>Useful Actions</b>
      <ul>
        <li>
          <Link to="locomotives/add">Add A Locomotive</Link>
        </li>
        <li>
          <Link to="locomotives">Manage Locomotives</Link>
        </li>
      </ul>
    </SingleColumn>
  );
}

NotFound.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default NotFound;
