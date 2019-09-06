import { useState, useEffect } from 'react';
import Axios from 'axios';

function useTrafficGenerators() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await Axios('/api/v1/trafficGenerators');
        setIsLoading(false);
        setData(res.data);
      } catch (e) {
        setIsLoading(false);
        setError(true);
      }
    })();
  }, []);
  return [data, error, isLoading, setData];
}

export default useTrafficGenerators;
