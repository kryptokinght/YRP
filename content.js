console.log("Content JS has loaded");

/*chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	console.log(message.data);
});*/


chrome.runtime.onMessage.addListener(function(msg, sender){
	console.log(msg);
    if(msg == "toggle"){
        toggle();
    }
    if(msg == "start"){
    	console.log("Hello clicked yours");
    	creatediv();
    	start();
    }
});

function start(){
    alert("started");
}

var iframe,div;

function createside(){
	iframe = document.createElement('iframe');
	iframe.id = "yrp111";
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

function creatediv(){
	iframe = document.createElement('iframe');
	iframe.id = "yrp111";
	iframe.style.background = "red";
	iframe.style.height = "100%";
	iframe.style.width = "300px";
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

createside();
/*$('#yrp111').contents().find('button').click(function(){
	alert("click");
});*/

function toggle(){
    if(iframe.style.width == "0px"){
        iframe.style.width="300px";
    }
    else{
        iframe.style.width="0px";
    }
}