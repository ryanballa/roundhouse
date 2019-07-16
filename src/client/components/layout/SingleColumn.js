import React, { useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { colors, fontConfig } from '../../config/styles';
import { styledComponent } from '../../utils/styledComponent';
import Header from '../organisms/Header';

const StyledSection = styledComponent('section', {
  '& a': {
    color: colors.headers,
  },
  '& h1, & h2': {
    color: colors.headers,
    fontFamily: fontConfig.familyStylized,
  },
  fontFamily: fontConfig.familyBody,
  margin: 30,
});

const SingleColumn = ({ children, history }) => {
  useEffect(() => {
    const fetchData = () => {
      axios('/auth')
        .then(response => {
          if (!response.data.user) {
            history.push('/login');
          }
        })
        .catch(err => {
          history.push('/login');
        });
    };

    fetchData();
  }, []);
  return (
    <div>
      <Header />
      {/* <SubNavigation /> */}
      <StyledSection>{children}</StyledSection>
    </div>
  );
};

SingleColumn.propTypes = {
  children: PropTypes.node.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default SingleColumn;
