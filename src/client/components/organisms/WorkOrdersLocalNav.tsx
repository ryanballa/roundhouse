import React from 'react';
import { Link } from 'react-router-dom';
import TabMenu from '../atoms/TabMenu';

type LocalNavProps = {
  activeItem: string;
};

const WorkOrdersLocalNav: React.FC<LocalNavProps> = ({ activeItem }) => {
  return (
    <TabMenu>
      <li className={activeItem === 'workOrders' ? 'active' : ''}>
        <Link to="/work-orders">Work Orders</Link>
      </li>
      <li className={activeItem === 'trafficGenerators' ? 'active' : ''}>
        <Link to="/traffic-generators">Traffic Generators</Link>
      </li>
      <li className={activeItem === 'destinations' ? 'active' : ''}>
        <Link to="/destinations">Destinations</Link>
      </li>
      <li className={activeItem === 'situations' ? 'active' : ''}>
        <Link to="/situations">Situations</Link>
      </li>
    </TabMenu>
  );
};
export default WorkOrdersLocalNav;
