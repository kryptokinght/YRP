console.log("Background JS has loaded");

/*chrome.browserAction.onClicked.addListener(function(tab){
	let message = {
		data: "Hii there"
	}
	chrome.tabs.sendMessage(tab.id, message, function(response){
		console.log(response);
	});
});*/

chrome.browserAction.onClicked.addListener(function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id,"toggle");
    })
});