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
        $('#' + dataType).addClass('is-active');
        $(this).addClass('is-selected');

        if (canvas.backgroundImage === null && dataType === 'daikin-option') {
            $('#' + dataType).removeClass('is-active');
            $(this).removeClass('is-selected');
            dialog('This option required your floor plan to continue.', 'Notify', ()=>($('#floor-plan-option').addClass('is-active')));
        }
        $("#clear").click(()=>{
            dialog('Clear all the process?', 'Caution!', ()=>{
                // UpdateModif(true);
                // daikin_Nexura.checkQuantity();
                // daikin_Temp.checkQuantity();
                state = [];
                mods = 0;
                daikin_Us7.checkQuantity();
                daikin_OutDoor.checkQuantity();
                canvas.setBackgroundColor('rgba(255, 255, 255, 255)', canvas.renderAll.bind(canvas));
                $('#' + dataType).removeClass('is-active');
                $(".deleteBtn").remove();
                canvas.clear().renderAll();
                check = false;
                undo_redo_enable(state, mods);
            }
            )
        }
        );
    });
    $('.js-pane-affix-close').click(function() {
        $('.pane-affix').removeClass('is-active');
    });

    $('#area-upload').on('change', function() {
        debugger ;var checkUpload = readURL($(this));
        if (checkUpload == true) {
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
                success: function(result) {
                    console.log(result);
                },
                cache: false,
                contentType: false,
                processData: false
            });
        }
    });

    var url_string = window.location.href;
    var url = new URL(url_string);
    var quote_id = url.searchParams.get("quote_id");

    if (quote_id != null) {
        $.ajax({
            url: "APIGetDaikinOption.php",
            data: {
                'quote_id': quote_id,
            },
            type: 'POST',
            success: function(data) {
                var res = jQuery.parseJSON(data);
                $('#pre_install_photos_c').val(res['pre_install_photos_c']);
                $('#quote_id').val(res['quote_id']);
                var keys = Object.keys(res['products']);
                for (var i = 0; i < keys.length; i++) {
                    if ((keys[i].indexOf('FTX') != -1) || (keys[i].indexOf('FVX') != -1)) {
                        var wrapperItem = $('#daikinItems');
                        var itemDaikin = '<div class="pane-affix__catalog-column is-2">\
                                            <a class="pane-affix__catalog-item item-texture is-shrink" id="freeRoomBtn">\
                                                <div class="item-texture__image">\
                                                    <img src="icon/daikin-us7.jpg" id="daikin-us7" alt="">\
                                                </div>\
                                            </a>\
                                            <span><strong>' + res['products'][keys[i]]['Product'] + '(' + res['products'][keys[i]]['Quantity'] + 'X)</strong></span>\
                                        </div>';
                        var itemDaikinOutdoor = '<div class="pane-affix__catalog-column is-2">\
                                            <a class="pane-affix__catalog-item item-texture is-shrink" id="freeRoomBtn">\
                                                <div class="item-texture__image">\
                                                    <img src="icon/daikin_outdoor.png" id="daikin_outdoor" alt="">\
                                                </div>\
                                            </a>\
                                            <span><strong>' + res['products'][keys[i]]['Product'] + '-Outdoor (' + res['products'][keys[i]]['Quantity'] + 'X)</strong></span>\
                                        </div>';
                        wrapperItem.append(itemDaikin);
                        wrapperItem.append(itemDaikinOutdoor);
                    }
                }
                downloadFloorPlanFromSuite(res['quote_id'], res['pre_install_photos_c']);

            },
            error: function(response) {
                console.log("Fail");
            },
        });

        function downloadFloorPlanFromSuite(quote_id, pre_install_photos_c, callback) {
            $('.loading').find('h3').text('Preparing Floor Plan');
            $.ajax({
                url: "APIGetPlanFloorFromSuite.php",
                data: {
                    'quote_id': quote_id,
                    'pre_install_photos_c': pre_install_photos_c
                },
                type: 'POST',
                success: function(data) {
                    if (data != 'fail') {
                        var res = jQuery.parseJSON(data);
                        for (var i = 0; i < res.length; i++) {
                            var wrapperItemFloor = $('#FloorItems');
                            var itemFloor = '<div class="pane-affix__catalog-column is-2">\
                                                <a class="pane-affix__catalog-item item-texture is-shrink" id="freeRoomBtn">\
                                                    <div class="item-texture__image">\
                                                        <img src="' + res[i] + '" onclick="setBgImage(this)" alt="">\
                                                    </div>\
                                                </a>\
                                            </div>';
                            wrapperItemFloor.append(itemFloor);
                            $('.loading').hide();
                            $('#editor, #editorControls').removeClass('hidden-opacity');
                        }
                    } else {
                        dialog("Can't get photo of Floor Plan, Please upload photo by your device", 'Notify');
                        $('.loading').hide();
                        $('#editor, #editorControls').removeClass('hidden-opacity');
                    }

                },
                error: function(response) {
                    console.log("Fail");
                },
            });
        }
    } else {
        dialog("Please upload Floor Plan", 'Notify');
        $('.loading').hide();
        $('#editor, #editorControls').removeClass('hidden-opacity');
        for (var i = 0; i < 1; i++) {
            var wrapperItem = $('#daikinItems');
            var itemDaikin = '<div class="pane-affix__catalog-column is-2">\
                                <a class="pane-affix__catalog-item item-texture is-shrink" id="freeRoomBtn">\
                                    <div class="item-texture__image">\
                                        <img src="icon/daikin-us7.jpg" id="daikin-us7" alt="">\
                                    </div>\
                                </a>\
                                <span><strong>Daikin indoor(10X)</strong></span>\
                            </div>';
            var itemDaikinOutdoor = '<div class="pane-affix__catalog-column is-2">\
                                <a class="pane-affix__catalog-item item-texture is-shrink" id="freeRoomBtn">\
                                    <div class="item-texture__image">\
                                        <img src="icon/daikin_outdoor.png" id="daikin_outdoor" alt="">\
                                    </div>\
                                </a>\
                                <span><strong>Daikin outdoor(10X)</strong></span>\
                            </div>';
            wrapperItem.append(itemDaikin);
            wrapperItem.append(itemDaikinOutdoor);
        }
    }

    var canvasWrap = document.getElementById('c');
    canvasWrap.width = window.innerWidth;
    canvasWrap.height = window.innerHeight;

    function readURL(input) {
        if (input[0].files) {
            var filesAmount = input[0].files.length;
            for (var i = 0; i < filesAmount; i++) {
                var reader = new FileReader();
                reader.fileName = input[0].files[i].name;
                reader.onload = function(e) {
                    var wrapperItem = $('#FloorItems');
                    var itemDaikin = '<div class="pane-affix__catalog-column is-2">\
                                        <a class="pane-affix__catalog-item item-texture is-shrink" id="freeRoomBtn">\
                                            <div class="item-texture__image">\
                                                <img src="' + e.target.result + '" onclick="setBgImage(this)" alt="">\
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
    }
    ;
    /////////////DOWNLOAD///////////////
    let notSaved = ()=>{
        dialog("Download was canceled!", 'Download');
    }
    ;

    let saveImage = ()=>{
        $('#c').get(0).toBlob((blob)=>{
            let name = `Daikin_Design_Quote_${Math.floor(100000 + Math.random() * 900000)}.png`;

            let quote_id = $('#quote_id').val();

            saveAs(blob, name);
            let dataURL = $('#c').get(0).toDataURL();
            $.ajax({
                type: "POST",

                url: "APIUploadToFolderAndGeneratePDF.php",
                data: {
                    base64Img: dataURL,
                    name: name,
                    quote_id: quote_id

                }
            }).done(function(o) {
                console.log('saved');
            });
        }
        )
    }

    $("#save").click(()=>{
        if (canvas.backgroundImage === null) {
            dialog('Can not download blank image', 'Download', ()=>($('#floor-plan-option').addClass('is-active')), ()=>($('#floor-plan-option').removeClass('is-active')))
        } else {
            canvas.discardActiveObject().renderAll();
            $(".deleteBtn").remove();
            dialog(`Are you sure save this image on your computer?`, 'Download', saveImage, notSaved)
        }
    }
    );

    /////////////END DOWNLOAD///////////////
})
(jQuery);

// drag to Scroll();

let pos = { top: 0, left: 0, x: 0, y: 0 };

const mouseDownHandler = function(e) {
    pos = {
        left: $('#wrapCanvas')[0].scrollLeft,
        top: $('#wrapCanvas')[0].scrollTop,
        // Get the current mouse position
        x: e.clientX,
        y: e.clientY,
    };
    
    $(document).on('mousemove', mouseMoveHandler);
    $(document).on('mouseup', mouseUpHandler);
};

const mouseMoveHandler = function(e) {
    // How far the mouse has been moved
    const dx = e.clientX - pos.x;
    const dy = e.clientY - pos.y;
    
    // Scroll the element
    $('#wrapCanvas')[0].scrollTop = pos.top - dy;
    $('#wrapCanvas')[0].scrollLeft = pos.left - dx;
};

const mouseUpHandler = function() {
    $(document).off('mousemove', mouseMoveHandler);
    $(document).off('mouseup', mouseUpHandler);
};

// Attach the handler
$('#wrapCanvas').on('mousedown', mouseDownHandler);

// End drag ro scroll

fabric.Object.prototype.setControlsVisibility({
    tl: true,
    //top-left
    mt: false,
    // middle-top
    tr: false,
    //top-right
    ml: false,
    //middle-left
    mr: false,
    //middle-right
    bl: false,
    // bottom-left
    mb: false,
    //middle-bottom
    br: true,
    //bottom-right
    mtr: true
});

let canvas = this.__canvas = new fabric.Canvas('c');
fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';

function dialog(message, diagTle='Notify', yes=()=>{}, no=()=>{}) {
    $('.wrapper').css({
        '-webkit-filter': 'blur(10px)',
        '-moz-filter': 'blur(10px)',
        '-o-filter': 'blur(10px)',
        '-ms-filter': 'blur(10px)',
        'filter': 'blur(10px)'
    });
    $('.message').html(message);
    let dialog = $('#modal_dialog').dialog({
        modal: true,
        buttons: [{
            text: "YES",
            click: ()=>{
                yes()
                $('.wrapper').removeAttr('style');
                $('#modal_dialog').dialog("close");
            }
        }, {
            text: "NO",
            click: ()=>{
                no()
                $('.wrapper').removeAttr('style');
                $('#modal_dialog').dialog("close");
            }
        }],
        title: diagTle,
        close: function() {
            $('.wrapper').removeAttr('style');
            $('#modal_dialog').dialog("close");
        }
    });
}

$("#wrapCanvas").height = window.height;
$("#wrapCanvas").width = window.width;

// $("#wrapCanvas").scroll(()=>{
//     canvas.calcOffset();
// }
// );
canvas.setBackgroundColor('white', canvas.renderAll.bind(canvas));

canvas.counter = 0;
canvas.selection = false;
let state = [];
let mods = 0;

let check;
function on_undo(isUndo) {
    if (isUndo === true) {
        return check = true;
    } else {
        return check = false;
    }
}

let UpdateModif = (history)=>{
    if (history === true) {
        canvas.includeDefaultValues = false;
        myJson = canvas.toJSON(['setcontrolsVisibility', "id", "transparentCorners", "centeredScaling"]);
        state.push(myJson);
        undo_redo_enable(state, mods);
    }
    if (check === true && history === true) {
        start = (state.length - 1 - mods - 1);
        del_num = mods;
        state.splice(start + 1, del_num);
        mods = 0;
        undo_redo_enable(state, mods);
    }
}

function undo_redo_enable(state, mods) {
    let geladen = state.length - 1 - mods - 1;
    state.length > 0 ? $('.b-header__undo').removeClass('is-disabled') : $('.b-header__undo').addClass('is-disabled');
    geladen < 0 ? $('.b-header__undo').addClass('is-disabled') : $('.b-header__undo').removeClass('is-disabled');
    mods > 0 ? $('.b-header__redo').removeClass('is-disabled') : $('.b-header__redo').addClass('is-disabled');
}

class Daikin {
    constructor(id, quantity, type) {
        this.id = this.setID();
        this.quantity = quantity;
        this.count = quantity;
        this.type = type;
    }

    setID() {
        return this.id = Math.floor(Math.random() * 90 + 10);
    }

    _OnDel() {
        this.quantity += 1
        return this.quantity
    }

    _OnAdd() {
        this.quantity -= 1
        return this.quantity
    }

    updateQuantity() {
        this.quantity = 0;
        dialog(`Limited Quantity!\nPlease Delete Components`);
    }

    addImg(e, line1, line2) {
        if (this.id) {
            this._OnAdd()
        }
        if(this.quantity < 0){
            this.updateQuantity()
        } else {
            fabric.Image.fromURL(e.src, (oImg)=>{
                let l = canvas.width / 2;
                let t = canvas.height / 2;
                oImg.scale(0.2);
                oImg.set({
                    "id": this.id
                });
                oImg.set({
                    // 'left': l
                    'left': 20
                });
                oImg.set({
                    // 'top': t
                    'top': 20
                });
                oImg.set({
                    "transparentCorners": false
                });
                oImg.set({
                    "centeredScaling": true
                });
                           
                canvas.add(oImg);                
                oImg.line1 = line1;
                oImg.line2 = line2;
                UpdateModif(true);
                return oImg;                
                
            });
            
            
        }           
        
    }

    checkQuantity() {
        let curr_obj = 0;
        if (state[state.length - 1 - mods] !== undefined) {
            let current_State = state[state.length - 1 - mods].objects;
            if (current_State.length > 0) {
                for (let x in current_State) {
                    if (this.id === current_State[x].id) {
                        curr_obj++
                    }
                }
                this.quantity = curr_obj;
                this.quantity = this.count - this.quantity;
            }
        } else {
            this.quantity = this.count
        }
    }

    delete() {
        header_disable()
        if (canvas.getActiveObject() && this.id === canvas.getActiveObject().id) {
            this._OnDel();
            canvas.remove(canvas.getActiveObject());
            $(".deleteBtn").remove();            
            UpdateModif(true);
        }
    }
}

function header_disable(){
    $('.b-header__rotate_left').addClass('is-disabled');
    $('.b-header__rotate_right').addClass('is-disabled');
    $('.b-header__rotate_90deg_left').addClass('is-disabled');
    $('.b-header__rotate_90deg_right').addClass('is-disabled');
    $('.b-header__copy').addClass('is-disabled');
    $('.b-header__paste').addClass('is-disabled');
}

function header_enable(){
    $('.b-header__rotate_left').removeClass('is-disabled');
    $('.b-header__rotate_right').removeClass('is-disabled');
    $('.b-header__rotate_90deg_left').removeClass('is-disabled');
    $('.b-header__rotate_90deg_right').removeClass('is-disabled');
    $('.b-header__copy').removeClass('is-disabled');
    $('.b-header__paste').removeClass('is-disabled');
}

function makeLine(coords) {
    return new fabric.Line(coords, {
        fill: 'blue',
        stroke: 'blue',
        strokeWidth: 5,
        selectable: false,
        evented: false,
        dirty: false
    });
}

let daikin_Us7 = new Daikin(0,2,"daikin-us7");
let daikin_OutDoor = new Daikin(0,2,"daikin_outdoor");

// add delete button
$(document).on('click', ".deleteBtn", (e)=>{
    
    // obj.line1 && obj.line1.set({ 'x1': 0, 'y1': 0 });
    // obj.line2 && obj.line2.set({ 'x2': 0, 'y2': 0 });
    daikin_Us7.delete()
}
);

// $(document).on('click',".deleteBtn",()=>{daikin_Nexura.delete()});
// $(document).on('click',".deleteBtn",()=>{daikin_Temp.delete()});

$(document).on('click', ".deleteBtn", (e)=>{
    // obj.line1 && obj.line1.set({ 'x1': 0, 'y1': 0 });
    // obj.line2 && obj.line2.set({ 'x2': 0, 'y2': 0 });
    daikin_OutDoor.delete()
}
);

$(document).on('click', ".deleteBtn", (e)=>{
    // obj.line1 && obj.line1.set({ 'x1': 0, 'y1': 0 });
    // obj.line2 && obj.line2.set({ 'x2': 0, 'y2': 0 });
    if(canvas.getActiveObject()){
        canvas.remove(canvas.getActiveObject())
        $(".deleteBtn").remove();
    }
})
//create delete buttons

function addDeleteBtn(x, y) {
    $(".deleteBtn").remove();
    var btnLeft = x;
    var btnTop = y - 25;
    var deleteBtn = '<img src="icon/close-img.png" class="deleteBtn" style="position:absolute;top:' + btnTop + 'px;left:' + btnLeft + 'px;cursor:pointer;width:20px;height:20px;"/>';
    $(".canvas-container").append(deleteBtn);
    UpdateModif(true);
}
// end create delete buttons

canvas.on('object:selected', (e)=>{
    header_enable();
    $('#wrapCanvas').off('mousedown', mouseDownHandler);
    UpdateModif(false);
    addDeleteBtn(e.target.oCoords.tr.x, e.target.oCoords.tr.y);    
    cur_angle = e.target.angle;
}
);

canvas.on('mouse:down', (e)=>{
    UpdateModif(false)
    if (canvas.getActiveObject()) {
        $('#wrapCanvas').off('mousedown', mouseDownHandler);
        cur_angle = e.target.angle;
        addDeleteBtn(e.target.oCoords.tr.x, e.target.oCoords.tr.y);
        UpdateModif(false);
    } else {
        $('#wrapCanvas').on('mousedown', mouseDownHandler);
        header_disable();
        $(".deleteBtn").remove();
    }
}
);
canvas.on('mouse:up', (e)=>{
    UpdateModif(false);
}
);
canvas.on('object:modified', (e)=>{    
    UpdateModif(true);
    addDeleteBtn(e.target.oCoords.tr.x, e.target.oCoords.tr.y);
}
, 'object:added', (e)=>{
    UpdateModif(true);
}
);
canvas.on('object:scaling', (e)=>{
    UpdateModif(false);
    $(".deleteBtn").remove();
}
);

canvas.on('object:rotating', (e)=>{
    UpdateModif(false);
    $(".deleteBtn").remove(); 
}
);

// canvas moving limit   
canvas.on('object:moving', (e)=>{
    UpdateModif(false);
    let obj = e.target;
    
    obj.line1 && obj.line1.set({ 'x1': obj.left, 'y1': obj.top });
    obj.line2 && obj.line2.set({ 'x2': obj.left, 'y2': obj.top });
    
    // if object is too big ignore
    if (obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width) {
        return;
    }
    obj.setCoords();
    // top-left  corner
    if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
        obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top);
        obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left);
    }
    // bot-right corner
    if (obj.getBoundingRect().top + obj.getBoundingRect().height > obj.canvas.height || obj.getBoundingRect().left + obj.getBoundingRect().width > obj.canvas.width) {
        obj.top = Math.min(obj.top, obj.canvas.height - obj.getBoundingRect().height + obj.top - obj.getBoundingRect().top);
        obj.left = Math.min(obj.left, obj.canvas.width - obj.getBoundingRect().width + obj.left - obj.getBoundingRect().left);
    }
    $(".deleteBtn").remove();
    canvas.renderAll();
}
);
// end canvas moving limit

// add component

let line = [];
$("#daikin-option").on('click', '#daikin-us7', ()=>{
    // old error code daikin_OutDoor.addImg($("#daikin_outdoor")[0])
    
    line.push(makeLine());    

    if(line.length > 1){
        line.shift()
    }
    if(daikin_Us7.quantity !== 0){
        for(let x in line){         
            daikin_Us7.addImg($("#daikin-us7")[0], null, line[x]);
            daikin_OutDoor.addImg($("#daikin_outdoor")[0], line[x], null);
            canvas.add(line[x]);                                 
        }
    } else {
        daikin_Us7.updateQuantity()
    }            
}
);

$("#daikin-option").on('click', '#daikin_outdoor', ()=>{
   
    line.push(makeLine());    
    if(line.length > 1){
        line.shift();
    }
    if(daikin_OutDoor.quantity !== 0){
        for(let x in line){
            console.log(line[x])        
            daikin_OutDoor.addImg($("#daikin_outdoor")[0], line[x], null);  
            daikin_Us7.addImg($("#daikin-us7")[0], null, line[x]);
            canvas.add(line[x]);  
        }
    } else {
        daikin_OutDoor.updateQuantity();
    }
}
);
//end add component

//add floor plan function

let img
let sizeOfcanvasBg;

function setBgImage(ele) {
    img = ele;
    sizeOfcanvasBg = [img.naturalWidth, img.naturalHeight];
    canvas.setDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight
    });
    canvas.setBackgroundImage(img.src, canvas.renderAll.bind(canvas), {
        // Needed to position backgroundImage at 0/0
        originX: 'left',
        originY: 'top'
    });
    // $(".canvas-container")[0].style.margin = "auto";
    // $(".canvas-container")[0].style.top = "10%";
    // UpdateModif(true);
}

// Copy and Paste
$('#copy').on('click',() =>{
	// clone what are you copying since you
	// may want copy and paste on different moment.
	// and you do not want the changes happened
	// later to reflect on the copy.
	canvas.getActiveObject().clone(function(cloned) {
        // _clipboard = cloned;
        cloned.left += 20;
        cloned.top += 20;
        canvas.add(cloned);   
    });
    // var canvas = target.canvas;
    // target.clone(function(cloned) {
    //   cloned.left += 10;
    //   cloned.top += 10;
    //   canvas.add(cloned);
    // });
    
});

// $('#paste').on('click',() =>{
// 	// clone again, so you can do multiple copies.
// 	_clipboard.clone(function(clonedObj) {
// 		canvas.discardActiveObject();
// 		clonedObj.set({
// 			left: clonedObj.left + 10,
// 			top: clonedObj.top + 10,
// 			evented: true,
// 		});
// 		if (clonedObj.type === 'activeSelection') {
// 			// active selection needs a reference to the canvas.
// 			clonedObj.canvas = canvas;
// 			clonedObj.forEachObject(function(obj) {
// 				canvas.add(obj);
// 			});
// 			// this should solve the unselectability
// 			clonedObj.setCoords();
// 		} else {
// 			canvas.add(clonedObj);
// 		}
// 		_clipboard.top += 10;
// 		_clipboard.left += 10;
// 		canvas.setActiveObject(clonedObj);
// 		canvas.requestRenderAll();
// 	});
// });

//End Copy and Paste
let val = 1;
val = (val * 10 + 0.01 * 10) / 10;
let scaleRatio;
$("#zoomIn").click(()=>{
//     if (canvas.backgroundImage === null || canvas.backgroundImage === undefined) {
//         canvas.clear().renderAll();
//     } else {
//         sizeOfcanvasBg = [Math.round(sizeOfcanvasBg[0] * val), Math.round(sizeOfcanvasBg[1] * val)];
//         canvas.setDimensions({
//             width: sizeOfcanvasBg[0],
//             height: sizeOfcanvasBg[1]
//         });
//         canvas.setBackgroundImage(img.src, canvas.renderAll.bind(canvas), {
//             scaleX: canvas.width / img.naturalWidth,
//             scaleY: canvas.height / img.naturalHeight
//         });
//         canvas.renderAll();
//         UpdateModif(true);
//     }
//     for (let i in canvas._objects) {
//         // let oCoordskey = Object.keys(canvas._objects[i].oCoords);

//         canvas._objects[i].left *= val;
//         canvas._objects[i].top *= val;

//         canvas._objects[i].translateX *= val;
//         canvas._objects[i].translateY *= val;

//         canvas.item(i).setCoords();
//     }
//     canvas.discardActiveObject().renderAll();
//     $(".deleteBtn").remove();


scaleRatio = 1; // Math.min($("#wrapCanvas").width / canvas.width, $("#wrapCanvas").heigh/canvas.height);
// canvas.setDimensions({ width: canvas.getWidth() * scaleRatio, height: canvas.getHeight() * scaleRatio });
canvas.setZoom(scaleRatio);
console.log(canvas.height * val)
console.log(canvas.width * val)

}
)

// $("#zoomOut").click(()=>{
//     if (canvas.backgroundImage === null || canvas.backgroundImage === undefined) {
//         canvas.clear().renderAll();
//     } else {
//         sizeOfcanvasBg = [Math.round(sizeOfcanvasBg[0] / val), Math.round(sizeOfcanvasBg[1] / val)];
//         canvas.setDimensions({
//             width: sizeOfcanvasBg[0],
//             height: sizeOfcanvasBg[1]
//         });
//         canvas.setBackgroundImage(img.src, canvas.renderAll.bind(canvas), {
//             scaleX: canvas.width / img.naturalWidth,
//             scaleY: canvas.height / img.naturalHeight
//         });
//         canvas.renderAll();
//         UpdateModif(true);
//     }
//     for (let i in canvas._objects) {
//         // let oCoordskey = Object.keys(canvas._objects[i].oCoords);

//         canvas._objects[i].left /= val;
//         canvas._objects[i].top /= val;

//         canvas._objects[i].translateX /= val;
//         canvas._objects[i].translateY /= val;
//         canvas.item(i).setCoords();
//     }
//     canvas.discardActiveObject().renderAll();
//     $(".deleteBtn").remove();
// }
// )

//Rotate Objects Function
let deg = 0;
let cur_angle;
let setAngle = ()=>{
    deg = cur_angle;
    if (canvas.getActiveObject() !== null && canvas.getActiveObject() !== undefined) {
        canvas.getActiveObject().set({
            'angle': deg,
            // 'originX': 'center',
            // 'originY': 'center',
        });
        canvas.getActiveObject().setCoords();
    }
    // for(let i in canvas._objects){
    //     canvas.item(i).set({'angle': deg});
    //     canvas.item(i).setCoords();
    canvas.renderAll();
    // }
    // canvas.discardActiveObject().renderAll();)
    UpdateModif(true);
    $(".deleteBtn").remove();
}
$('#rot_lef').click((e)=>{
    if (cur_angle <= -360) {
        cur_angle += 360;
        cur_angle -= 15;
    } else {
        cur_angle -= 15;
    }
    setAngle();
}
)

$('#rot_rig').click((e)=>{
    if (cur_angle >= 360) {
        cur_angle -= 360;
        cur_angle += 15;
    } else {
        cur_angle += 15;
    }
    setAngle();
}
)
$('#rot_90_lef').click((e)=>{
    if (cur_angle <= -360) {
        cur_angle += 360;
        cur_angle -= 90;
    } else {
        cur_angle -= 90;
    }
    setAngle();
}
)

$('#rot_90_rig').click((e)=>{
    if (cur_angle >= 360) {
        cur_angle -= 360;
        cur_angle += 90;
    } else {
        cur_angle += 90;
    }
    setAngle();
}
)

//End rotate object function

/*////// UNDO  & REDO //////*/
function modifyCanvas() {
    $('#daikin-option').removeClass('is-active');
    canvas.discardActiveObject().renderAll();
    $(".deleteBtn").remove();
    // daikin_Nexura.checkQuantity();
    // daikin_Temp.checkQuantity();
    daikin_Us7.checkQuantity();
    daikin_OutDoor.checkQuantity();
    if (state.length - 1 - mods >= 0) {
        if (state[state.length - 1 - mods].backgroundImage !== undefined && state[state.length - 1 - mods].backgroundImage.scaleX !== undefined && state[state.length - 1 - mods].backgroundImage.scaleY !== undefined) {
            let state_wid = state[state.length - 1 - mods].backgroundImage.width * state[state.length - 1 - mods].backgroundImage.scaleX;
            let state_hei = state[state.length - 1 - mods].backgroundImage.height * state[state.length - 1 - mods].backgroundImage.scaleY;
            canvas.setDimensions({
                width: state_wid,
                height: state_hei
            });
        }
    }
    header_disable();
}

$('#undoBtn').click(()=>{
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
    undo_redo_enable(state, mods);
    modifyCanvas();
    canvas.renderAll();
}
)

$('#redoBtn').click(()=>{
    if (mods > 0) {
        canvas.clear().renderAll();
        canvas.loadFromJSON(state[state.length - 1 - mods + 1]);
        canvas.renderAll();
        // console.log("geladen " + (state.length-1-mods+1));
        mods -= 1;
        // console.log("state " + state.length);
        // console.log("mods " + mods);
    }
    undo_redo_enable(state, mods);
    modifyCanvas();
    canvas.renderAll();
}
)
////////END UNDO AND REDO //////////

//
function renderIcon(icon) {
    return function renderIcon(ctx, left, top, styleOverride, fabricObject) {
        var size = this.cornerSize;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
        ctx.drawImage(icon, -size / 2, -size / 2, size, size);
        ctx.restore();
    }
}

canvas.renderAll();

