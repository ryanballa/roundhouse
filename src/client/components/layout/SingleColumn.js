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
  '& h1': {
    fontSize: '3em',
    marginBottom: 0,
  },
  '& h1 + p': {
    marginTop: 0,
  },
  '& h1, & h2, & h3': {
    color: colors.headers,
    fontFamily: fontConfig.familyHeaders,
    fontWeight: 'normal',
  },
  '& p': {
    fontSize: '20px',
  },
  fontFamily: fontConfig.familyStylized,
  margin: '30px auto',
  width: '1200px',
});

const SingleColumn = ({ authProtected, children, history }) => {
  useEffect(() => {
    const fetchData = () => {
      axios('/auth')
        .then(response => {
          if (!response.data.status === 'success') {
            history.push('/login');
          }
        })
        .catch(() => {
          history.push('/login');
        });
    };

    if (authProtected) fetchData();
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
  authProtected: PropTypes.bool,
  children: PropTypes.node.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

SingleColumn.defaultProps = {
  authProtected: true,
};

export default SingleColumn;
