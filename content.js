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

1. This includes listening for 3 tasks: loadPlayer(), stopPlayer(), togglePlayer()
2. The current tab can be updated(song changed) without the content script changing.
   The tab update feature is implemented in background. In content we add a listener
   which listens for playerTabUpdated message from background. It performs the task
   of refreshPlayer(). The listener will be "playerTabUpdated"
3. When a page is refreshed the content script also reloads. We need to load the
   music player if the active tab player is refreshed. Therefore, in the beginning 
   of the content.js we send a message to background asking for the player_state_active
   info. If true, loadPlayer(). We don't care about the false condition.
SO 1 and 2 are listeners while 3 is a check condition.
We need to implement 4 functions loadPlayer(), stopPlayer(), togglePlayer(), 
refreshPlayer().
And we need to implement 4 listeners for 1. and 2. and a check condition for 3. which
also contains a listener.	
*/

console.log("YRP Content JS has loaded");


var iframe,iframe1,div1;
var hist, playlists, starred, interval_id;


/*
	1. and 2.
	All the 4 listeners for 1. and 2. implemented here.
*/
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if(message.task == "playerTabUpdated") {
		console.log("player tab update refreshplayer() called")
		refreshPlayer();
	}
	else if(message.task == "loadPlayer") {
		loadPlayer();
	}
	else if(message.task == "togglePlayer") {
		togglePlayer();
	}
	else if(message.task == "stopPlayer") {
		stopPlayer();
	}
});
//---------------------------------------------------------------------------


/*
	3.
	Get the player_active_state info for page refresh condition
	if True, loadPlayer().
*/
chrome.runtime.sendMessage({task: "getPlayerState"}, function(response) {
	console.log("Checking for refresh!!");
	console.log(response.playerState);
	if(response.playerState) {
		console.log("page refreshed loadPlayer() called")
		loadPlayer();
	}
});
//---------------------------------------------------------------------------



//****************Unknown variable declaration*********************
var vid = document.getElementsByTagName('video'); //in
var url = vid[0].baseURI; //in
console.log(url); //in



//listens for message from background if browserAction clicked
/*chrome.runtime.onMessage.addListener(function(msg, sender){ //in
	console.log("Message browser action:");
	console.log(msg);
    if(msg.task == "toggle"){
        toggle();
        console.log(url);
    }
	if(msg == "start2"){
    	console.log("clicked goyrp");
    	div1 = createModal();
    	document.body.appendChild(div1);

    	document.getElementById('goyrp').addEventListener('click', formSubmit);

    	function formSubmit(){
    		let song = {}; //stores the current video
			let start = document.getElementById('strt-point').value;
			let stop = document.getElementById('end-point').value;
    		var vid = document.getElementsByTagName('video');
    		var vid_length = vid[0].duration;
			var vid_title = document.querySelector('h1.title').innerText;
    		
			var newPlay = { 'start': start, 'end': stop}
    		localStorage.setItem('newPlay', JSON.stringify(newPlay));

    		var new_data = {"yrp": {
				"history": hist,
				"playlists": playlists,
				"starred": starred
			}};

			div1.parentNode.removeChild(div1);
    	}
    }
});
*/


function createModal(){
	var div = document.createElement('div');
	div.innerHTML = '<div style="font-size:20px;text-align:center;"> <label for="strt-point">Starting point</label><br> <input type="number" name="strt-point" id="strt-point" value="0"><br><br> <label for="end-point">Ending point</label><br> <input type="number" name="end-point" id="end-point" value="0"> <br><br> <button id="goyrp">Submit</button> </div>';
	div.style.zIndex = "9000000000000000005";
	div.style.position = "relative";
	div.style.background = "green";
	div.style.top = "200px";
	div.style.width = "500px";
	div.style.height = "200px";
	div.style.left = "30%";
	div.style.opacity = "0.95";

	return div;
}

//shows the music player in the right side of window
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
	iframe.src = chrome.extension.getURL("popup.html");

	document.body.appendChild(iframe);	
}

createMusicPlayer();


function toggle() {
    if(iframe.style.width == "0px"){
        iframe.style.width="300px";
    }
    else{
        iframe.style.width="0px";
    }
}

//stores the current URL in localStorage to show in recently playing
chrome.storage.local.set({count: url}); //in

function loadPlayer() {
	console.log("loadPlayer called!");
}
function stopPlayer() {
	console.log("stopPlayer called!");
}
function togglePlayer() {
	console.log("togglePlayer called!");
}
function refreshPlayer() {
	console.log("refreshPlayer called!");
}
