[1mdiff --git a/content.js b/content.js[m
[1mindex 12b5f46..52160ad 100644[m
[1m--- a/content.js[m
[1m+++ b/content.js[m
[36m@@ -53,6 +53,7 @@[m [mchrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {[m
 		refreshPlayer();[m
 	}[m
 	else if(message.task == "loadPlayer") {[m
[32m+[m		[32mconsole.log('Created Music Player');[m
 		loadPlayer();[m
 	}[m
 	else if(message.task == "togglePlayer") {[m
[36m@@ -94,6 +95,7 @@[m [mchrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {[m
     }[m
     else if(message.task == 'submitTimeModal'){ //when submit button is clicked[m
     	console.log("Submitted Modal and send video data to musicPlayer.js");[m
[32m+[m
     	initializeMusicPlayer();[m
     	setTimeModal.parentNode.removeChild(setTimeModal);[m
 [m
[36m@@ -177,14 +179,15 @@[m [mfunction initializeMusicPlayer() {[m
 	> sends message to musicPlayer.js to initialize the player containing video_detail[m
 	  and playerState  [m
 	*/[m
[31m-	let video_detail = getVideoData(); [m
[32m+[m	[32mlet video_detail = getVideoData();[m
[32m+[m	[32mconsole.log(video_detail);[m
 	chrome.runtime.sendMessage({task: "searchUrlInStorage", url: video_detail.url}, function(response) {[m
 		if(response.playerState == 2) {[m
 			//do something with the videoData--*/-*/*/-*/-*/-*/-*/-*/-*/-*/[m
 [m
 			chrome.runtime.sendMessage({[m
 				task: "videoData", [m
[31m-				video_detail, [m
[32m+[m				[32mvideo_detail,[m
 				playerState: 2[m
 			}, function(response){[m
 				console.log("Video information sent to musicPlayer.js")[m
[36m@@ -192,6 +195,7 @@[m [mfunction initializeMusicPlayer() {[m
 		}[m
 		else {[m
 			//send videoData as it is[m
[32m+[m			[32mconsole.log("State 1");[m
 			chrome.runtime.sendMessage({[m
 				task: "videoData", [m
 				video_detail, [m
[1mdiff --git a/musicPlayer.js b/musicPlayer.js[m
[1mindex e12e2f6..d606ca9 100644[m
[1m--- a/musicPlayer.js[m
[1m+++ b/musicPlayer.js[m
[36m@@ -67,7 +67,7 @@[m [mfunction popupModal() {[m
 }[m
 [m
 chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){[m
[31m-	if(message.task == 'submittedForm'){[m
[32m+[m	[32m/*if(message.task == 'submittedForm'){[m
 		console.log("Video data received from <content.js>");[m
 [m
 		console.log(message.video_detail.starred);[m
[36m@@ -77,4 +77,27 @@[m [mchrome.runtime.onMessage.addListener(function(message, sender, sendResponse){[m
 		console.log(message.video_detail.startTime);[m
 		console.log(message.video_detail.endTime);[m
 	}[m
[32m+[m
[32m+[m	[32m/*[m
[32m+[m		[32mRender Music Player with either of two states:[m
[32m+[m		[32m1. If it is not found in the local storage then load state 1[m
[32m+[m		[32m2. If it is found in the local storage then load state 2[m
[32m+[m	[32m*/[m
[32m+[m	[32mif(message.task == 'videoData'){[m
[32m+[m
[32m+[m		[32mconsole.log("Response state");[m
[32m+[m		[32m//Render state 1[m
[32m+[m		[32mif(message.playerState == 1){[m
[32m+[m
[32m+[m			[32mconsole.log("Response state 1");[m
[32m+[m			[32mvar titleIcon = document.getElementById('mimg');[m
[32m+[m			[32mtitleIcon.src = video_detail.playIcon;[m
[32m+[m
[32m+[m		[32m}[m
[32m+[m
[32m+[m		[32m//Render state 2[m
[32m+[m		[32melse if(message.playerState == 2){[m
[32m+[m
[32m+[m		[32m}[m
[32m+[m	[32m}[m
 });[m
\ No newline at end of file[m
