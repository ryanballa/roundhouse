import React from 'react';
import { Link } from 'react-router-dom';
import SingleColumn from '../components/layout/SingleColumn';

function NotFound() {
  return (
    <SingleColumn>
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

export default NotFound;
