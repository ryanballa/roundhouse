import React from 'react';
import { Link } from 'react-router-dom';
import SingleColumn from '../components/layout/SingleColumn';
import TabMenu from '../components/atoms/TabMenu';
import { styledComponent } from '../utils/styledComponent';

const StyledSection = styledComponent('section', {
  '& li': {
    '& h3': {
      fontSize: '20px',
    },
    backgroundColor: '#fff2c4',
    color: '#5a472f',
    display: 'inline-block',
    listStyle: 'none',
    height: '270px',
    margin: '0 25px 25px 0',
    overflow: 'hidden',
    padding: '20px',
    width: '300px',
  },
  '& ul': {
    margin: 0,
    padding: 0,
  },
});

type SituationsViewProps = {
  activeItem: string;
  history: {
    push: () => void;
  };
};

const SituationsView: React.FC<SituationsViewProps> = ({
  history,
  activeItem,
}) => {
  return (
    <SingleColumn history={history}>
      <h1>Situations</h1>
      <p>
        A set of printable cards to add excitement to your operation session.
      </p>
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
      <StyledSection>
        <h2>Situation</h2>
        <ul>
          <li>
            <h3>Smoking Gun</h3>
            <p>
              Your crew spots a journal bearing overheating and smoking. Stop
              your train where its at and leave it for 10 minutes.
            </p>
          </li>
          <li>
            <h3>Sick Passenger</h3>
            <p>
              One of your passengers is sick. Stop at the next station and wait
              for the paramedics. If you're a freight, ignore this card.
            </p>
          </li>
          <li>
            <h3>Cow on Tracks</h3>
            <p>
              A cow has broken out and is blocking the tracks. Wait 5 minutes
              for the farmer to shoo it off the tracks.
            </p>
          </li>
          <li>
            <h3>Down Signals</h3>
            <p>
              A severe storm has knocked out the power to the signals. Proceed
              only with the dispatcher's ok and at 1/2 speed.
            </p>
          </li>
          <li>
            <h3>Track Out</h3>
            <p>
              A tree has fallen over onto the mainline. Proceed to nearest
              x-over, which may be behind you, and wrong main to following
              x-over.
            </p>
          </li>
          <li>
            <h3>Recrew</h3>
            <p>
              Your crew cannot complete their assignment on time. Switch jobs
              with someone else.
            </p>
          </li>
          <li>
            <h3>Red Flag Warning</h3>
            <p>
              Windy weather has caused the dispatcher to order all trains
              operate a quarter of their normal speed. Do this for 5 minutes and
              tell others.
            </p>
          </li>
          <li>
            <h3>Short Power</h3>
            <p>
              If you need to go up the hill to Summit, your train will not make
              it. Cut off any two cars and leave in Williamsport.
            </p>
          </li>
          <li>
            <h3>Customers Late</h3>
            <p>
              Customers are late unloading their cars. Pick two customers from
              your list to skip over.
            </p>
          </li>
          <li>
            <h3>Customer Late</h3>
            <p>
              A customer is late unloading their car. Pick one customer from
              your list to skip over.
            </p>
          </li>
          <li>
            <h3>Customers Late</h3>
            <p>
              Customers are late unloading their cars. Pick three customers from
              your list to skip over.
            </p>
          </li>
          <li>
            <h3>Train Blocked in Tunnel</h3>
            <p>
              You heard over the radio a train is blocked in a tunnel. Until
              verified, avoid any tunnels for 10 minutes.
            </p>
          </li>
          <li>
            <h3>Train Blocked in Tunnel</h3>
            <p>
              You heard over the radio a train is blocked in a tunnel. Until
              verified, avoid any tunnels for 5 minutes.
            </p>
          </li>
          <li>
            <h3>Trains Walking</h3>
            <p>
              The Engineering Department has found a broken rail ahead. Proceed
              at walking speed.
            </p>
          </li>
          <li>
            <h3>Bad Order Switch</h3>
            <p>
              The next switch you need to use is bad ordered. Until the
              Engineering Department can fix it, do other work for 5 minutes.
            </p>
          </li>
          <li>
            <h3>Broken Coupler</h3>
            <p>
              The last two cars of your train have come uncoupled. Have
              Georgetown yard send a crew to take them for repair.
            </p>
          </li>
          <li>
            <h3>Broken Coupler</h3>
            <p>
              The last three cars of your train have come uncoupled. Have
              Georgetown yard send a crew to take them for repair.
            </p>
          </li>
          <li>
            <h3>Coffee Break</h3>
            <p>
              Spend 5 minutes helping out your neighbor while your crew takes a
              coffee break.
            </p>
          </li>
          <li>
            <h3>Coffee Break</h3>
            <p>
              Spend 10 minutes helping out your neighbor while your crew takes a
              coffee break.
            </p>
          </li>
        </ul>
      </StyledSection>
    </SingleColumn>
  );
};
export default SituationsView;
