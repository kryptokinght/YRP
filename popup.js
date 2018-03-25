// Send message to content scripts to open the modal
// on clicking the button
function popup2() {
	console.log("Clicked your button");
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){ 
    	console.log("Reached");
    	chrome.tabs.sendMessage(tabs[0].id, {task: "setTimeForm"});
   });
}

// added a listener to the button to send a message to content scripts
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("myBtn2").addEventListener("click", popup2);
});

//local storage
chrome.storage.local.get("count", function(data) {
    var url = data.count;
	console.log(url);
	var videoid = data.count.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
	if(videoid != null) {
		console.log("video id = ",videoid[1]);
	} else { 
	    console.log("The youtube url is not valid.");
	}
	var src1 ="https://i1.ytimg.com/vi/"+videoid[1]+"/default.jpg";
	console.log(src1);
	var img1 = document.getElementById("mimg");
	img1.src = src1;
});

chrome.storage.local.get("title", function(data){
	var txt = data.title;
	console.log("The "+ txt);
	var title1 = document.getElementById("txt");
	title1.textContent = txt;
});