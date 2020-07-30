//  /*==================================================================
//     [ Validate ]*/
//     // Active Control Left
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

fabric.Object.prototype.setControlsVisibility({
    tl:true, //top-left
    mt:false, // middle-top
    tr:false, //top-right
    ml:false, //middle-left
    mr:false, //middle-right
    bl:false, // bottom-left
    mb:false, //middle-bottom
    br:true, //bottom-right
    mtr:true 
});

var canvas = new fabric.Canvas('c');
canvas.counter = 0;
canvas.selection = false;
let state = [];
let mods = 0;

check = false;
function on_undo(IsUndo){
    if(IsUndo === true){
        return check = true;
    }
}

let UpdateModif = (history)=>{
    if(check === true && history === true){
        mods = 0;
    } 
    if(history === true){
        canvas.includeDefaultValues = false;
        myJson = canvas.toJSON(['setcontrolsVisibility', "id", "transparentCorners", "centeredScaling"]);
        state.push(myJson);
    }
}

class Daikin {
    constructor (id, quantity, type){
        this.id = this.setID();
        this.quantity = quantity;
        this.count = quantity;
        this.type = type;
    }
    
    setID(){
        return this.id = Math.floor(Math.random() * 100);
    }
    
    _OnDel(){
        this.quantity += 1
        return this.quantity
    }
    
    _OnAdd(){
        this.quantity -= 1
        return this.quantity
    }
    
    updateQuantity(){
        this.quantity = 0;
        alert(`Limited Quantity!\nPlease Delete Components`);
    }
    
    addImg(e){
        if(this.id){
            this._OnAdd()
        }
        this.quantity < 0 ? this.updateQuantity() 
        : fabric.Image.fromURL(e.src, (oImg)=> {
            let l = 150;
            let t = 150;
            oImg.scale(0.2);
            oImg.set({"id":this.id});
            oImg.set({'left':l});
            oImg.set({'top':t});
            oImg.set({"transparentCorners" :false});
            oImg.set({"centeredScaling" :true});
            // oImg.setControlsVisibility(HideControls);
            canvas.add(oImg);
        });
        UpdateModif(true);        
    }

    checkQuantity(){
        let curr_obj = 0;
        
        if(state[state.length - 1 - mods] !== undefined){
        let current_Obj_State = state[state.length - 1 - mods].objects;
        if(current_Obj_State.length > 0){
            for(let x in current_Obj_State){
                if(this.id === current_Obj_State[x].id){
                    curr_obj++
                }
            }
        }
        this.quantity = curr_obj;
        this.quantity = this.count - this.quantity;
    }
}

    delete(){
        if(canvas.getActiveObject() && this.id === canvas.getActiveObject().id){
            this._OnDel();
            canvas.remove(canvas.getActiveObject());
            $(".deleteBtn").remove();
            UpdateModif(true);
        }        
    }
}

//create objects
let daikin_Temp = new Daikin(0, 2, "daikin-temp");
let daikin_Nexura = new Daikin(0, 2, "daikin-nexura");
let daikin_Us7 = new Daikin(0, 2, "daikin-us7");

// add delete button
$(document).on('click',".deleteBtn",()=>{daikin_Us7.delete()});
$(document).on('click',".deleteBtn",()=>{daikin_Nexura.delete()});
$(document).on('click',".deleteBtn",()=>{daikin_Temp.delete()});

// add component
$("#daikin-nexura").click(()=>{
    daikin_Nexura.addImg($("#daikin-nexura")[0])
})

$("#daikin-temp").click(()=>{
    daikin_Temp.addImg($("#daikin-temp")[0])
})

$("#daikin-us7").click(()=>{
    daikin_Us7.addImg($("#daikin-us7")[0])
})
//end add component

//create delete button
function addDeleteBtn(x, y){
    $(".deleteBtn").remove(); 
    var btnLeft = x-10;
    var btnTop = y-10;
    var deleteBtn = '<img src="icon/close-img.png" class="deleteBtn" style="position:absolute;top:'+btnTop+'px;left:'+btnLeft+'px;cursor:pointer;width:20px;height:20px;"/>';
    $(".canvas-container").append(deleteBtn);
}
canvas.on('object:selected',(e)=>{
    UpdateModif(false)
    addDeleteBtn(e.target.oCoords.tr.x, e.target.oCoords.tr.y);
});

canvas.on('mouse:down',(e)=>{
    UpdateModif(false)
    if(canvas.getActiveObject()){
        addDeleteBtn(e.target.oCoords.tr.x, e.target.oCoords.tr.y);
        UpdateModif(false)
    }
    if(!canvas.getActiveObject()){
        $(".deleteBtn").remove(); 
    }
});
canvas.on('mouse:up', (e)=>{
    UpdateModif(false);
});
canvas.on(
    'object:modified',(e)=>{
        UpdateModif(true)
        addDeleteBtn(e.target.oCoords.tr.x, e.target.oCoords.tr.y);
    },
    'object:added', ()=> {
        UpdateModif(true);
    }
);
canvas.on('object:scaling',(e)=>{
    UpdateModif(false)
    $(".deleteBtn").remove(); 
});
canvas.on('object:moving',(e)=>{
    UpdateModif(false)
    $(".deleteBtn").remove(); 
});
canvas.on('object:rotating',(e)=>{
    UpdateModif(false)
    $(".deleteBtn").remove(); 
});
// end create delete butyon

//add floor plan function
function setBgImage(ele){
    // UpdateModif(true)
    let img = ele;
    let val = 1;
    val = (val*10 +  0.15*10)/10;
    let sizeOfcanvasBg = [img.naturalWidth, img.naturalHeight];
    canvas.setDimensions({width : sizeOfcanvasBg[0], height : sizeOfcanvasBg[1]});
    canvas.setBackgroundImage(img.src, canvas.renderAll.bind(canvas), {
        // Needed to position backgroundImage at 0/0
        originX: 'left',
        originY: 'top'
    });

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

// canvas moving limit   
canvas.on('object:moving', (e)=>{
    UpdateModif(false)
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



/*////// UNDO  & REDO //////*/

let undo = ()=>{
    if (mods < state.length) {
        canvas.clear().renderAll();
        canvas.loadFromJSON(state[state.length - 1 - mods - 1]);        
        canvas.renderAll();
        // console.log("geladen " + (state.length-1-mods-1));
        // console.log("state " + state.length);
        mods += 1;
        on_undo(true)
        // console.log("mods " + mods);
    }
    if(!canvas.getActiveObject()){
        $(".deleteBtn").remove(); 
    }
    daikin_Nexura.checkQuantity()
    daikin_Temp.checkQuantity()
    daikin_Us7.checkQuantity()
    UpdateModif(false);
}

let redo = ()=>{
    if (mods > 0) {
        canvas.clear().renderAll();
        canvas.loadFromJSON(state[state.length - 1 - mods + 1]);
        canvas.renderAll();
        // console.log("geladen " + (state.length-1-mods+1));
        mods -= 1;
        // console.log("state " + state.length);
        // console.log("mods " + mods);
    }
    if(!canvas.getActiveObject()){
        $(".deleteBtn").remove(); 
    }
    daikin_Nexura.checkQuantity()
    daikin_Temp.checkQuantity()
    daikin_Us7.checkQuantity()
    UpdateModif(false);
    
}
////////END UNDO AND REDO //////////
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
