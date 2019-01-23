/* eslint-disable no-undef */
console.log('Background.js file loaded');

browser.runtime.onMessage.addListener(function (message) {
  console.log(message);
});

