import React from 'react';
import { Link } from 'react-router-dom';
import SingleColumn from '../components/layout/SingleColumn';

function Home() {
  return (
    <SingleColumn>
      <h1>Roundhouse</h1>
      <p>What would you like to do?</p>
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

export default Home;
