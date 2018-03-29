console.log("Background JS has loaded");
/*
Everything starts with the click on BrowserAction.
*/

/*
LocalStorage format for storing MusicPlayer info
{
	yrps: {
		recents : [{song1},{song2},{song3}],
		starred : ["songurl1","songurl2","songurl3"],
		playlists : [
			{"playlist1": ["songurl1","songurl2","songurl3"]},
			{"playlist2": ["songurl1","songurl2","songurl3"]},
			{"playlist3": ["songurl1","songurl2","songurl3"]}
		]
	}
}
*/

var player = {
	active: false,
	tab_id: 0,
	active_url: ""
};
var video_detail = {
	url: "",
	repeats: 0,
	title: "",
	playlist: "",
	playIcon: "",
	starred: false,
	startTime: 0,
	endTime: 0
};
var recents=[], starred=[], playlists=[];

var CurrentTab;
//initializing history, starred, playlists
chrome.storage.local.get(["yrps"], function(result) {
	if(Object.keys(result).length === 0) { //when localStorage is empty
		console.log("LocalStorage is empty!");
	}
	else {
		console.log("Value of local storage");
		console.log(result);
		history = result["yrps"]["history"];
		playlists = result["yrps"]["playlists"];
		starred = result["yrps"]["starred"];
		console.log("recents");
		console.log(recents);
		console.log("playlists");
		console.log(playlists);
		console.log("starred");
		console.log(starred);
	}
});


//********************************************************************************
// EVERYTHING starts with the user clicking on the BrowserAction button
chrome.browserAction.onClicked.addListener(function(){
	/*
		1.when player is not active, first time player load
		2.when player already active, either toggle or player active tab change
	*/

	//1.player not active
	if(!player.active) {
		//console.log("First time player load()");
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			player.active = true;
			player.tab_id = tabs[0].id;
			player.active_url = tabs[0].url;
			chrome.tabs.sendMessage(player.tab_id, {task:"loadPlayer"});
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
			if(tabs[0].id == player.tab_id) {
				//console.log("toggle player message sent");
				chrome.tabs.sendMessage(tabs[0].id, {task:"togglePlayer"})
			}
			//2.active tab change
			else {  
				/*
					1.close the previous running music player
					2.load the music player in this new tab
				*/
				//1.
				chrome.tabs.sendMessage(player.tab_id, {task:"closePlayer"});
				//2.
				player.tab_id = tabs[0].id;
				player.active_url = tabs[0].url;
				chrome.tabs.sendMessage(player.tab_id, {task:"loadPlayer"});
			}
		});
	}
});


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if(message.task == "checkRefreshState") {
		console.log("Message received to check refresh state for Tab");
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			if(player.active) {
				if(tabs[0].id == player.tab_id)
					sendResponse({refreshState: true});
				else {
					sendResponse({refreshState: false});	
				}
			}
			else {
				sendResponse({refreshState: false});
			}
		});
	}
	return true;
});
//Remember to use 'return true' https://stackoverflow.com/questions/20077487/chrome-extension-message-passing-response-not-sent


/*
Whenever a tab updates, it its URL matches the youtube watch regx, browserAction
activates.
Whenever the ACTIVE TAB is updated, send message to content_script to change state
of the player.
*/
chrome.tabs.onUpdated.addListener( //whenever any of the tab is updated
  function(tabId, changeInfo, tab) {
  	console.log("Tab updated!!");
  	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  		let patt = new RegExp("https://www.youtube.com/watch");
  		if(patt.test(tabs[0].url))
  			chrome.browserAction.enable(tabs[0].id);
  		
  		if(tabs[0].id == player.tab_id && tabs[0].url != player.active_url) { //if the updated tabID matches the player_tab_id
  			console.log("Active player Tab updated");
  			chrome.tabs.sendMessage(player.tab_id, {task:"playerTabUpdated"});
  		}
  	});
  }
);



// listens for getCurrentTabID task and sends the current tab ID
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	/*NOT needed*/
	if(message.task == "getCurrentTabId") {
		console.log("Message <content.js> getCurrentTabId");
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			sendResponse({activeTabId: tabs[0].id});
		});		
	}
	return true;
});

// listens for getPlayerTabId task and sends player.tab_id
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	/*NOT needed*/
	if(message.task == "getPlayerTabId") {
		console.log("Message <content.js> getPlayerTabId");
		sendResponse({playerTabId: player.tab_id});
	}
	return true;
});

// listens for getCurrentTabUrl task and sends current tab Url
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if(message.task == "getCurrentTabUrl") {
		console.log("Message <content.js> getCurrentTabUrl");
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			sendResponse({activeTabUrl: tabs[0].url});
		});		
	}
	return true;
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if(message.task == "searchUrlInStorage") {
		console.log("searchUrlInStorage() performing");
		let found = -1;
		for(let i = 0; i < recents.length; i++) {
			if(recents[i].url == message.url) {
				found = i;
				break;
			}
		}
		if(found > -1) {
			sendResponse({playerState:2, videoData: recents[found]});
		}
		else
			sendResponse({playerState:1});
	}
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if(message.task == "disableBrowserAction") {
		console.log("disable");
		chrome.browserAction.disable(sender.tab.id);		
	}
	else if(message.task == "enableBrowserAction") {
		chrome.browserAction.enable(sender.tab.id);		
	}
	return true;
});