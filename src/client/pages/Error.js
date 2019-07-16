import React from 'react';
import { Link } from 'react-router-dom';
import SingleColumn from '../components/layout/SingleColumn';

function Error() {
  return (
    <SingleColumn>
      <h1>Error</h1>
      <p>An error has occurred. Please try again later.</p>
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

export default Error;
