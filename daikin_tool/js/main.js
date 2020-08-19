(function($) {
    /*==================================================================
    [ Validate ]*/
    // Active Control Left
    $('.loading').show();
    $('#editor, #editorControls').addClass('hidden-opacity');
    
    $('.pane-nav__item').click(function() {
        var dataType = $(this).attr('data-type');
        $('.pane-nav__item').removeClass('is-selected');
        $('.pane-affix').removeClass('is-active');
        $('#'+dataType).addClass('is-active');
        $(this).addClass('is-selected');

        if(canvas.backgroundImage  === null && dataType === 'daikin-option'){
            $('#'+dataType).removeClass('is-active');
            $(this).removeClass('is-selected');
            dialog('This option required your floor plan to continue.', 'Notify',()=>(
                $('#floor-plan-option').addClass('is-active')
                ));
        }
        $("#clear").click(()=>{
            dialog('Clear all the process?', 'Caution!', ()=>{
                $('#'+dataType).removeClass('is-active');
                $(".deleteBtn").remove();
                canvas.clear().renderAll();
                state = [];
                UpdateModif(true);
                // daikin_Nexura.checkQuantity();
                // daikin_Temp.checkQuantity();
                daikin_Us7.checkQuantity();
                daikin_OutDoor.checkQuantity();   
                canvas.setBackgroundColor('rgba(255, 255, 255, 255)', canvas.renderAll.bind(canvas));
            })            
        });
    });
    $('.js-pane-affix-close').click(function() {
        $('.pane-affix').removeClass('is-active');
    });

    $('#area-upload').on('change', function() {
        debugger;
        var checkUpload = readURL($(this));
        if(checkUpload == true) {
            // var file_data = $('#uploadFloor').prop('files');   
            // var form_data = new FormData();                  
            // form_data.append('file', file_data);
            var formData = new FormData($('form#uploadFloor')[0]);
            formData.append('quote_id', $('#quote_id').val());
            $.ajax({
                type: "POST",
                url: 'UploadFileToFolder.php',
                data: formData,
                dataType: 'text',
                success: function(result)
                {
                    console.log(result);
                },
                cache: false,
                contentType: false,
                processData: false
            });
        }
    });


    var url_string  = window.location.href;
    var url = new URL(url_string);
    var quote_id = url.searchParams.get("quote_id");

    $.ajax({
        url: "APIGetDaikinOption.php",
        data: {
            'quote_id': quote_id,
        },
        type: 'POST',
        success: function(data)
        {
            var res = jQuery.parseJSON(data);
            $('#pre_install_photos_c').val(res['pre_install_photos_c']);
            $('#quote_id').val(res['quote_id']);
            var keys = Object.keys(res['products']);
            for(var i = 0; i < keys.length; i++) {
                if((keys[i].indexOf('FTX') != -1) || (keys[i].indexOf('FVX') != -1)) {
                    var wrapperItem = $('#daikinItems');
                    var itemDaikin = '<div class="pane-affix__catalog-column is-2">\
                                        <a class="pane-affix__catalog-item item-texture is-shrink" id="freeRoomBtn">\
                                            <div class="item-texture__image">\
                                                <img src="icon/daikin-us7.jpg" id="daikin-us7" alt="">\
                                            </div>\
                                        </a>\
                                        <span><strong>'+res['products'][keys[i]]['Product']+'('+res['products'][keys[i]]['Quantity']+'X)</strong></span>\
                                    </div>';
                    var itemDaikinOutdoor = '<div class="pane-affix__catalog-column is-2">\
                                        <a class="pane-affix__catalog-item item-texture is-shrink" id="freeRoomBtn">\
                                            <div class="item-texture__image">\
                                                <img src="icon/daikin_outdoor.png" id="daikin_outdoor" alt="">\
                                            </div>\
                                        </a>\
                                        <span><strong>'+res['products'][keys[i]]['Product']+'-Outdoor ('+res['products'][keys[i]]['Quantity']+'X)</strong></span>\
                                    </div>';
                    wrapperItem.append(itemDaikin);
                    wrapperItem.append(itemDaikinOutdoor);
                }
            }
            downloadFloorPlanFromSuite(res['quote_id'], res['pre_install_photos_c']);
            
        },
        error: function(response){console.log("Fail");},
    });

    function downloadFloorPlanFromSuite(quote_id, pre_install_photos_c,  callback){
        $('.loading').find('h3').text('Preparring Floor Plan');
        $.ajax({
            url: "APIGetPlanFloorFromSuite.php",
            data: {
                'quote_id': quote_id,
                'pre_install_photos_c': pre_install_photos_c
            },
            type: 'POST',
            success: function(data)
            {
                if(data != 'fail') {
                    var res = jQuery.parseJSON(data);
                    for(var i = 0; i < res.length; i++) {
                        var wrapperItemFloor = $('#FloorItems');
                        var itemFloor = '<div class="pane-affix__catalog-column is-2">\
                                            <a class="pane-affix__catalog-item item-texture is-shrink" id="freeRoomBtn">\
                                                <div class="item-texture__image">\
                                                    <img src="'+res[i]+'" onclick="setBgImage(this)" alt="">\
                                                </div>\
                                            </a>\
                                        </div>';
                                        wrapperItemFloor.append(itemFloor);
                        $('.loading').hide();
                        $('#editor, #editorControls').removeClass('hidden-opacity');
                    }
                } else {
                    alert("Can't get photo of Floor Plan, Please upload photo by your device");
                    $('.loading').hide();
                    $('#editor, #editorControls').removeClass('hidden-opacity');
                }
                
                
            },
            error: function(response){console.log("Fail");},
        });
    }

    var canvasWrap = document.getElementById('c');
    canvasWrap.width  = window.innerWidth;
    canvasWrap.height = window.innerHeight;

    function readURL(input) {
        if (input[0].files) {
            var filesAmount = input[0].files.length;
            for(var i = 0; i < filesAmount; i++) {
                var reader = new FileReader();
                reader.fileName = input[0].files[i].name;
                reader.onload = function(e) {
                    var wrapperItem = $('#FloorItems');
                    var itemDaikin = '<div class="pane-affix__catalog-column is-2">\
                                        <a class="pane-affix__catalog-item item-texture is-shrink" id="freeRoomBtn">\
                                            <div class="item-texture__image">\
                                                <img src="'+e.target.result+'" onclick="setBgImage(this)" alt="">\
                                            </div>\
                                        </a>\
                                    </div>';
                    wrapperItem.append(itemDaikin);
                }
                reader.readAsDataURL(input[0].files[i]);
            }
            return true;
        } else {
            return false;
        }
    };

/////////////DOWNLOAD///////////////

let saved = ()=>{
    $('#c').get(0).toBlob((blob)=>{
    let name = `Daikin_Design_Quote_${Math.floor(100000 + Math.random() * 900000)}.png`;
    saveAs(blob, name);
    let dataURL = $('#c').get(0).toDataURL();
    $.ajax({
        type: "POST",
        url: "upload.php",
        data: {
            base64Img: dataURL,
            QuoteId: name
        }
    }).done(function(o) {
        
    });
})};

let notSaved = ()=>{
    dialog("Download was canceled!", 'Download');
};
$("#save").click(()=>{
    if(canvas.backgroundImage === null){
        dialog(
            'Can not download blank image', 'Download',
            ()=>($('#floor-plan-option').addClass('is-active')),
            ()=>($('#floor-plan-option').removeClass('is-active'))
        )
    } else {
        canvas.discardActiveObject().renderAll();
        $(".deleteBtn").remove();
        dialog(`Are you sure save this image on your computer?`, 'Download', saved, notSaved)
    }    
});

/////////////END DOWNLOAD///////////////
})(jQuery);

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

function dialog(message, diagTle = 'Notify', yes = ()=>{}, no = ()=>{}){
    $('.wrapper').css({
        '-webkit-filter': 'blur(10px)',
        '-moz-filter': 'blur(10px)',
        '-o-filter': 'blur(10px)',
        '-ms-filter': 'blur(10px)',
        'filter': 'blur(10px)'});
    $('.message').html(message);
    let dialog = $('#modal_dialog').dialog({
        modal: true,
        buttons: [{           
            text: "YES",
            click: ()=>{
                yes()
                $('.wrapper').removeAttr('style');
                $('#modal_dialog').dialog( "close" );                
            }
        },{
            text: "NO",
            click: ()=>{
                no()
                $('.wrapper').removeAttr('style');
                $('#modal_dialog').dialog( "close" );                
            }
        }],
        title: diagTle,
    });
}

$("#wrapCanvas").height = window.height;
$("#wrapCanvas").width = window.width;

$("#wrapCanvas").scroll(()=>{
    canvas.calcOffset();
});
canvas.setBackgroundColor('white', canvas.renderAll.bind(canvas));

canvas.counter = 0;
canvas.selection = false;
let state = [];
let mods = 0;

let val = 1;
val = (val*10 +  0.01*10)/10;

check = false;
function on_undo(isUndo){
    if(isUndo === true){
        return check = true;
    }
}

let UpdateModif = (history)=>{
    let i = 0;
    if(check === true && history === true){
        while(i < mods){
            state.pop()
            i++            
        }
        console.log(mods);
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
        dialog(`Limited Quantity!\nPlease Delete Components`);
    }
    
    addImg(e){
        if(this.id){
            this._OnAdd()
        }
        this.quantity < 0 ? this.updateQuantity() 
        : fabric.Image.fromURL(e.src, (oImg)=> {
            let l = canvas.width/2;
            let t = canvas.height/2;
            oImg.scale(0.2);
            oImg.set({"id":this.id});
            oImg.set({'left':l});
            oImg.set({'top':t});
            oImg.set({"transparentCorners" :false});
            oImg.set({"centeredScaling" :true});
            
            canvas.add(oImg);
        });
        UpdateModif(true);        
    }

    checkQuantity(){
        let curr_obj = 0;        
        if(state[state.length - 1 - mods] !== undefined){
        let current_State = state[state.length - 1 - mods].objects;
        if(current_State.length > 0){
            for(let x in current_State){
                if(this.id === current_State[x].id){
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
// let daikin_Temp = new Daikin(0, 2, "daikin-temp");
// let daikin_Nexura = new Daikin(0, 2, "daikin-nexura");
let daikin_Us7 = new Daikin(0, 2, "daikin-us7");
let daikin_OutDoor = new Daikin(0, 2, "daikin_outdoor");

// add component
// $("#daikin-nexura").click(()=>{            
//     daikin_Nexura.addImg($("#daikin-nexura")[0]);
// });

// $("#daikin-temp").click(()=>{            
//     daikin_Temp.addImg($("#daikin-temp")[0]);
// });

$("#daikin-option").on('click', '#daikin-us7', ()=>{
    // old error code daikin_OutDoor.addImg($("#daikin_outdoor")[0])
    daikin_Us7.addImg($("#daikin-us7")[0]);
});

$("#daikin-option").on('click', '#daikin_outdoor', ()=>{    
    daikin_OutDoor.addImg($("#daikin_outdoor")[0]);     
});
        
//end add component

// add delete button
$(document).on('click',".deleteBtn",()=>{daikin_Us7.delete()});
// $(document).on('click',".deleteBtn",()=>{daikin_Nexura.delete()});
// $(document).on('click',".deleteBtn",()=>{daikin_Temp.delete()});
$(document).on('click',".deleteBtn",()=>{daikin_OutDoor.delete()});

//create delete button
function addDeleteBtn(x, y){
    $(".deleteBtn").remove(); 
    var btnLeft = x-5;
    var btnTop = y-20;
    var deleteBtn = '<img src="icon/close-img.png" class="deleteBtn" style="position:absolute;top:'+btnTop+'px;left:'+btnLeft+'px;cursor:pointer;width:20px;height:20px;"/>';
    $(".canvas-container").append(deleteBtn);
};

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

let img
let sizeOfcanvasBg;

function setBgImage(ele){    
    img = ele;
    sizeOfcanvasBg = [img.naturalWidth, img.naturalHeight];
    canvas.setDimensions({width : img.naturalWidth, height : img.naturalHeight});
    canvas.setBackgroundImage(img.src, canvas.renderAll.bind(canvas), {
        // Needed to position backgroundImage at 0/0
        originX: 'left',
        originY: 'top'
    });
    //end button zoom in and zoom out function
    $(".canvas-container")[0].style.margin = "auto";
    $(".canvas-container")[0].style.top = "10%";
    UpdateModif(true);
}

$("#zoomIn").click(()=>{        
    sizeOfcanvasBg = [Math.round(sizeOfcanvasBg[0] * val), Math.round(sizeOfcanvasBg[1] * val)];
    canvas.setDimensions({width : sizeOfcanvasBg[0], height : sizeOfcanvasBg[1]});
    canvas.setBackgroundImage(img.src, canvas.renderAll.bind(canvas), {
        scaleX: canvas.width / img.naturalWidth,
        scaleY: canvas.height / img.naturalHeight
    });
    for(let i in canvas._objects){
        let oCoordskey = Object.keys(canvas._objects[i].oCoords);
        
        canvas._objects[i].left *= val;
        canvas._objects[i].top *= val;

        canvas._objects[i].translateX *= val;
        canvas._objects[i].translateY *= val;
        
        for(let j in oCoordskey){
            canvas._objects[i].oCoords[oCoordskey[j]].x *= val;
            canvas._objects[i].oCoords[oCoordskey[j]].y *= val;                
        }
    }
    canvas.discardActiveObject().renderAll();
    $(".deleteBtn").remove();
    UpdateModif(true);
})

$("#zoomOut").click(()=>{
    sizeOfcanvasBg = [Math.round(sizeOfcanvasBg[0] / val), Math.round(sizeOfcanvasBg[1] / val)];              
    canvas.setDimensions({width : sizeOfcanvasBg[0], height : sizeOfcanvasBg[1]});
    canvas.setBackgroundImage(img.src, canvas.renderAll.bind(canvas), {
        scaleX: canvas.width / img.naturalWidth,
        scaleY: canvas.height / img.naturalHeight
    });     
    for(let i in canvas._objects){
        let oCoordskey = Object.keys(canvas._objects[i].oCoords);

        canvas._objects[i].left /= val;
        canvas._objects[i].top /= val;

        canvas._objects[i].translateX /= val;
        canvas._objects[i].translateY /= val;

        for(let j in oCoordskey){                
            canvas._objects[i].oCoords[oCoordskey[j]].x /= val;
            canvas._objects[i].oCoords[oCoordskey[j]].y /= val;         
        }
    }
    canvas.discardActiveObject().renderAll();
    $(".deleteBtn").remove();
    UpdateModif(true);
})

// canvas moving limit   
canvas.on('object:moving', (e)=>{
    UpdateModif(false);
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
    canvas.discardActiveObject().renderAll();
    $(".deleteBtn").remove();     
    // daikin_Nexura.checkQuantity();
    // daikin_Temp.checkQuantity();
    daikin_Us7.checkQuantity();
    daikin_OutDoor.checkQuantity();
    if(canvas.backgroundImage !== null &&
       state[state.length - 1 - mods].backgroundImage.scaleX !== undefined &&
       state[state.length - 1 - mods].backgroundImage.scaleY !== undefined){
        let state_wid = state[state.length - 1 - mods].backgroundImage.width * state[state.length - 1 - mods].backgroundImage.scaleX;
        let state_hei = state[state.length - 1 - mods].backgroundImage.height * state[state.length - 1 - mods].backgroundImage.scaleY;
        canvas.setDimensions({width: state_wid, height: state_hei});
    }
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
    canvas.discardActiveObject().renderAll();
    $(".deleteBtn").remove();
    // daikin_Nexura.checkQuantity();
    // daikin_Temp.checkQuantity();
    daikin_Us7.checkQuantity();
    daikin_OutDoor.checkQuantity();
    if(state.length !== 0 &&
       state[state.length - 1 - mods].backgroundImage !== undefined &&
       state[state.length - 1 - mods].backgroundImage.scaleX !== undefined &&
       state[state.length - 1 - mods].backgroundImage.scaleY !== undefined){
           let state_wid = state[state.length - 1 - mods].backgroundImage.width * state[state.length - 1 - mods].backgroundImage.scaleX;
           let state_hei = state[state.length - 1 - mods].backgroundImage.height * state[state.length - 1 - mods].backgroundImage.scaleY;
           canvas.setDimensions({width: state_wid, height: state_hei});
        }
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