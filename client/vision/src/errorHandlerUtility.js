// from here: https://github.com/GoogleCloudPlatform/stackdriver-errors-js#usage-as-a-utility

import StackdriverErrorReporter from 'stackdriver-errors-js';

let errorHandler;

console.log('window.location', window.location)
// if (process.env.NODE_ENV === 'production') {
if (window.location.origin !== "https://embed.demo.com:8080") {
  console.log('inside ifff')
  errorHandler = new StackdriverErrorReporter();
  errorHandler.start({
    key: process.env.REACT_APP_STACKDRIVER_KEY,
    projectId: process.env.REACT_APP_GCP_PROJECT_ID,
    // The following optional arguments can also be provided:

    // service: myServiceName,
    // Name of the service reporting the error, defaults to 'web'.

    // version: myServiceVersion,
    // Version identifier of the service reporting the error.

    // reportUncaughtExceptions: false
    // Set to false to prevent reporting unhandled exceptions, default: `true`.

    // reportUnhandledPromiseRejections: false
    // Set to false to prevent reporting unhandled promise rejections, default: `true`.

    // disabled: true
    // Set to true to not send error reports, this can be used when developing locally, default: `false`.

    // context: {user: 'user1'}
    // You can set the user later using setUser()

  });
} else {
  console.log('else')
  errorHandler = { report: console.error };
}

export default errorHandler;