import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Add from './locomotives/Add';
import Edit from './locomotives/Edit';
import List from './locomotives/List';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

const Routes = () => (
  <div className="routeWrapper">
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/404" component={NotFound} />
      <Route exact path="/locomotives" component={List} />
      <Route exact path="/locomotives/add" component={Add} />
      <Route exact path="/locomotives/:id" component={Edit} />
    </Switch>
  </div>
);

export default withRouter(Routes);
