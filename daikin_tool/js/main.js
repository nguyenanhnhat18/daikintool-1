 /*==================================================================
    [ Validate ]*/
    // Active Control Left
console.log(123);
$('.pane-nav__item').click(function() {
    var dataType = $(this).attr('data-type');
    $('.pane-nav__item').removeClass('is-selected');
    $('.pane-affix').removeClass('is-active');
    $('#'+dataType).addClass('is-active');
    $(this).addClass('is-selected');
});
$('.js-pane-affix-close').click(function() {
    $('.pane-affix').removeClass('is-active');
});
var HideControls = {
    'tl':true,
    'tr':false,
    'bl':false,
    'br':true,
    'ml':false,
    'mt':false,
    'mr':false,
    'mb':false,
    'mtr':true
};
// var canvasEl = $('#wrapCanvas');

// // get 2d context to draw on (the "bitmap" mentioned earlier)
// var ctx = canvasEl.getContext('2d');

// // set fill color of context
// ctx.fillStyle = 'red';

// // create rectangle at a 100,100 point, with 20x20 dimensions
// ctx.fillRect(100, 100, 20, 20);
// debugger;
// create a wrapper around native canvas element (with id="c")

var canvas = new fabric.Canvas('c');

// create a rectangle object
// var rect = new fabric.Rect({
//     left: 100,
//     top: 100,
//     fill: 'red',
//     width: 20,
//     height: 20
// });
// "add" rectangle onto canvas

// canvas.add(rect);

// add component
let a = 1
function addImg(ele){
    //limit click time function
    let disabled = ()=>{
        $(ele).removeAttr("onclick");
    }
    // 2 times
    a % 2 === 0 ? disabled() : console.log("check");
    a++
    console.log(a)
    //end limit click time function
    
    fabric.Image.fromURL(ele.src, (oImg)=> {
        let l = 150;
        let t = 150;
        oImg.scale(0.2);
        oImg.set({'left':l});
        oImg.set({'top':t});
        oImg.set({"transparentCorners" :false});
        oImg.set({"centeredScaling" :true});
        oImg.setControlsVisibility(HideControls);
        canvas.add(oImg);
    });
};

// add layout

//add floor plan function
function setBgImage(ele){
    let img = ele;
    let sizeOfcanvasBg = [img.naturalWidth, img.naturalHeight];
    canvas.setDimensions({width : sizeOfcanvasBg[0], height : sizeOfcanvasBg[1]});
    canvas.setBackgroundImage(img.src, canvas.renderAll.bind(canvas), {
        // Needed to position backgroundImage at 0/0
        originX: 'left',
        originY: 'top'
    });

    //set zoom in and zoom out value at "0.15"
    let val = 1;
    val = (val*10 +  0.15*10)/10;
    //start button zoom in and zoom out function
    
    
    $("#zoomIn").click(()=>{
        sizeOfcanvasBg = [Math.round(sizeOfcanvasBg[0] * val), Math.round(sizeOfcanvasBg[1] * val)];
        canvas.setDimensions({width : sizeOfcanvasBg[0], height : sizeOfcanvasBg[1]});
        canvas.setBackgroundImage(img.src, canvas.renderAll.bind(canvas), {
            scaleX: canvas.width / img.naturalWidth,
            scaleY: canvas.height / img.naturalHeight
        });
    })
    
    $("#zoomOut").click(()=>{
        sizeOfcanvasBg = [Math.round(sizeOfcanvasBg[0] / val), Math.round(sizeOfcanvasBg[1] / val)];
              
        canvas.setDimensions({width : sizeOfcanvasBg[0], height : sizeOfcanvasBg[1]});
        canvas.setBackgroundImage(img.src, canvas.renderAll.bind(canvas), {
            scaleX: canvas.width / img.naturalWidth,
            scaleY: canvas.height / img.naturalHeight
        });
    })
    //end button zoom in and zoom out function
    $(".canvas-container")[0].style.margin = "auto";
}

function addDeleteBtn(x, y){
    $(".deleteBtn").remove(); 
    var btnLeft = x-10;
    var btnTop = y-10;
    var deleteBtn = '<img src="icon/close-img.png" class="deleteBtn" style="position:absolute;top:'+btnTop+'px;left:'+btnLeft+'px;cursor:pointer;width:20px;height:20px;"/>';
    $(".canvas-container").append(deleteBtn);
}
canvas.on('object:selected',(e)=>{
    addDeleteBtn(e.target.oCoords.tr.x, e.target.oCoords.tr.y);
});
canvas.on('mouse:down',(e)=>{
    if(!canvas.getActiveObject())
    {
        $(".deleteBtn").remove(); 
    }
});
canvas.on('object:modified',(e)=>{
    addDeleteBtn(e.target.oCoords.tr.x, e.target.oCoords.tr.y);
});
canvas.on('object:scaling',(e)=>{
    $(".deleteBtn").remove(); 
});
canvas.on('object:moving',(e)=>{
    $(".deleteBtn").remove(); 
});
canvas.on('object:rotating',(e)=>{
    $(".deleteBtn").remove(); 
});
$(document).on('click',".deleteBtn",()=>{
    if(canvas.getActiveObject()){
        canvas.remove(canvas.getActiveObject());
        $(".deleteBtn").remove();
    }
});

// canvas moving limit   
canvas.on('object:moving', (e)=>{
    var obj = e.target;
    // if object is too big ignore
    if(obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width){
      return;
    }
    obj.setCoords();
    // top-left  corner
    if(obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0){
        obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
        obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left);
    }
    // bot-right corner
    if(obj.getBoundingRect().top+obj.getBoundingRect().height  > obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width  > obj.canvas.width){
      obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
      obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
    }
  });
// end canvas moving limit

function renderIcon(icon) {
    return function renderIcon(ctx, left, top, styleOverride, fabricObject) {
    var size = this.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(icon, -size/2, -size/2, size, size);
    ctx.restore();
    }
}
canvas.renderAll();