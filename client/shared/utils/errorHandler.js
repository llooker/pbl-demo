// from here: https://github.com/GoogleCloudPlatform/stackdriver-errors-js#usage-as-a-utility
import StackdriverErrorReporter from 'stackdriver-errors-js';

export let errorHandler;

//if (window.location.origin !== "https://embed.demo.com:8080") {
console.log("inside ifff")
errorHandler = new StackdriverErrorReporter();
errorHandler.start({
  key: process.env.REACT_APP_STACKDRIVER_KEY,
  projectId: process.env.REACT_APP_GCP_PROJECT_ID,
  service: process.env.REACT_APP_PACKAGE_NAME,
});
// } else {
//   console.log("inside else")
//   errorHandler = { report: console.error };
// }

console.log({ errorHandler })

export default errorHandler;