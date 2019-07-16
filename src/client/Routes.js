import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import axios from 'axios';
import Add from './locomotives/Add';
import Edit from './locomotives/Edit';
import List from './locomotives/List';
import Upload from './photos/Upload';
import Home from './pages/Home';
import Error from './pages/Error';
import NotFound from './pages/NotFound';
import Railcars from './railcars/Railcars';
import RailcarsAdd from './railcars/RailcarsAdd';
import RailcarsView from './railcars/RailcarsView';
import Photos from './photos/Photos';

const Routes = ({ history }) => {
  useEffect(() => {
    const fetchData = () => {
      axios('/auth').then(response => {
        if (!response.data.user) {
          history.push('/login');
        }
      });
    };

    fetchData();
  }, []);

  return (
    <div className="routeWrapper">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/404" component={NotFound} />
        <Route exact path="/locomotives" component={List} />
        <Route exact path="/photos/upload" component={Upload} />
        <Route exact path="/locomotives/add" component={Add} />
        <Route exact path="/locomotives/:id" component={Edit} />
        <Route exact path="/photos" component={Photos} />
        <Route exact path="/railcars" component={Railcars} />
        <Route exact path="/railcars/add" component={RailcarsAdd} />
        <Route exact path="/railcars/:id" component={RailcarsView} />
        <Route exact path="/error" component={Error} />
      </Switch>
    </div>
  );
};

Routes.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(Routes);
