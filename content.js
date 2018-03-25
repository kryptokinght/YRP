console.log("YRP Content JS has loaded");

//ask background for player state
chrome.runtime.sendMessage({task: "getPlayerState"}, function(response) {
	console.log(response);
});

var iframe,iframe1,div1;
var hist, playlists, starred, interval_id;

var vid = document.getElementsByTagName('video');
var url = vid[0].baseURI;
console.log(url);

chrome.runtime.onMessage.addListener(function(msg, sender){
	console.log(msg);
    if(msg.task == "toggle"){
        toggle();
        console.log(url);
    }
    /*if(msg == "start"){
    	console.log("Hello clicked yours");
    	creatediv();
    	console.log(url);
    	//start();
    }*/

    if(msg == "start2"){
    	console.log("clicked goyrp");
    	div1 = createModal();
    	document.body.appendChild(div1);

    	document.getElementById('goyrp').addEventListener('click', formSubmit);

    	function formSubmit(){
    		let song = {}; //stores the current video
			let start = document.getElementById('strt-point').value;
			let stop = document.getElementById('end-point').value;
    		var vid = document.getElementsByTagName('video');
    		var vid_length = vid[0].duration;
			var vid_title = document.querySelector('h1.title').innerText;
    		//div1.style.display = "none";
    		//storing value in local-storage
    		/*localStorage.setItem("start", start);
    		localStorage.setItem("end", stop);*/
    		
			var newPlay = { 'start': start, 'end': stop}
    		localStorage.setItem('newPlay', JSON.stringify(newPlay));
    		/*var retrievedObject = localStorage.getItem('testObject');
			console.log('retrievedObject: ', JSON.parse(retrievedObject));*/
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
	div.innerHTML = '<div style="font-size:20px;text-align:center;"> <label for="strt-point">Starting point</label><br> <input type="number" name="strt-point" id="strt-point" value="0"><br><br> <label for="end-point">Ending point</label><br> <input type="number" name="end-point" id="end-point" value="0"> <br><br> <button id="goyrp">Submit</button> </div>';
	div.style.zIndex = "9000000000000000005";
	div.style.position = "relative";
	div.style.background = "green";
	div.style.top = "200px";
	div.style.width = "500px";
	div.style.height = "200px";
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

/*function creatediv(){
	iframe1 = document.createElement('iframe');
	iframe1.style.background = "red";
	iframe1.style.height = "200px";
	iframe1.style.top = "50%";
	iframe1.style.left = "50%";
	iframe1.style.bottom = "50%";
	iframe1.style.right = "50%";
	iframe1.style.marginTop = "-50px";
	iframe1.style.marginBottom = "-50px";
	iframe1.style.marginLeft = "-50px";
	iframe1.style.marginRight = "-50px";
	//iframe1..style.margin = "50px 10px 20px 30px";
	iframe1.style.width = "200px";
	iframe1.style.display = "block";
	iframe1.style.position = "fixed";
	iframe.style.transition = "0.5s";
	iframe1.style.zIndex = "9000000000000000004";
	iframe1.frameBorder = "none";
	iframe1.src = chrome.extension.getURL("pop.html");

	document.body.appendChild(iframe1);	
}*/

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

/*chrome.runtime.sendMessage({data: "Fuck You"}, function(){
	console.log("Message has been sent");
});*/

var clse = document.getElementById('clse');
chrome.storage.local.set({count: url, clse: clse});