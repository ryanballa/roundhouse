/**
 * A utility to yeld async calls on an Enzyme wrapper
 * @param {ReactWrapper} wrapper
 */
export async function asyncUpdates(wrapper) {
  await new Promise(resolve => setTimeout(resolve, 1));
  wrapper.update();
}
