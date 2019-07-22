import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import SingleColumn from '../components/layout/SingleColumn';
import { userState } from '../UserProvider';

function Home({ history }) {
  const { user } = userState();
  return (
    <SingleColumn history={history} authProtected={false}>
      <h1>Roundhouse</h1>
      {!user && (
        <>
          <p>
            Roundhouse is a collection managment tool for model railroading.
            Track what you own in detail. Prioritize projects and easily
            remember what is in your collection.
          </p>
          <p>
            <Link to="register">Join</Link>
          </p>
        </>
      )}
      {user && (
        <>
          <p>What would you like to do?</p>

          <ul>
            <li>
              <Link to="locomotives/add">Add A Locomotive</Link>
            </li>
            <li>
              <Link to="locomotives">Manage Locomotives</Link>
            </li>
          </ul>
        </>
      )}
    </SingleColumn>
  );
}

Home.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default Home;
