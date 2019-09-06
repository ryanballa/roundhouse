import { useState, useEffect } from 'react';
import api from '../api';

function useTrafficGenerators() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    (() => {
      setIsLoading(true);
      api.trafficGenerators.get(
        res => {
          setIsLoading(false);
          setData(res.data);
        },
        () => {
          setIsLoading(false);
          setError(true);
        },
      );
    })();
  }, []);
  return [data, error, isLoading, setData];
}

export default useTrafficGenerators;
