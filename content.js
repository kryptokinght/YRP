console.log("Content JS has loaded");

/*chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	console.log(message.data);
});*/


chrome.runtime.onMessage.addListener(function(msg, sender){
	console.log(msg);
    if(msg == "toggle"){
        toggle();
    }
});

var iframe,iframe1;

function createside(){
	iframe = document.createElement('iframe'); 
	iframe.style.background = "green";
	iframe.style.height = "100%";
	iframe.style.width = "0px";
	iframe.style.position = "fixed";
	iframe.style.top = "0px";
	iframe.style.right = "0px";
	iframe.style.zIndex = "9000000000000000000";
	iframe.frameBorder = "none";
	iframe.style.transition = "0.5s";
	iframe.style.opacity = "0.8";
	iframe.src = chrome.extension.getURL("popup.html");

	document.body.appendChild(iframe);	
}

function createframe(){
	iframe = document.createElement('iframe'); 
	iframe.style.background = "green";
	iframe.style.height = "100%";
	iframe.style.width = "0px";
	iframe.style.position = "fixed";
	iframe.style.top = "0px";
	iframe.style.right = "0px";
	iframe.style.zIndex = "9000000000000000000";
	iframe.frameBorder = "none";
	iframe.style.transition = "0.5s";
	iframe.style.opacity = "0.8";
	iframe.src = chrome.extension.getURL("popup.html")

	document.body.appendChild(iframe);	
}

createside();

function toggle(){
    if(iframe.style.width == "0px"){
        iframe.style.width="400px";
    }
    else{
        iframe.style.width="0px";
    }
}