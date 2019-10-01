import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ExportToCsv } from 'export-to-csv';
import PropTypes from 'prop-types';
import SingleColumn from '../components/layout/SingleColumn';

function LocomotivesCSV({ history }) {
  const [isLoading, setIsLoading] = useState(false);

  const options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'Roundhouse - Locomotives',
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
  };
  const csvExporter = new ExportToCsv(options);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await axios('/api/v1/locomotives').then(res => {
        const adjustedData = res.data.map(item => {
          console.log(item);
          return {
            dcc_number: item.dcc_number || '',
            engine_number: item.engine_number,
            has_dcc: item.is_dcc,
            is_operational: item.is_operational,
            location: item.location,
            notes: item.notes,
            purchase_price: item.purchase_price,
            purchased_on: item.purchased_on,
            road: item.road,
            type: item.type,
            value: item.value,
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
      <h1>Download Locomotives CSV</h1>
      {isLoading && <div>Loading ...</div>}
      <Link to="/locomotives">&lt; Back</Link>
    </SingleColumn>
  );
}

LocomotivesCSV.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default LocomotivesCSV;
