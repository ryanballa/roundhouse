/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'evergreen-ui';
import moment from 'moment';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Formik } from 'formik';
import BaseTable, { Column } from 'react-base-table';
import { AddButton } from '../components/atoms/AddButton';
import SingleColumn from '../components/layout/SingleColumn';
import Input from '../components/atoms/forms/Input';
import { styledComponent } from '../utils/styledComponent';
import { colors } from '../config/styles';
import AddWorkOrder from './components/AddWorkOrder';
import { userState } from '../UserProvider';

const StyledDiv = styledComponent('div', {
  '& .BaseTable__body': {
    color: colors.body,
    fontSize: '16px',
  },
  '& .BaseTable__header-row': {
    borderBottom: `1px solid ${colors.border}`,
    fontSize: '16px',
    fontWeight: 600,
  },
  '& .BaseTable__row': {
    border: 'none',
  },
  '& .BaseTable__table': {
    outline: 'none',
  },
  '& .itemCallout': {
    width: '50%',
  },
  '& .items': {
    display: 'flex',
    marginTop: '20px',
  },
});

function WorkOrders({ history }) {
  const [data, setData] = useState([{ id: '1', road: 'Test' }]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddWorkOrderOpen, setIsAddWorkOrderOpen] = useState(false);
  const [sortBy, setSortBy] = useState({ key: 'id', order: 'asc' });
  const { user } = userState();

  const fetchData = async () => {
    setIsLoading(true);
    const result = await axios('/api/v1/workOrders');
    setData(result.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const linkFormatter = ({ rowData }) => (
    <Link to={`work-orders/${rowData.id}`}>{rowData.name}</Link>
  );

  const sortArrayOfObjects = (arr, key, order) => {
    return arr.sort((a, b) => {
      if (order === 'asc') {
        return a[key] > b[key] ? 1 : -1;
      }
      return a[key] < b[key] ? 1 : -1;
    });
  };

  const onColumnSort = sortByVal => {
    const sortedData = sortArrayOfObjects(data, sortByVal.key, sortByVal.order);
    setSortBy(sortByVal);
    setData(sortedData);
  };

  return (
    <SingleColumn history={history}>
      <h1>Work Orders</h1>
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <StyledDiv>
          <AddButton onClick={() => setIsAddWorkOrderOpen(true)}>
            Add Work Order
          </AddButton>
          <AddWorkOrder
            isOpen={isAddWorkOrderOpen}
            handleModalClose={() => {
              setIsAddWorkOrderOpen(false);
            }}
            handleUpdate={() => {
              fetchData();
              setIsAddWorkOrderOpen(false);
            }}
          />
          <BaseTable
            onColumnSort={onColumnSort}
            data={data}
            sortBy={sortBy}
            width={1200}
            height={400}
          >
            <Column sortable title="Id" key="id" dataKey="id" width={100} />
            <Column
              cellRenderer={linkFormatter}
              title="Name"
              key="name"
              dataKey="name"
              sortable
              width={300}
            />
            <Column
              title="Description"
              key="description"
              dataKey="description"
              sortable
              width={500}
            />
          </BaseTable>
        </StyledDiv>
      )}
    </SingleColumn>
  );
}

WorkOrders.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default WorkOrders;
