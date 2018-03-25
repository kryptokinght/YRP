console.log("Background JS has loaded");
/*
Everything starts with the click on BrowserAction.
*/


var player_state_active = false;
var player_tab_id;



//********************************************************************************
// EVERYTHING starts with the user clicking on the BrowserAction button
chrome.browserAction.onClicked.addListener(function(){
	/*
		1.when player is not active, first time player load
		2.when player already active, either toggle or player active tab change
	*/

	//1.player not active
	if(!player_state_active) {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			player_state_active = true;
			player_tab_id = tabs[0].id;
			chrome.tabs.sendMessage(player_tab_id, {task:"loadPlayer"});
		});
	}
	//2.player active
	else { 
		/*
			1.toggle condition, hide/show the music player
			2.active tab change 
		*/
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			//1.toggle condition
			if(tabs[0].id == player_tab_id) { 
				chrome.tabs.sendMessage(tabs[0].id, {task:"togglePlayer"})
			}
			//2.active tab change
			else {  
				/*
					1.close the previous running music player
					2.load the music player in this new tab
				*/
				//1.
				chrome.tabs.sendMessage(player_tab_id, {task:"closePlayer"});
				//2.
				player_tab_id = tabs[0].id;
				chrome.tabs.sendMessage(player_tab_id, {task:"loadPlayer"});
			}
		});
	}
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    	var msg = {
    		task:"toggle",
    		playerState: player_state_active
    	};
    	player_tab_id = tabs[0].id;
    	player_state_active = true;
        chrome.tabs.sendMessage(tabs[0].id, msg);	
	});
});


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if(message.task == "getPlayerState") {
		console.log("Message received for player_state_active");
		sendResponse({playerState: player_state_active});
	}
});


/*
Whenever the ACTIVE TAB is updated, send message to content_script to change state
of the player.
*/
chrome.tabs.onUpdated.addListener( //whenever any of the tab is updated
  function(tabId, changeInfo, tab) {
  	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  		//console.log("tabs[0] " + tabs[0].id);
  		//console.log("tab" + player_tab_id);
  		if(tabs[0].id == player_tab_id) { //if the updated tabID matches the player_tab_id
  			console.log("Active player Tab updated");
  			chrome.tabs.sendMessage(player_tab_id, {task:"playerTabUpdated"});
  		}
  	});
  }
);

/*chrome.tabs.onActivated.addListener(function(activeInfo) {
  // how to fetch tab url using activeInfo.tabid
  chrome.tabs.get(activeInfo.tabId, function(tab){
     console.log(tab.url);
  });
});*/

// listens for getCurrentTabID task and sends the current tab ID
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if(message.task == "getCurrentTabId") {
		console.log("Message <content.js> getCurrentTabId");
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			sendResponse({activeTabId: tabs[0].id});
		});		
	}
});
