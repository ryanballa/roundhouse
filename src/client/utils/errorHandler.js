export function errorHandler(history, message, status) {
  if (status === 401) {
    history.push('/login');
  } else {
    history.push('/error');
  }
}
