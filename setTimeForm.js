console.log("setTimeForm.js has loaded!!");

//Event Listeners for buttons in setTimeForm template
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("submitModal").addEventListener("click", submitModal);
  document.getElementById("closeModal").addEventListener("click", closeModal);
});


//***********function definitions****************
function submitModal() {
/*function to submit the modal with values*/
  console.log("Clicked button to open modal");
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){ 

    	//console.log("Opening Modal");
      var start = document.getElementById('start-time').value;
      var end = document.getElementById('end-time').value;
      var timeData = {
        startTime: start,
        endTime: end
      }
    	chrome.tabs.sendMessage(tabs[0].id, {task: "submitTimeModal", timeData});
   });
}


function closeModal() {
/*function to simply just close the modal*/
  console.log("Clicked button to close modal");
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){ 
      //console.log("Closing Modal");
      chrome.tabs.sendMessage(tabs[0].id, {task: "closeTimeModal"});
   });
}