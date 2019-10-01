import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ExportToCsv } from 'export-to-csv';
import PropTypes from 'prop-types';
import SingleColumn from '../components/layout/SingleColumn';

function RailcarsCSV({ history }) {
  const [isLoading, setIsLoading] = useState(false);

  const options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'Roundhouse - Railcars',
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
  };
  const csvExporter = new ExportToCsv(options);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await axios('/api/v1/railcars').then(res => {
        const adjustedData = res.data.map(item => {
          return {
            car_number: item.car_number,
            color: item.color || '',
            is_operational: item.is_operational,
            length: item.length,
            location: item.location,
            notes: item.notes || '',
            purchase_price: item.purchase_price || '',
            purchased_on: item.purchased_on || '',
            reporting_marks: item.reporting_marks,
            road: item.road,
            type: item.type,
            value: item.value || '',
          };
        });
        csvExporter.generateCsv(adjustedData);
      });
      setIsLoading(false);
    };
    fetchData();
  }, []);
  return (
    <SingleColumn history={history}>
      <h1>Download Railcars CSV</h1>
      {isLoading && <div>Loading ...</div>}
      <Link to="/locomotives">&lt; Back</Link>
    </SingleColumn>
  );
}

RailcarsCSV.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default RailcarsCSV;
