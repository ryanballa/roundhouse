/**
 * A utility to yeld async calls on an Enzyme wrapper
 * @param {ReactWrapper} wrapper
 */
// eslint-disable-next-line import/prefer-default-export
export async function asyncUpdates(wrapper) {
  await new Promise(resolve => setTimeout(resolve, 1));
  wrapper.update();
}
