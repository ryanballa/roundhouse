import React, { useEffect } from 'react';
import LogRocket from 'logrocket';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import axios from 'axios';
import Add from './locomotives/Add';
import EditContainer from './locomotives/EditContainer';
import List from './locomotives/List';
import LocomotivesCSV from './locomotives/LocomotivesCSV';
import Upload from './photos/Upload';
import Error from './pages/Error';
import Login from './pages/Login';
import Logout from './pages/Logout';
import NotFound from './pages/NotFound';
import Railcars from './railcars/Railcars';
import RailcarsAdd from './railcars/RailcarsAdd';
import RailcarsCSV from './railcars/RailcarsCSV';
import RailcarsView from './railcars/RailcarsView';
import Register from './pages/Register';
import SituationsView from './situations/SituationsView';
import Photos from './photos/Photos';
import { userDispatch } from './UserProvider';
import WorkOrders from './workOrders/WorkOrders';
import WorkOrdersView from './workOrders/WorkOrdersView';
import WorkOrdersPrintView from './workOrders/WorkOrdersPrintView';
import TrafficGenerators from './trafficGenerators/TrafficGenerators';
import TrafficGenerator from './trafficGenerators/TrafficGenerator';
import UsersView from './users/UsersView';
import Destinations from './destinations/Destinations';
import DashboardView from './dashboard/DashboardView';
import GroupsView from './groups/GroupsView';
import SignUp from './workOrders/SignUp';
import Layout from './layout/Layout';

const Routes = ({ history }) => {
  const dispatch = userDispatch();

  useEffect(() => {
    const fetchData = () => {
      axios('/auth')
        .then(response => {
          if (response.data.status === 'error') {
            history.push('/login');
          }
          dispatch({ type: 'set', user: response.data.user });
          console.log(process.env.NODE_ENV);
          if (process.env.NODE_ENV === 'production') {
            LogRocket.init('fy4vib/roundhouse');
            LogRocket.identify(response.data.user.username);
          }
        })
        .catch(() => {});
    };

    if (!Cookies.get('connect.sid')) {
      fetchData();
    }
  }, []);

  return (
    <div className="routeWrapper">
      <Switch>
        <Route exact path="/" component={DashboardView} />
        <Route exact path="/404" component={NotFound} />
        <Route exact path="/destinations" component={Destinations} />
        <Route exact path="/locomotives" component={List} />
        <Route exact path="/locomotives/csv" component={LocomotivesCSV} />
        <Route exact path="/photos/upload" component={Upload} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/logout" component={Logout} />
        <Route exact path="/locomotives/add" component={Add} />
        <Route exact path="/locomotives/:id" component={EditContainer} />
        <Route exact path="/photos" component={Photos} />
        <Route exact path="/railcars" component={Railcars} />
        <Route exact path="/railcars/csv" component={RailcarsCSV} />
        <Route exact path="/railcars/add" component={RailcarsAdd} />
        <Route exact path="/railcars/:id" component={RailcarsView} />
        <Route exact path="/groups" component={GroupsView} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/situations" component={SituationsView} />
        <Route exact path="/traffic-generators" component={TrafficGenerators} />
        <Route
          exact
          path="/traffic-generators/:id"
          component={TrafficGenerator}
        />
        <Route exact path="/error" component={Error} />
        <Route exact path="/work-orders" component={WorkOrders} />
        <Route exact path="/sign-up/:id" component={SignUp} />
        <Route exact path="/work-orders/:id" component={WorkOrdersView} />
        <Route
          exact
          path="/work-orders/print/:id"
          component={WorkOrdersPrintView}
        />
        <Route exact path="/dashboard" component={DashboardView} />
        <Route exact path="/users" component={UsersView} />
        <Route exact path="/layout" component={Layout} />
        <Route component={NotFound} />
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
