console.log("Background JS has loaded");


var player_state_active = false;

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if(message.task == "getPlayerState") {
		console.log("Message received!! from content script!!")
		sendResponse({playerState: player_state_active});
	}
});

chrome.browserAction.onClicked.addListener(function(){
	player_state_active = true;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    	var msg = {
    		task:"toggle",
    		playerState: player_state_active
    	};
        chrome.tabs.sendMessage(tabs[0].id, msg);	
	});
});