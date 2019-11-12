import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { styledComponent } from '../../utils/styledComponent';

const StyledDiv = styledComponent('div', {});

type WorkItemProps = {
  workItem: WorkItem;
};

type WorkItem = {
  destinationid: Number;
  id: Number;
  notes: String;
};

const WorkItemNotes: React.FC<WorkItemProps> = ({ workItem }) => {
  const [workOrdersData, setWorkOrdersData] = useState([]);
  useEffect(() => {
    axios(`/api/v1/destinations/work-items/${workItem.destinationid}/`)
      .then(workOrders => {
        const filteredData = workOrders.data.filter(
          item => item.workitemid !== workItem.id,
        );
        setWorkOrdersData(filteredData);
      })
      .catch(e => {
        console.log(e);
      });
  }, []);
  return (
    <StyledDiv>
      {workItem.notes && (
        <p className="instructions">
          <svg
            height="40"
            version="1.1"
            x="-20px"
            y="0px"
            viewBox="0 0 80 105"
            width="70"
          >
            <g>
              <path d="M50,39.2045441c-0.8634262,0-1.7273788,0.0864487-2.5043564,0.3452644C48.9636803,40.2408676,50,41.7089005,50,43.522728   c0,2.4179077-1.8997459,4.3181801-4.3181801,4.3181801c-2.418438,0-4.3181839-1.9002724-4.3181839-4.3181801   C39.9820518,45.3360252,39.2045441,47.5815659,39.2045441,50c0,5.9591103,4.8363457,10.7954559,10.7954559,10.7954559   S60.7954559,55.9591103,60.7954559,50S55.9591103,39.2045441,50,39.2045441z" />
              <path d="M2.5,50c0,0,43.1818199,53.4591141,95,0C45.6818199-3.4591119,2.5,50,2.5,50z M50,67.272728   c-9.4997902,0-17.272728-7.7729378-17.272728-17.272728c0-9.5003166,7.7729378-17.272728,17.272728-17.272728   S67.272728,40.4996834,67.272728,50C67.272728,59.4997902,59.4997902,67.272728,50,67.272728z" />
            </g>
          </svg>
          {workItem.notes}
        </p>
      )}
      <h5>Other Train Departures</h5>
      {workOrdersData.map(workItemData => {
        console.log(workItem);
        console.log(workItemData);
        return <div>{workItemData.depature_time}</div>;
      })}
    </StyledDiv>
  );
};

export default WorkItemNotes;
