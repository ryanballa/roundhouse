import React, { useEffect, useState } from 'react';
import axios from 'axios';
import shortid from 'shortid';
import PrintItemNotes from './components/PrintItemNotes';
import { styledComponent } from '../utils/styledComponent';

const StyledDiv = styledComponent('div', {
  '& .borderBottom': {
    borderBottom: '1px solid #000',
  },
  '& .borderTop': {
    borderTop: '1px solid #000',
  },
  '& .departureColumm': {
    borderRight: '2px solid #000',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    width: '40%',
  },
  '& h2': {
    fontWeight: 'normal',
  },
  '& h3': {
    margin: '10px 0 10px 10px',
    padding: 0,
  },
  '& p': {
    margin: '0 0 10px 10px',
  },
  header: {
    '& h1': {
      margin: '0 0 10px 0',
      padding: 0,
    },
    '& h2': {
      margin: 0,
      padding: 0,
    },
    borderBottom: '6px solid #000',
    padding: '30px 0',
    textAlign: 'center',
  },
  '& .leftColumnWrappers': {
    borderRight: '2px solid #000',
    display: 'flex',
    textAlign: 'center',
    width: '80%',
  },
  '& li': {
    listStyle: 'none',
  },
  '& .locationColumn': {
    textAlign: 'left',
    width: '100%',
  },
  '& .otherTrafficColumn': {
    paddingTop: '10px',
    width: '30%',
  },
  '& section': {
    borderBottom: '6px solid #000',
    display: 'flex',
    minHeight: '300px',
  },
  '& .typewriter': {
    fontFamily: 'American Typewriter',
  },
  '& ul': {
    margin: '0 0 10px 0',
    padding: '0 0 0 10px',
  },
  borderBottom: '6px solid #000',
  fontFamily: 'MissionGothic',
});

type WorkOrdersPrintViewProps = {};

const WorkOrdersPrintView: React.FC<WorkOrdersPrintViewProps> = ({
  history,
  match,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [workOrder, setWorkOrder] = useState({
    workItems: [],
    destinations: [],
    traffic: [],
    trafficGenerators: [],
    workOrdersResults: [{}],
  });

  const sortTasks = tasksToSort => {
    return tasksToSort.sort((a, b) => {
      var nameA = a.taskstype.toUpperCase();
      var nameB = b.taskstype.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    });
  };

  const fetchData = async () => {
    setIsLoading(true);
    await axios(`/api/v1/workOrders/${match.params.id}`)
      .then(workOrderRes => {
        if (!workOrderRes.data) {
          history.push('/404');
        }
        setWorkOrder(workOrderRes.data);
        setIsLoading(false);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <StyledDiv>
      <header>
        <h1>Garfield Central Railroad</h1>
        <h2>Work Order</h2>
      </header>
      {workOrder.workItems.map(workItem => (
        <section>
          <div className="leftColumnWrappers">
            <div className="departureColumm">
              <div className="borderBottom">
                <h3>Arrive At</h3>
                <p className="typewriter">{workItem.arrival_time}</p>
              </div>
              <div className="borderTop">
                <h3>Leave At</h3>
                <p className="typewriter">{workItem.depature_time}</p>
              </div>
            </div>
            <div className="locationColumn">
              <div className="borderBottom">
                <h3>Location</h3>
                <p className="typewriter">{workItem.destinationname}</p>
              </div>
              <div>
                <h3>Tasks</h3>
                <ul className="typewriter">
                  {sortTasks(workItem.tasks).map(task => {
                    return (
                      <li key={shortid.generate()} className="task">
                        [ ] {task.taskstype}{' '}
                        {task.taskstype === 'pick' ? 'up' : 'off'}{' '}
                        {task.is_passenger_stop ? 'passengers' : ''} {task.road}{' '}
                        {task.reporting_marks} {task.car_number} {task.type}{' '}
                        {task.color} {task.taskstype === 'pick' ? 'from' : 'to'}{' '}
                        {task.name}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
          <div className="otherTrafficColumn">
            <p>Please be advised of the presence of trains at these times:</p>
            <ul className="typewriter">
              <PrintItemNotes workItem={workItem} />
            </ul>
          </div>
        </section>
      ))}
    </StyledDiv>
  );
};

export default WorkOrdersPrintView;
