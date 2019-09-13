/* eslint-disable import/prefer-default-export */
import React from 'react';

export function usePromise(promiseOrFunction, defaultValue) {
  const [state, setState] = React.useState({
    value: defaultValue,
    error: null,
    isPending: true,
  });

  React.useEffect(() => {
    let isSubscribed = true;
    const promise =
      typeof promiseOrFunction === 'function' && isSubscribed
        ? promiseOrFunction()
        : promiseOrFunction;

    promise
      .then(value =>
        isSubscribed
          ? setState({ value, error: null, isPending: false })
          : null,
      )
      .catch(error =>
        isSubscribed
          ? setState({ value: defaultValue, error, isPending: false })
          : null,
      );

    // eslint-disable-next-line no-return-assign
    return () => (isSubscribed = false);
  }, []);

  const { value, error, isPending } = state;
  return [value, error, isPending, setState];
}
