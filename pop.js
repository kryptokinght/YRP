//Function to submit the modal with values
function modalSubmit() {
	console.log("Clicked button to open modal");
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){ 
    	console.log("Opening Modal");
    	chrome.tabs.sendMessage(tabs[0].id, {task: "submitModal"});
   });
}

//function to simply just close the modal
function modalClose() {
	console.log("Clicked button to close modal");
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){ 
    	console.log("Closing Modal");
    	chrome.tabs.sendMessage(tabs[0].id, {task: "closeModal"});
   });
}

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("submitModal").addEventListener("click", modalSubmit);
  document.getElementById("closeModal").addEventListener("click", modalClose);
});