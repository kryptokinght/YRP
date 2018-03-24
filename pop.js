/*var clse = document.getElementById("clse");
clse.addEventListener("click", function(){

});*/

function myFunction() {
    var getframe = document.getElementById("frame");
    getframe.innerHTML = '';
}
function delFrame() {
    var getframe = document.getElementById("frame");
    getframe.remove();
}
function hideFrame() {
    var getframe = document.getElementById("frame");
    getframe.style.display = 'none';
}
function showFrame() {
    var getframe = document.getElementById("frame");
	getframe.style.display = 'block';
}
window.onload = function() {
    myFunction();
}