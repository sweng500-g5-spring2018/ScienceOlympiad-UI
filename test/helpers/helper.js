/**
 * Function for flushing current promises in the microtasks Queue
 *  This is useful when rendering components that setState during the
 *  React lifecycle.  Because 'setState' is executed asynchronously and
 *  gets added to the microtask queue, it may not finish by the time an
 *  expect statement runs in a test.  To force these microtasks to finish
 *  we can provide a microtask that waits for a macrotask to complete
 *  (which setTimeout is a macrotask).  Using the following syntax in JEST
 *  will force the test to await for this function to complete, because the
 *  macrotask (setTimeout) will only execute and finish after any microtasks
 *  that are currently in the queue.  I think.
 *
 *  USAGE EXAMPLE:
 *
 *  import helper from [RELATIVE PATH to this file];
 *
 *  test('test description', async () => {
 *      const component = shallow(<Component />);
 *
 *      await helper.flushPromises();
 *      component.update();
 *
 *      //EXECUTE EXPECTS
 *  }
 *
 * @returns {Promise<any>}
 */
function flushPromises() {
    return new Promise((resolve, reject) => setTimeout(resolve, 0));
}

module.exports.mockedEvent = {
    target: {
        attributes: {
            getNamedItem: () => {
                return {value: 'test'}
            }
        }
    },
    preventDefault : () => {}
}

module.exports.flushPromises = flushPromises;