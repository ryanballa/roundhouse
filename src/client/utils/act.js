import { act as reactAct } from 'react-dom/test-utils';

const SUPPRESSED_PREFIXES = [
  'Warning: Do not await the result of calling act(...) with sync logic, it is not a Promise.',
  'Warning: An update to %s inside a test was not wrapped in act(...)',
];
function isSuppressedErrorMessage(message) {
  return SUPPRESSED_PREFIXES.some(sp => message.startsWith(sp));
}
export async function act(f) {
  const oldError = window.console.error;
  window.console.error = (...args) => {
    /* istanbul ignore if  */
    if (!isSuppressedErrorMessage(args[0])) {
      oldError(...args);
    }
  };
  await Promise.race([reactAct(f), new Promise(res => setTimeout(res))]);
  window.console.error = oldError;
}
