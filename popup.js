
function popup2() {
	console.log("Clicked your button");
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){ 
    	chrome.tabs.sendMessage(tabs[0].id, "start2");
   });
}


document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("myBtn2").addEventListener("click", popup2);
});

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
	console.log(data.clse.id);
});