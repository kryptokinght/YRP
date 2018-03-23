console.log("Content JS has loaded");

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	console.log(message.data);
});