/* eslint-disable react/no-multi-comp */
import React, { useState } from 'react';
import SingleColumn from '../components/layout/SingleColumn';
import { styledComponent } from '../utils/styledComponent';
import { colors } from '../config/styles';
import { usePromise } from '../utils/promise.hook';
import locomotivesService from '../services/locomotives.service';
import railcarsService from '../services/railcars.service';
import moment from 'moment';
import { groupBy } from 'lodash';
import { LineChart } from 'react-chartkick';
import 'chart.js';

const StyledGraph = styledComponent('section', {
  '& h2': {
    marginBottom: '10px',
  },
  '& .key': {
    '& h3': {
      marginLeft: '20px',
    },
    '& li': {
      '&:before': {
        backgroundColor: '#8CC3F5',
        content: '""',
        display: 'inline-block',
        height: '10px',
        marginRight: '10px',
        width: '10px',
      },
      '&#keyRailcar': {
        '&:before': {
          backgroundColor: '#21517d',
        },
      },
      'list-style': 'none',
    },
    border: `1px solid ${colors.form.stroke}`,
  },
});

type DashbordViewProps = {
  history: {
    push: () => void;
  };
};

const DashboardView: React.FC<DashbordViewProps> = ({ history }) => {
  const [locomotiveData, isLoading] = usePromise(
    locomotivesService.get,
    [],
    [],
  );
  const [railcarData, isRailcarsLoading] = usePromise(
    railcarsService.get,
    [],
    [],
  );

  const groupDataByMonth = purchaseData => {
    return groupBy(purchaseData, result => {
      return moment(result['purchased_on'], 'YYYY-MM-DD').startOf('month');
    });
  };

  const constructData = (dataToFormat = []) => {
    const results = {};
    const dateObj = {};
    let date;
    for (var prop in dataToFormat) {
      date = moment(prop).format('MM/DD/YYYY');
      const itemCount = dataToFormat[prop].length;
      dateObj[date] = itemCount;
      Object.assign(results, dateObj);
    }
    return results;
  };

  const constructSpendData = (dataToFormat = []) => {
    const results = {};
    const dateObj = {};
    let date;
    for (var prop in dataToFormat) {
      let totalSpend = 0;
      dataToFormat[prop].forEach(val => {
        totalSpend += Math.round(val.purchase_price);
      });
      date = moment(prop).format('MM/DD/YYYY');
      dateObj[date] = totalSpend;
      Object.assign(results, dateObj);
    }
    return results;
  };

  return (
    <SingleColumn history={history}>
      <h1>Dashboard</h1>
      {isLoading && isRailcarsLoading && <div>Loading....</div>}
      {!isLoading && !isRailcarsLoading && (
        <div>
          <StyledGraph>
            <h2>Purcahses by Month</h2>
            <LineChart
              colors={['#8CC3F5', '#21517d']}
              data={[
                {
                  name: 'Locomotives',
                  data: constructData(groupDataByMonth(locomotiveData)),
                },
                {
                  name: 'Railcars',
                  data: constructData(groupDataByMonth(railcarData)),
                },
              ]}
              legend={false}
            />
            <div className="key">
              <h3>Key</h3>
              <ul>
                <li id="keyLocomotive">
                  <b>Locomotives</b>
                </li>
                <li id="keyRailcar">
                  <b>Railcars</b>
                </li>
              </ul>
            </div>
          </StyledGraph>
          <StyledGraph>
            <h2>Total Spend per Month</h2>
            <LineChart
              colors={['#8CC3F5', '#21517d']}
              data={[
                {
                  name: 'Locomotives',
                  data: constructSpendData(groupDataByMonth(locomotiveData)),
                },
                {
                  name: 'Railcars',
                  data: constructSpendData(groupDataByMonth(railcarData)),
                },
              ]}
              legend={false}
            />
            <div className="key">
              <h3>Key</h3>
              <ul>
                <li id="keyLocomotive">
                  <b>Locomotives</b>
                </li>
                <li id="keyRailcar">
                  <b>Railcars</b>
                </li>
              </ul>
            </div>
          </StyledGraph>
        </div>
      )}
    </SingleColumn>
  );
};

export default DashboardView;
