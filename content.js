/*
Whenever a youtube tab is loaded, content is loaded. It creates the player template
but is not active. Now when the browserAction is clicked, the music player becomes
active(playerState = true), player_tab_id is modified. The video in the webpage is
read and loaded in the player...... BUT, if the music player is already active in 
another tab, the music player in the previous tab is closed and the player in the
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

var video_detail = {
	url: "",
	repeats: 0,
	title: "",
	playlist: "",
	starred: false,
	startTime: 0,
	endTime: 0
};


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if(message.task == "initializeMusicPlayer") {
		console.log("Initialzing music player");
		initializeMusicPlayer();
	}
	return true;
});


/*
	1. and 2.
	All the 4 listeners for 1. and 2. implemented here.
*/
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if(message.task == "playerTabUpdated") {
		console.log("player tab update refreshplayer() called");
		refreshPlayer();
	}
	else if(message.task == "loadPlayer") {
		console.log('Created Music Player');
		loadPlayer();
	}
	else if(message.task == "togglePlayer") {
		togglePlayer();
	}
	else if(message.task == "closePlayer") {
		closePlayer();
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
	console.log("Checking for refresh!!");
	console.log(response);	
	if(response.refreshState) {
		console.log("page refreshed loadPlayer() called")
		loadPlayer();
	}
	else {
		console.log("Music player already active in another tab or this tab");
		console.log("Click on browserAction to activate here");
	}
});
//---------------------------------------------------------------------------

//************Listeners for controlling the setTime modal********************
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if(message.task == "setTimeModal"){   	
    	createTimeModal();
    }
    else if(message.task == 'submitTimeModal'){ //when submit button is clicked

    	console.log("Submitted Modal, Waiting to send video data to musicPlayer.js");
    	initializeMusicPlayer(true);
    	setTimeModal.parentNode.removeChild(setTimeModal);

    }
    else if(message.task == 'closeTimeModal'){ //when close button is clicked
    	console.log("Closing the time modal");
    	setTimeModal.parentNode.removeChild(setTimeModal);
    }
});


//*****************function definitions*********************


function removeMusicPlayer() {
	let temp_iframe = document.getElementById('yrp111'); 
	temp_iframe.parentNode.removeChild(temp_iframe);
}

function loadPlayer() { //not working properly
	console.log("loadPlayer called!");
	createMusicPlayer();
	//check wether video in local storage or not and initialize the player
	toggle();
}

function closePlayer() { //complete
	console.log("closePlayer called!");
	removeMusicPlayer();
}

function togglePlayer() { //complete
	console.log("togglePlayer called!");
	toggle();
}

function refreshPlayer() {
	console.log("refreshPlayer called!");
	toggle(true); //force open music player
	//open player(toggle to open)
	initializeMusicPlayer(true);
}

function toggle(forceOpen = false) {
	//toggles the music player iframe, opens and closes it.
	if(forceOpen) {
		iframe.style.width="300px";
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
	let srcImage ="https://i1.ytimg.com/vi/"+videoid[1]+"/default.jpg";

	let video_detail = {
		url: vid[0].baseURI,
		repeats: 0,
		title: title,
		playlist: "",
		playIcon: srcImage,
		starred: false,
		startTime: 0,
		endTime: vid[0].duration - 0.03
	};

	return video_detail;
}

function initializeMusicPlayer(save = false) {
	/*
	> scrapes video off page and stores in video_detail
	> checks wether video present in local storage and changes playerState to 1 or 2
	> sends message to musicPlayer.js to initialize the player containing video_detail
	  and playerState  
	*/
	let video_detail = getVideoData(); 
	//console.log(video_detail);
	chrome.runtime.sendMessage({task: "searchUrlInStorage", url: video_detail.url}, function(response) {
		console.log(response);
		if(response.playerState == 2) {
			console.log(2222222222222222);
			chrome.runtime.sendMessage({
				task: "videoData", 
				video_detail,
				playerState: 2
			}, function(response){
				console.log("Video information sent to musicPlayer.js");
			});		
		}
		else {
			console.log(1111111111);
			//send videoData as it is
			console.log("State 1");
			chrome.runtime.sendMessage({
				task: "videoData", 
				video_detail, 
				playerState: 1
			}, function(response){
				console.log("Video information sent to musicPlayer.js");
			});	
		}

		return true;
	});
}

//creates the music player in the right side of window
function createMusicPlayer() {
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



