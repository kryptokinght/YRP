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

Get URL of webpage from 
Identify the video in the webpage, get title, thumbnail, 
*/

console.log("musicPlayer.js has loaded!!");

var video_detail = {
	url: "",
	repeats: 0,
	title: "",
	playlist: "",
	starred: false,
	startTime: 0,
	endTime: 0
};


/*
//scrap the video element from webpage
var vid = document.getElementsByTagName('video');
var vid_length = vid[0].duration;


video_detail.url = 
video_detail.title = document.querySelector('h1.title').innerText;*/


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


// sets listener to openModal button for click action
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("openModal").addEventListener("click", popupModal);
});

function popupModal() {
	/*Opens setTimeForm.html*/
	console.log("openTimeModal button clicked!");
	//get the player.tab_id and send 'setTimeModal' message to content.js
	chrome.runtime.sendMessage({task:"getPlayerTabId"}, function(response) {
		chrome.tabs.sendMessage(response.playerTabId, {task: "setTimeModal"})
		return true;
	});
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){

	/*
		Renders the music player with either of the two states
	*/
	if(message.task == 'videoData'){
		console.log("Video data received from <content.js>");
		chrome.runtime.sendMessage({task:"check", ps:message.playerState}, function(response) {
			console.log(response);
			return true;
		});
		console.log(message.video_detail.starred);
		console.log(message.video_detail.url);
		console.log(message.playerState);
		console.log(message.video_detail.title);
		console.log(message.video_detail.playIcon);
		console.log(message.video_detail.startTime);
		console.log(message.video_detail.endTime);

		//Render the basic music Player
		if (message.playerState == 1) {
			console.log("yes you are here");
			document.getElementById('mimg').src = message.video_detail.playIcon;
			document.getElementById('txt').innerText = message.video_detail.title;
		}

		//Render the music Player stored in localStorage
		else if (message.playerState == 2){

		}
	}
});


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	if(message.task == 'videoDataSave'){
		console.log("Video data save LS received from <content.js>");
		chrome.runtime.sendMessage({task:"check", ps:message.playerState}, function(response) {
			console.log(response);
			return true;
		});
	}
});


console.log("calling");
chrome.runtime.sendMessage({task:"getPlayerTabId"}, function(response) {
	chrome.tabs.sendMessage(response.playerTabId, {task:"initializeMusicPlayer"});
});