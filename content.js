console.log("Content JS has loaded");

/*chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	console.log(message.data);
});*/

var iframe,iframe1,div1;
var hist, playlists, starred, interval_id;

var vid = document.getElementsByTagName('video');
var url = vid[0].baseURI;
console.log(url);

chrome.runtime.onMessage.addListener(function(msg, sender){
	console.log(msg);
    if(msg == "toggle"){
        toggle();
        console.log(url);
    }

    if(msg == "start2"){
    	console.log("clicked goyrp");
    	div1 = createModal();
    	document.body.appendChild(div1);

    	document.getElementById('closeModal').addEventListener('click', function(){
    		div1.parentNode.removeChild(div1);
    	});

    	document.getElementById('goyrp').addEventListener('click', formSubmit);

    	function formSubmit(){
    		let song = {}; //stores the current video
			let start = document.getElementById('strt-point').value;
			let stop = document.getElementById('end-point').value;
    		var vid = document.getElementsByTagName('video');
    		var vid_length = vid[0].duration;
			var vid_title = document.querySelector('h1.title').innerText;
    		
			var newPlay = { 'start': start, 'end': stop}
    		localStorage.setItem('newPlay', JSON.stringify(newPlay));
    		var new_data = {"yrp": {
				"history": hist,
				"playlists": playlists,
				"starred": starred
			}};

			div1.parentNode.removeChild(div1);
    	}
    }
});

function start(){
    alert("started");
}


function createModal(){
	var div = document.createElement('div');
	div.innerHTML = '<div style="font-size:20px;text-align:center;"><a style="float:right; cursor: pointer;" id="closeModal">X</a><br /> <label for="strt-point">Starting point</label><br> <input type="number" name="strt-point" id="strt-point" value="0"><br><br> <label for="end-point">Ending point</label><br> <input type="number" name="end-point" id="end-point" value="0"> <br><br> <button id="goyrp">Submit</button> </div>';
	div.style.zIndex = "9000000000000000005";
	div.style.position = "relative";
	div.style.background = "green";
	div.style.top = "200px";
	div.style.width = "400px";
	div.style.height = "220px";
	div.style.left = "30%";
	div.style.opacity = "0.95";

	return div;
}

function createside(){
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


createside();

function toggle(){
    if(iframe.style.width == "0px"){
        iframe.style.width="300px";
    }
    else{
        iframe.style.width="0px";
    }
}

var vid_title = document.querySelector('h1.title').innerText;
chrome.storage.local.set({count: url});
chrome.storage.local.set({title: vid_title});