/*
Whenever a youtube tab is loaded, content.js is loaded.Now when the browserAction 
is clicked, the player template is created and the music player becomes
active(playerState = true), player_tab_id is modified. The video in the webpage is
read and loaded in the player...... BUT, if the music player is already active in 
another tab, the music player in the other tab is closed and the player in the
current tab becomes active.

The content.js performs 3 basic functions:
1.Functions for the BrowserAction
2.Function when the current Tab is updated
3.Function if tab is refreshed

1. This includes listening for 3 tasks: loadPlayer(), closePlayer(), togglePlayer()
2. The current tab can be updated(song changed) without the content script changing.
   The tab update feature is implemented in background. In content we add a listener
   which listens for playerTabUpdated message from background. It performs the task
   of refreshPlayer(). The listener will be "playerTabUpdated"
3. When a page is refreshed the content script also reloads. We need to load the
   music player if the active tab player is refreshed. Therefore, in the beginning 
   of the content.js we send a message to background asking for the player_state_active
   info. If true, loadPlayer(). We don't care about the false condition.
SO 1 and 2 are listeners while 3 is a check condition.
We need to implement 4 functions loadPlayer(), closePlayer(), togglePlayer(), 
refreshPlayer().
And we need to implement 4 listeners for 1. and 2. and a check condition for 3. which
also contains a listener.	
*/

console.log("YRP Content JS has loaded");


var iframe, setTimeModal; //iframe stores the main music player
var intervalId;
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

toggleBrowserAction();

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if(message.task == "initializeMusicPlayer") {
		//console.log("Initialzing music player");
		initializeMusicPlayer(false);
	}
	return true;
});


/*
	1. and 2.
	All the 4 listeners for 1. and 2. implemented here.
*/
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if(message.task == "playerTabUpdated") {
		//console.log("player tab update refreshplayer() called");
		toggleBrowserAction(); //sets browserAction on or off DOESnt work
		refreshPlayer();
		stopRepeat();
	}
	else if(message.task == "loadPlayer") {
		loadPlayer();
	}
	else if(message.task == "togglePlayer") {
		togglePlayer();
	}
	else if(message.task == "closePlayer") {
		closePlayer();
		stopRepeat();
	}
});
//---------------------------------------------------------------------------


/*
	3.
	Get the player_active_state info for page refresh condition
	if True, loadPlayer().
	checkRefreshState
	compares the currentTabId with the player_tab_id
	RUNS ONLY ONCE when content.js loads
*/
chrome.runtime.sendMessage({task: "checkRefreshState"}, function(response) {
	//console.log("Checking for refresh!!");	
	if(response.refreshState) {
		stopRepeat();
		loadPlayer();
	}
	else {
		//console.log("Music player already active in another tab or this tab");
		//console.log("Click on browserAction to activate here");
	}
});
//---------------------------------------------------------------------------

//************Listeners for controlling the setTime modal********************
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if(message.task == "setTimeModal"){   	
    	createTimeModal();
    }
    else if(message.task == 'submitTimeModal') {
    	console.log(message.timeData);
    	initializeMusicPlayer(true, message.timeData);
    	repeatVideo(message.timeData);
    	setTimeModal.parentNode.removeChild(setTimeModal);

    }
    else if(message.task == 'closeTimeModal'){ //when close button is clicked
    	//console.log("Closing the time modal");
    	setTimeModal.parentNode.removeChild(setTimeModal);
    }
    else if(message.task == 'repeatVideo') {
    	repeatVideo();
    	initializeMusicPlayer(true);
    }
});


//*****************function definitions*********************


function removeMusicPlayer() {
	let temp_iframe = document.getElementById('yrp111'); 
	temp_iframe.parentNode.removeChild(temp_iframe);
}

function loadPlayer() {
	//console.log("loadPlayer called!");
	//creates the music player template
	createMusicPlayer();
	toggle();
}

function closePlayer() {
	//console.log("closePlayer called!");
	removeMusicPlayer();
}

function togglePlayer() {
	//console.log("togglePlayer called!");
	toggle();
}

function refreshPlayer() {
	//console.log("refreshPlayer called!");
	toggle(true, false); //force open music player
	initializeMusicPlayer(false);
}

function toggle(forceOpen = false, forceClose = false) {
	//toggles the music player iframe, opens and closes it.
	if(forceOpen) {
		iframe.style.width="300px";
		return;
	}
	if(forceClose) {
		iframe.style.width="0px";
		return;
	}
    if(iframe.style.width == "0px")
        iframe.style.width="300px";
    else
        iframe.style.width="0px";
}

function getVideoData() {
	let title = document.querySelector('title').innerText;
	let vid = document.getElementsByTagName('video');
	//getting the thumbnail of the video
	let videoid = vid[0].baseURI.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
	let thumbImage ="https://i1.ytimg.com/vi/"+videoid[1]+"/default.jpg";

	let video_detail = {
		url: vid[0].baseURI,
		repeats: 0,
		title: title,
		playlist: "",
		playIcon: thumbImage,
		starred: false,
		startTime: 0,
		endTime: vid[0].duration - 0.03
	};

	return video_detail;
}

function initializeMusicPlayer(save = false, timeData = {}) {
	/*
	> scrapes video off page and stores in video_detail
	> checks wether video present in local storage and changes playerState to 1 or 2
	> sends message to musicPlayer.js to initialize the player containing video_detail
	  and playerState  
	*/
	let taskState = "videoData";
	if(save)
		taskState = "videoDataSave";
	
	let video_detail = getVideoData();
	if(Object.keys(timeData).length) {
		video_detail.startTime = timeData.startTime;
		video_detail.endTime = timeData.endTime;
	} 
	//console.log(video_detail);
	chrome.runtime.sendMessage({task: "searchUrlInStorage", url: video_detail.url}, function(response) {
		if(save && response.playerState == 2) {
			/*Data already present in localStorage, just change timeData*/
			chrome.runtime.sendMessage({
				task:"videoDataModify",
				url: video_detail.url,
				timeData 
			});
		}
		else if(response.playerState == 2) {
			chrome.runtime.sendMessage({
				task: taskState, 
				video_detail, 
				playerState: 2
			}, function(response){
				//console.log("Video information sent to musicPlayer.js");
			});		
		}
		else {
			//send videoData as it is
			chrome.runtime.sendMessage({
				task: taskState, 
				video_detail, 
				playerState: 1
			}, function(response){
				//console.log("Video information sent to musicPlayer.js");
			});	
		}

		return true;
	});
}

function createMusicPlayer() {
	/*creates the music player in the right side of window*/
	iframe = document.createElement('iframe');
	iframe.id = "yrp111";
	iframe.style.height = "100%";
	iframe.style.width = "0px";
	iframe.style.position = "fixed";
	iframe.style.top = "0px";
	iframe.style.right = "0px";
	iframe.style.zIndex = "9000000000000000000";
	iframe.frameBorder = "none";
	iframe.style.transition = "0.5s";
	iframe.style.opacity = "0.95";
	iframe.src = chrome.extension.getURL("musicPlayer.html");
	document.body.appendChild(iframe);	
}

function createTimeModal(){
	setTimeModal = document.createElement('iframe');
	setTimeModal.style.height = "250px";
	setTimeModal.style.width = "400px";
	setTimeModal.style.position = "fixed";
	setTimeModal.style.top = "200px";
	setTimeModal.style.left = "400px";
	setTimeModal.style.zIndex = "9000000000000000004";
	setTimeModal.frameBorder = "none";
	setTimeModal.style.transition = "0.5s";
	setTimeModal.style.opacity = "0.95";
	setTimeModal.src = chrome.extension.getURL("setTimeForm.html");
	document.body.appendChild(setTimeModal);
}

function toggleBrowserAction() {
	/*Toggles browserAction on or off*/
	chrome.runtime.sendMessage({task:"getCurrentTabUrl"}, function(response) {
		//console.log(response.activeTabUrl);
		let patt = new RegExp("https://www.youtube.com/watch");
	    if(!patt.test(response.activeTabUrl))
	    	chrome.runtime.sendMessage({task:"disableBrowserAction"});    	
	    else 
	    	chrome.runtime.sendMessage({task:"enableBrowserAction"});
	});
}

function repeatVideo(timeData = {}) {
	let vid = document.getElementsByTagName('video');
	let startTime = 0, endTime = vid[0].duration - 0.03;
	if(Object.keys(timeData).length) {
		startTime = timeData.startTime;
		endTime = timeData.endTime;
	}
	intervalId = setInterval(function() {
		checkVideo(startTime, endTime, vid);
	}, 300);
}

function checkVideo(startTime, endTime, vid) {
	if(vid[0].currentTime < startTime)
		vid[0].currentTime = startTime;
	else if(vid[0].currentTime > endTime)
		vid[0].currentTime = startTime;
}

function stopRepeat() {
	console.log("Looping stopped!");
	clearInterval(intervalId);
}



