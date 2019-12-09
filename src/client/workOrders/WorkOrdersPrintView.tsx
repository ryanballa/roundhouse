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
    letterSpacing: '1px',
    fontWeight: 'normal',
  },
  '& h3': {
    letterSpacing: '1px',
    margin: '10px 0 10px 10px',
    padding: 0,
    textTransform: 'uppercase',
  },
  '& p': {
    margin: '0 0 10px 10px',
  },
  footer: {
    '& .approval': {
      borderLeft: '1px solid #000',
      borderRight: '1px solid #000',
    },
    '& .generated': {
      borderLeft: '1px solid #000',
    },
    '& div': {
      display: 'inline-block',
      float: 'right',
      padding: '0 10px',
      width: '20%',
    },
    textAlign: 'center',
  },
  header: {
    '& h1': {
      letterSpacing: '1px',
      margin: '0 0 10px 0',
      padding: 0,
      textTransform: 'uppercase',
    },
    '& h2': {
      letterSpacing: '1px',
      margin: 0,
      padding: 0,
      textTransform: 'uppercase',
    },
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
  '& .notes': {
    '& b': {
      marginRight: '15px',
      textTransform: 'uppercase',
    },
    '& .instructions': {
      textAlign: 'left',
    },
    '& .run': {
      borderRight: '1px solid #000',
      width: '106px',
    },
    '& span': {
      padding: '5px 15px',
    },
    borderTop: '3px solid #000',
    display: 'flex',
    justifyContent: 'space-between',
  },
  '& .otherTrafficColumn': {
    fontSize: '11px',
    paddingTop: '10px',
    width: '40%',
  },
  '& section': {
    borderTop: '6px solid #000',
    borderBottom: '6px solid #000',
    display: 'flex',
    minHeight: '150px',
  },
  '& .typewriter': {
    fontFamily: 'American Typewriter',
  },
  '& ul': {
    margin: '0 0 10px 0',
    padding: '0 0 0 10px',
  },
  fontFamily: 'MissionGothic',
  letterSpacing: '1px',
});

type WorkOrdersPrintViewProps = {
  notes: String;
};

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
    workOrdersResults: [
      {
        name: '',
        notes: '',
      },
    ],
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
    window.print();
    fetchData();
  }, []);

  return (
    <StyledDiv>
      <header>
        <h1>Garfield Central Railroad</h1>
        <h2>Work Order</h2>
      </header>
      <div className="notes">
        <span className="run">
          <b>Run</b>
          {workOrder.workOrdersResults[0].name}
        </span>
        <span className="instructions">
          <b>Notes</b>
          {workOrder.workOrdersResults[0].notes}
        </span>
      </div>
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
            <p>
              <b>Please be advised of the presence of trains at these times:</b>
            </p>
            <ul className="typewriter">
              <PrintItemNotes workItem={workItem} />
            </ul>
          </div>
        </section>
      ))}
      <footer>
        <div className="approval">
          <h3>Approved By</h3>
          <p>R.K.B</p>
        </div>
        <div className="generated">
          <h3>Generated</h3>
          <p>19 Nov. 2019</p>
        </div>
      </footer>
    </StyledDiv>
  );
};

export default WorkOrdersPrintView;
