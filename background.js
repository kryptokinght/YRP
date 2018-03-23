console.log("Background JS has loaded");

chrome.browserAction.onClicked.addListener(function(tab){
	let message = {
		data: "Hii there"
	}
	chrome.tabs.sendMessage(tab.id, message, function(response){
		console.log(response);
	});
});