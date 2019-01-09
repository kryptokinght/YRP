# Youtube Repeat Player

⚠️ The code above is sphagetti code....it will be refractored once again to conform with the OOP standards 😊.

## Running the extension
* Add the extension to your Chrome Browser by enabling **developer mode**
* Click on *Load Unpacked* button and select the Youtube-repeat-player folder that you cloned from this repo.
* Refresh the Youtube page(if already opened) and click on the browser-action button(Y) on Top.

## Development

### When using react CDN links
![project structure](/screenshots/react_1.png)
**App.js**
![app.js](/screenshots/app_js.png)
**index.js**
![index.js](/screenshots/index_js.png)

*Run using pyhton local server: `python -m SimpleHTTPServer 9000`*

**REASON**:Opening the page locally (ie not on a server) and trying load a file alongside remote files (file:// Vs https://), causes the error message **`Cross origin requests are only supported for protocol schemes: http, data, chrome, chrome-extension, https`**. Chrome is seeing that you’re trying to load a local file (app.js) alongside remote files and blocking loading, it’s the browser security kicking in.

You can get around this by running it on a server - there are various ways to do this. Possibly easiest way, especially if you are on a Mac/Linux where it will be available without any installing, is to use Python’s SimpleHTTPServer - http://www.linuxjournal.com/content/tech-tip-really-simple-http-server-python 34. You run the command in the folder with your code in, and it starts a server up from that folder. This works for me when I run it.




### Run a simple HTTP server

`$ python -m SimpleHTTPServer 9000`

### Webpack-React-Babel Config setup

https://www.valentinog.com/blog/react-webpack-babel/
