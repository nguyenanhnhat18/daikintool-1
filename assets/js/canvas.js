(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

var imagesOnCanvas = [];

function renderScene() {
requestAnimationFrame(renderScene);
var toolBar = document.getElementById("toolbar");
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
ctx.clearRect(0,0,
    canvas.width,
    canvas.height
);
//layout image here    
var img = document.getElementsByClassName("layout")[0];
canvas.width = img.width*1.5;
canvas.height = img.height;
toolBar.height = canvas.height;
ctx.drawImage(img, 0, 0,img.width*1.5,img.height);

for(var x = 0,len = imagesOnCanvas.length; x < len; x++){
    var obj = imagesOnCanvas[x];
    obj.context.drawImage(obj.image,obj.x,obj.y,obj.width,obj.height);
}
}

requestAnimationFrame(renderScene);

window.addEventListener("load",function(){
var canvas = document.getElementById('canvas');
canvas.onmousedown = function(e) {
var downX = e.offsetX, downY = e.offsetY;

// scan images on canvas to determin if event hit an object
for(var x = 0,len = imagesOnCanvas.length; x < len; x++) {
    var obj = imagesOnCanvas[x];
    if(!isPointInRange(downX,downY,obj)){
        continue;
    }
    startMove(obj,downX,downY);
    break;
}
} 
},false);

function startMove(obj,downX,downY) {
var canvas = document.getElementById('canvas');

var origX = obj.x, origY = obj.y;
canvas.onmousemove = function(e) {
    var moveX = e.offsetX, moveY = e.offsetY;
    var diffX = moveX-downX, diffY = moveY-downY;

    obj.x = origX+diffX;
    obj.y = origY+diffY;
}

canvas.onmouseup = function() {
    // stop moving
    canvas.onmousemove = function(){};
}
}

function isPointInRange(x,y,obj){
return !(x < obj.x ||
    x > obj.x + obj.width ||
    y < obj.y ||
    y > obj.y + obj.height);
}

function allowDrop(e){
  e.preventDefault();
}

function drag(e){
  //store the position of the mouse relativly to the image position
  e.dataTransfer.setData("mouse_position_x",e.clientX - e.target.offsetLeft);
  e.dataTransfer.setData("mouse_position_y",e.clientY - e.target.offsetTop );

  e.dataTransfer.setData("image_id",e.target.id);
}

function drop(e){
  e.preventDefault();
  var image = document.getElementById(e.dataTransfer.getData("image_id"));

  var mouse_position_x = e.dataTransfer.getData("mouse_position_x");
  var mouse_position_y = e.dataTransfer.getData("mouse_position_y");

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  imagesOnCanvas.push({
    context: ctx,  
    image: image,  
    x:e.clientX - canvas.offsetLeft - mouse_position_x,
    y:e.clientY - canvas.offsetTop - mouse_position_y,
    width: image.offsetWidth,
    height: image.offsetHeight
  });
}

//Upload images code
function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function(e) {
      document.getElementsByClassName("layout")[0].setAttribute('src', e.target.result);
    }
    reader.readAsDataURL(input.files[0]);
  }
}

document.getElementById("imgInp").onchange = (function() {
  readURL(this);
});

//Download button
function convertCanvasToImage() {
  var download = document.getElementById("download");
  var image = document.getElementById("canvas").toDataURL("image/png");
  download.setAttribute("href", image);
  //download.setAttribute("download","archive.png");
}

function chooseCrawlImages(craw){
document.getElementById("layout").src = craw.src;

}

function openNav() {
  document.getElementById("mySidenav").style.width = "100%";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

//VUT-
  /**SAVE image */
function saveImage() {
  var photo = canvas.toDataURL();
  var searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has('record_id')) { 
    var record_id = searchParams.get('record_id');  
    $.ajax({
      method: "POST",
      url: 'saveFile.php',
      data: {
        photo : photo,
        record_id : record_id
      }
    }).done(function (o){
      alert('Image have saved into Server!');
    });
  }
}

function loadImage() {
  var searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has('record_id')) {
    var record_id = searchParams.get('record_id');  
    $.ajax({
      method: "POST",
      url: 'loadFile.php',
      data: {
        record_id: record_id
      },
      success: function(data) {
        if (!data) return;
        var json = $.parseJSON(data);
        $('#mySidenav').remove();
        var mysidenav = '<div id="mySidenav" class="sidenav">'+
                        '</div>';
        $('#ImagesLayOut').after(mysidenav);
        for (var i=0; i < json.length ; i++) {
          $('#mySidenav').append('<img src="'+json[i]+'" style="height: 100px;" onclick="chooseCrawlImages(this)"></img>');
        }
        debugger;
      }
    });  
  }
}
