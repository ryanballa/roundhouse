import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { styledComponent } from '../../utils/styledComponent';

const StyledDiv = styledComponent('div', {
  '& p': {
    alignItems: 'center',
    display: 'flex',
  },
  '& svg': {
    fill: '#848484',
    height: '50px',
    marginLeft: '-20px',
    marginRight: '10px',
    overflow: 'hidden',
    width: '60px',
  },
});

type WorkItemProps = {
  workItem: WorkItem;
};

type WorkItem = {
  destinationid: Number;
  id: Number;
  notes: String;
};

const PrintItemNotes: React.FC<WorkItemProps> = ({ workItem }) => {
  const [workOrdersData, setWorkOrdersData] = useState([]);
  useEffect(() => {
    axios(`/api/v1/destinations/work-items/${workItem.destinationid}/`)
      .then(workOrders => {
        const filteredData = workOrders.data.filter(
          item => item.workitemid !== workItem.id,
        );
        const sortedWorkOrders = filteredData.sort((a, b) => {
          if (a.depature_time < b.depature_time) {
            return -1;
          }
          if (a.depature_time > b.depature_time) {
            return 1;
          }
          return 0;
        });
        setWorkOrdersData(sortedWorkOrders);
      })
      .catch(e => {
        console.log(e);
      });
  }, []);
  return (
    <StyledDiv>
      {workOrdersData.map(workItemData => {
        return (
          <li>
            {workItemData.arrival_time && (
              <span>{workItemData.arrival_time} - </span>
            )}
            {workItemData.depature_time} : {workItemData.name}
          </li>
        );
      })}
    </StyledDiv>
  );
};

export default PrintItemNotes;
