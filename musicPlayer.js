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

console.log('musicPlayer.js has loaded!!');

const video_detail = {
  url: '',
  repeats: 0,
  title: '',
  playlist: '',
  playIcon: '',
  starred: false,
  startTime: 0,
  endTime: 0
};

const player1 = document.getElementById('playerState1');

	
const player2 = document.getElementById('playerState2');
setRecentsList();
setStarredList();

/*
Listener to load a particular state of the music player(state1 or state2).
The message will contain 
message = {
	task: "setPlayerState",
	data: {//information about the video},
	state: 1 or 2
}
*/
// chrome.runtime.onMessage.addEventListener(function())----------



/* --------------LISTENERS for buttons in playerState1----------------------------*/
// sets listener to openModal button for click action
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('openTimeModal').addEventListener('click', popupModal);
  document.getElementById('openTimeModal2').addEventListener('click', popupModal);
  document.getElementById('repeat').addEventListener('click', repeatVideo);
  document.getElementById('addToPlaylist').addEventListener('click', addToPlaylist);
  document.getElementById('starred').addEventListener('click', starred);
});

/** **********message listeners for videoData and videoDataSave********* */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.task == 'videoData'){
    // console.log(message);
    console.log('Video data init received from <content.js>');
    // initializes player for both state 1 and 2
    initializePlayer(message.video_detail, message.playerState);
  }
  else if(message.task == 'videoDataSave'){
    console.log('Video data save LS received from <content.js>');
    console.log(message.video_detail);
    chrome.runtime.sendMessage({
      task: 'setLocalStorageRecents', 
      video_detail: message.video_detail
    });
    initializePlayer(message.video_detail, 2);
  }
});

// load the music player with initial data(a roundabout process (**given below)
chrome.runtime.sendMessage({task:'getPlayerTabId'}, (response) => {
  chrome.tabs.sendMessage(response.playerTabId, {task:'initializeMusicPlayer'});
});

/* -----------------function definitions------------------*/
function popupModal() {
  /* Opens setTimeForm.html */
  // console.log("openTimeModal button clicked!");
  // get the player.tab_id and send 'setTimeModal' message to content.js
  chrome.runtime.sendMessage({task:'getPlayerTabId'}, (response) => {
    chrome.tabs.sendMessage(response.playerTabId, {task: 'setTimeModal'});
  });
}

function repeatVideo() {
  chrome.runtime.sendMessage({task:'getPlayerTabId'}, (response) => {
    chrome.tabs.sendMessage(response.playerTabId, {task: 'repeatVideo'});
  });
}

function initializePlayer(videoData, playerState) {
  if(playerState == 1) {
    player1.style.display = '';
    player2.style.display = 'none';
    // console.log(videoData);
    console.log('You are in player state 1');
    const title = document.getElementById('vid_title');	
    const image = document.getElementById('vid_img');
    const repeat = document.getElementById('repeat');
    const openTimeModal = document.getElementById('openTimeModal');
    const recentsList = document.getElementById('recents-ul');
    const starredList = document.getElementById('starred-ul');
    repeat.style.marginLeft = '40px';
    openTimeModal.style.marginLeft = '30px';
    image.src = videoData.playIcon;
    title.innerHTML = videoData.title;
    setRecentsList(recentsList);
    setStarredList(starredList);
  }
  else if(playerState == 2) {
    console.log('You are in player state 2');
    player1.style.display = 'none';
    player2.style.display = '';
    const title2 = document.getElementById('vid_title2');	
    const image2 = document.getElementById('vid_img2');
    const fav = document.getElementById('starred');
    const openTimeModal2 = document.getElementById('openTimeModal2');
    const recentsList = document.getElementById('recents-ul');
    const starredList = document.getElementById('starred-ul');
    const setStar = document.getElementById('setStar');
    const addToPlaylist = document.getElementById('addToPlaylist');
    fav.style.marginLeft = '10px';
    openTimeModal2.style.marginLeft = '10px';
    addToPlaylist.style.marginLeft = '10px';
    image2.src = videoData.playIcon;
    title2.innerHTML = videoData.title;
    console.log(videoData.starred);	
    if(videoData.starred){
      setStar.src = 'icons/starred.png';
    } else {
      setStar.src = 'icons/unstarred.png';
    }
    setRecentsList(recentsList);
    setStarredList(starredList);
  }
}

function starred() {
  console.log('Starred button clicked');
  chrome.runtime.sendMessage({task:'toggleStarred'}, (response) => {
    console.log('Message sent!!');
    const setStar = document.getElementById('setStar');
    const starSrc = setStar.src;
    // console.log(starSrc);
    // console.log(response.starred);
    if(starSrc == 'chrome-extension://llojofglcglejafkilafoekhpmfedenh/icons/starred.png') { 
      // changed starred button color to golden
      // console.log("StarredYes:" + response.starred);
      setStar.src = 'icons/unstarred.png';
    }
    else {
      // change it back to normal
      // console.log("StarredNo:" + response.starred);
      setStar.src = 'icons/starred.png';
    }
  });
}

function setRecentsList(selector) {
  chrome.runtime.sendMessage({task:'getRecents'}, (response) => {
    for(let i = response.recents.length-1; i >= 0 ; i--) {
      console.log(response.recents[i].title);
      const li = document.createElement('li');
      li.setAttribute('class','item');
      li.innerHTML = `<a class='' title='${response.recents[i].title}' href='${response.recents[i].url}'>${response.recents[i].title}</a>`;
      selector.appendChild(li);
    }
  });
}

function setStarredList(selector) {
	
}

function addToPlaylist() {
  console.log('Clicked button to add to playlist');
}
