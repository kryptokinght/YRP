/*document.getElementById("myBtn").addEventListener("click", function(){
	alert("Hii")
});*/
 
function popup() {
	console.log("Clicked your button");
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
    chrome.tabs.sendMessage(tabs[0].id, "start");
   });
}

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("myBtn").addEventListener("click", popup);
});