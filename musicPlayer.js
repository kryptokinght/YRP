/*
The player is only for repeating songs, saving them in localStorage or navigating
through playlists and history and starred.
For playing and pausing songs, use the default youtube buttons for play and pause.
There are 2 player states:
1.(not saved state) This state is for videos that are not in local storage. If the
	video currently in webpage is not in localStorage, this player is loaded. It
	gives you two buttons: repeat the video with default time or setTime and repeat.
	Only the video thumbnail and its title is shown. When any one of the buttons is
	clicked, player state 2 is loaded.
	CONTAINS buttons repeat and setTime.
2. (saved state) This state is for videos that already present in localStorage. 
*/

console.log("musicPlayer.js has loaded!!");

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

/*
Listener to load a particular state of the music player(state1 or state2).
The message will contain 
message = {
	task: "setPlayerState",
	data: {//information about the video},
	state: 1 or 2
}
*/
//chrome.runtime.onMessage.addEventListener(function())----------



/*--------------LISTENERS for buttons in playerState1----------------------------*/
// sets listener to openModal button for click action
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("openTimeModal").addEventListener("click", popupModal);
  document.getElementById("repeat").addEventListener("click", repeatVideo);
});

/************message listeners for videoData and videoDataSave**********/
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	if(message.task == 'videoData'){
		console.log("Video data received from <content.js>");
		initializePlayer(message.video_detail, message.playerState);
		
		/*console.log(message.video_detail.starred);
		console.log(message.video_detail.url);
		console.log(message.video_detail.title);
		console.log(message.video_detail.playIcon);
		console.log(message.video_detail.startTime);
		console.log(message.video_detail.endTime);*/
	}
	else if(message.task == 'videoDataSave'){
		console.log("Video data save LS received from <content.js>");
		chrome.runtime.sendMessage({task:"check", ps:message.playerState}, function(response) {
			console.log(response); //save data here into localStorage
			return true;
		});
	}
});

//load the music player with initial data(a roundabout process (**given below)
chrome.runtime.sendMessage({task:"getPlayerTabId"}, function(response) {
	chrome.tabs.sendMessage(response.playerTabId, {task:"initializeMusicPlayer"});
});

/*-----------------function definitions------------------*/
function popupModal() {
	/*Opens setTimeForm.html*/
	//console.log("openTimeModal button clicked!");
	//get the player.tab_id and send 'setTimeModal' message to content.js
	chrome.runtime.sendMessage({task:"getPlayerTabId"}, function(response) {
		chrome.tabs.sendMessage(response.playerTabId, {task: "setTimeModal"})
		return true;
	});
}

function repeatVideo() {
	chrome.runtime.sendMessage({task:"getPlayerTabId"}, function(response) {
		chrome.tabs.sendMessage(response.playerTabId, {task: "repeatVideo"})
		return true;
	});
}

function initializePlayer(videoData, playerState) {
	if(playerState == 1) {
		/*Check whether state of player is 1 or 2. if 2 convert to 1*/
		let title = document.getElementById("vid_title");	
		let image = document.getElementById("vid_img");
		image.src = videoData.playIcon;
		title.innerHTML = videoData.title;
	}
	else if(playerState == 2) {

	}
}

/*

var url = data.count;
console.log(url);

console.log(src1);
var img1 = document.getElementById("mimg");
img1.src = src1;
*/

/*
**roundabout process in the sense that message is sent to content.js which
sends a message back with the videoData to musicPlayer.js and then the player is
initialized
*/

