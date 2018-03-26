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


var iframe,iframe1,div1,oframe;
var hist, playlists, starred, interval_id;
var toggleState = false;


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
	else if(message.task == "closePlayer") {
		closePlayer();
	}
	else if(message.task == "setTimeForm"){
    	
    	oframe = createModal();
    	document.body.appendChild(oframe);
    	
    }
    else if(message.task == 'submitModal'){
    	
    	console.log("Subitted Modal");
    	//Local Storage functions
    	
    	oframe.parentNode.removeChild(oframe);

    }
    else if(message.task == 'closeModal'){
    	console.log("Closing the Modal");
    	oframe.parentNode.removeChild(oframe);
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
});
*/

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

function createModal(){
	iframe1 = document.createElement('iframe');
	iframe1.style.height = "250px";
	iframe1.style.width = "400px";
	iframe1.style.position = "fixed";
	iframe1.style.top = "200px";
	iframe1.style.left = "400px";
	iframe1.style.zIndex = "9000000000000000004";
	iframe1.frameBorder = "none";
	iframe1.style.transition = "0.5s";
	iframe1.style.opacity = "0.95";
	iframe1.src = chrome.extension.getURL("pop.html");

	return iframe1;
}

function removeMusicPlayer() {
	var temp_iframe = document.getElementById('yrp111'); 
	temp_iframe.parentNode.removeChild(temp_iframe);
}

createMusicPlayer();

function toggle() {
    if(iframe.style.width == "0px"){
        iframe.style.width="300px";
        toggleState = true;
    }
    else{
        iframe.style.width="0px";
        toggleState = false;
    }
}


/*var vid_title = document.querySelector('h1.title').innerText;
chrome.storage.local.set({count: url});
chrome.storage.local.set({title: vid_title});*/
//stores the current URL in localStorage to show in recently playing
chrome.storage.local.set({count: url}); //in

function loadPlayer() {
	console.log("loadPlayer called!");
	createMusicPlayer(); //creates the template
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
}
function createTimeForm() {
	console.log("clicked goyrp");
	div1 = createModal();
	document.body.appendChild(div1);

	document.getElementById('closeModal').addEventListener('click', function(){
		div1.parentNode.removeChild(div1);
	});

	document.getElementById('goyrp').addEventListener('click', formSubmit);
}
function initializeMusicPlayer() {
	/*
	Initializes the music player with the song in the webpage
	Does not play the sond, in a paused state
	*/

}