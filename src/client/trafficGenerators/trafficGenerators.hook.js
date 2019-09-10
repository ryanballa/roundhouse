import { useState, useEffect } from 'react';
import trafficGeneratorsService from '../services/trafficGenerators.service';

function useTrafficGenerators() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    (() => {
      setIsLoading(true);
      trafficGeneratorsService
        .get()
        .then(res => {
          setIsLoading(false);
          setData(res);
        })
        .catch(e => {
          setError(e);
        });
    })();
  }, []);
  return [data, error, isLoading, setData];
}

export default useTrafficGenerators;
