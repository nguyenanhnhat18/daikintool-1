(function($) {
    /*==================================================================
    [ Validate ]*/
    // Active Control Left
    $('.loading').show();
    $('#editor, #editorControls').addClass('hidden-opacity');
    var animation = bodymovin.loadAnimation({
        container: document.getElementById('lottie'), // Required
        path: '/js/loading.json', // Required
        renderer: 'svg/canvas/html', // Required
        loop: true, // Optional
        autoplay: true, // Optional
        name: "Hello World", // Name for future reference. Optional.
    });
    animation.play();

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
                line = [];
                canvas.setZoom(1);
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

    if(quote_id != null) {
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
                                                    <img src="icon/daikin_indoor_cv.png" id="daikin-us7" alt="">\
                                                </div>\
                                            </a>\
                                            <span><strong>'+res['products'][keys[i]]['Product']+'('+res['products'][keys[i]]['Quantity']+'X)</strong></span>\
                                        </div>';
                        var itemDaikinOutdoor = '<div class="pane-affix__catalog-column is-2">\
                                            <a class="pane-affix__catalog-item item-texture is-shrink" id="freeRoomBtn">\
                                                <div class="item-texture__image">\
                                                    <img src="icon/daikin_outdoor_cv.png" id="daikin_outdoor" alt="">\
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
                success: function(data)
                {
                    if(data != 'fail') {
                        var res = jQuery.parseJSON(data);
                        for(var i = 0; i < res.length; i++) {
                            var wrapperItemFloor = $('#FloorItems');
                            var itemFloor = '<div class="pane-affix__catalog-column is-2">\
                                                <a class="pane-affix__catalog-item item-texture is-shrink" id="freeRoomBtn">\
                                                    <div class="item-texture__image">\
                                                        <img src="' + res[i] + '" alt="">\
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
                error: function(response){console.log("Fail");},
            });
        }
    } else {
        dialog("Please upload Floor Plan", 'Notify');
        $('.loading').hide();
        $('#editor, #editorControls').removeClass('hidden-opacity');
        for(var i = 0; i < 1; i++) {
            var wrapperItem = $('#daikinItems');
            var itemDaikin = '<div class="pane-affix__catalog-column is-2">\
                                <a class="pane-affix__catalog-item item-texture is-shrink" id="freeRoomBtn">\
                                    <div class="item-texture__image">\
                                        <img src="icon/daikin_indoor_cv.png" id="daikin-us7" alt="">\
                                    </div>\
                                </a>\
                                <span><strong>Daikin indoor(10X)</strong></span>\
                            </div>';
            var itemDaikinOutdoor = '<div class="pane-affix__catalog-column is-2">\
                                <a class="pane-affix__catalog-item item-texture is-shrink" id="freeRoomBtn">\
                                    <div class="item-texture__image">\
                                        <img src="icon/daikin_outdoor_cv.png" id="daikin_outdoor" alt="">\
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
                                                <img src="' + e.target.result + '" alt="">\
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
            let pre_install_photos_c = $('#pre_install_photos_c').val();

            saveAs(blob, name);
            let dataURL = $('#c').get(0).toDataURL();
            $('#editor, #editorControls').addClass('hidden-opacity');
            $('.loading_send').show();
            $.ajax({
                type: "POST",
                url: "APIUploadToFolderAndGeneratePDF.php",
                data: {
                    base64Img: dataURL,
                    name: name,
                    quote_id: quote_id,
                    pre_install_photos_c: pre_install_photos_c
                },
                success: function(result)
                {
                    downloadPDF(result, name);
                    console.log('done'+result );
                    $('#editor, #editorControls').removeClass('hidden-opacity');
                    $('.loading_send').hide();
                },
            });
        }
        )
    }

    function downloadPDF(pdf, name) {
        const linkSource = `data:application/pdf;base64,${pdf}`;
        const downloadLink = document.createElement("a");
        const fileName = 'Pure-Electric-Design-Daikin.pdf';
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
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

$(document).ready(function(){
    $(document).keydown(function(e){
      if(e.which === 16){
        $('#wrapCanvas').off('mousedown', mouseDownHandler);
      }     
    });
  }); 
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
canvas.selection = true;
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
        myJson = canvas.toJSON(['setcontrolsVisibility', "id", "transparentCorners", "centeredScaling", 'height', 'width']);
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
        if(this.quantity === 0){
            dialog(`Limited Quantity!\nPlease Delete Components`);
        }        
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
                    "id": this.id,
                    'left': l,
                    'top': t,
                    "transparentCorners": false,
                    "centeredScaling": true,
                    'is_clone' : false
                });
                
                           
                canvas.add(oImg);                
                oImg.line1 = line1;
                oImg.line2 = line2;
                
                UpdateModif(true);
               
                return oImg;                
                
            });
        }           
    }
   
    copy_and_paste() {
    //     if(this.quantity > 0 && canvas.getActiveObject().id === this.id){
        // let object = fabric.util.object.clone(canvas.getActiveObject());
        // object.set("top", object.top+5);
        // object.set("left", object.left+5);
        // canvas.add(object);
    //             let set_line_1;
    //             let set_line_2;
    //             if(canvas.getActiveObject().line1 !== null && canvas.getActiveObject().line1 !== undefined){
    //                 let get_line_1 = canvas.getActiveObject().line1;
    //                 set_line_1 = makeLine([cloned.left, cloned.top, get_line_1.x2, get_line_1.y2]);
                   
    //                 let lca;
    //                 cloned.set({
    //                     line1 : null,
    //                     line2 : set_line_1
    //                 });

    //                 for(let i = arrayItems.length - 1; i >= 0; i--){
    //                     if(arrayItems[i].fill === 'blue'){
    //                         arrayItems.splice(arrayItems.lastIndexOf(arrayItems[i]), 0, set_line_1);
    //                         lca = arrayItems.lastIndexOf(arrayItems[i]);
    //                     }
                        
    //                     if(arrayItems[i] !== undefined && arrayItems[i].id !== cloned.id && arrayItems[i].is_clone === false){
    //                         arrayItems[i].set({
    //                             line1 : set_line_1
    //                         });
    //                     }
    //                 }   
    //             }
                
    //             if(canvas.getActiveObject().line2 !== null && canvas.getActiveObject().line2 !== undefined){
    //                 let get_line_2 = canvas.getActiveObject().line2;
    //                 set_line_2 = makeLine([get_line_2.x1, get_line_2.y1, cloned.left, cloned.top]);                    

    //                 let lca;
    //                 cloned.set({
    //                     line1 : set_line_2,
    //                     line2 : null
    //                 });
    //                 // for(let i = arrayItems.length - 1; i >= 0; i--){
    //                 //     if(arrayItems[i].fill === 'blue'){
    //                 //         console.log(arrayItems.indexOf(arrayItems[i]))
    //                 //         // arrayItems.splice(arrayItems.lastIndexOf(arrayItems[i]), 0, set_line_2);
    //                 //         lca = arrayItems.lastIndexOf(arrayItems[i]);
    //                 //     }
    //                     // if(arrayItems[i] !== undefined && arrayItems[i].id !== cloned.id && arrayItems[i].is_clone === false){
    //                     //     arrayItems[i].set({
    //                     //         line2 : set_line_2
    //                     //     })
    //                     // }
    //                 // };
                    
    //             }
    //             canvas.add(cloned);
    //         });
    //         UpdateModif(true);
    //         this._OnAdd();
    //     }
        
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
            this.quantity = this.count;
        }
    }

    delete() {
        header_disable();
        if (canvas.getActiveObject() && this.id === canvas.getActiveObject().id) {
            if(this.quantity < this.count){
                this._OnDel();
            }            
            for(let i = arrayItems.indexOf(canvas.getActiveObject()); i >= 0; i--){
                if(canvas.getActiveObject() !== null && (canvas.getActiveObject().line1 !== undefined || canvas.getActiveObject().line2 !== undefined)){
                    if(arrayItems[i].id === undefined){
                        let validChain = arrayItems.indexOf(canvas.getActiveObject()) - arrayItems.indexOf(arrayItems[i]);
                        if(validChain === 1 || validChain === 2){
                            arrayItems.splice(arrayItems.indexOf(arrayItems[i]), 1);
                            canvas.remove(canvas.getActiveObject());
                            $(".deleteBtn").remove();          
                            canvas.discardActiveObject();
                            canvas.renderAll();
                            return arrayItems;
                        }
                    }
                } else {
                    canvas.remove(canvas.getActiveObject());
                    $(".deleteBtn").remove();          
                    canvas.discardActiveObject(); 
                    canvas.renderAll();
                }                
            }
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
        top: coords !== undefined ? coords[0] : 0, 
        left: coords !== undefined ? coords[1] : 0,
        fill: 'blue',
        stroke: 'blue',
        strokeWidth: 5,
        selectable: true,
        evented: false,
        dirty: false
    });
}

let daikin_Us7 = new Daikin(0, 4,"daikin-us7");
let daikin_OutDoor = new Daikin(0, 4,"daikin_outdoor");

// add delete button
let arrayItems = canvas._objects;
$(document).on('click', ".deleteBtn", (e)=>{
    daikin_Us7.delete();
}
);

// $(document).on('click',".deleteBtn",()=>{daikin_Nexura.delete()});
// $(document).on('click',".deleteBtn",()=>{daikin_Temp.delete()});

$(document).on('click', ".deleteBtn", (e)=>{
    daikin_OutDoor.delete();
}
);


$(document).on('click', ".deleteBtn", (e)=>{
    if(canvas.getActiveObject()){
        canvas.remove(canvas.getActiveObject());
        $(".deleteBtn").remove();
    }
    
});
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
    UpdateModif(false);
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

var multiSelection = [];
canvas.on('selection:created', selected => {
  if(this.multiSelect) {
    multiSelection.push(selected);
    var groupSelection = new fabric.ActiveSelection(multiSelection)
    canvas.setActiveObject(groupSelection);
  }
});

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
    let l = canvas.width / 2;
    let t = canvas.height / 2;
    line.push(makeLine([l, t, l, t]));
    if(line.length > 1){
        line.shift()
    }
    if(daikin_Us7.quantity !== 0 && daikin_OutDoor.quantity !== 0){
        // for(let x in line){
            daikin_OutDoor.addImg($("#daikin_outdoor")[0], null, line[0]);
            
            daikin_Us7.addImg($("#daikin-us7")[0], line[0], null);            
            canvas.add(line[0]);                                 
        // }
    } else if(daikin_Us7.quantity !== 0){
        daikin_Us7.addImg($("#daikin-us7")[0]);
    } else if(daikin_OutDoor.quantity !== 0){
        daikin_OutDoor.addImg($("#daikin_outdoor")[0]);
    }
    else {
        daikin_Us7.updateQuantity();
    }
}
);

$("#daikin-option").on('click', '#daikin_outdoor', ()=>{
    
    let l = canvas.width / 2;
    let t = canvas.height / 2;
    line.push(makeLine([l, t, l, t]));    
    if(line.length > 1){
        line.shift();
    }
    if(daikin_Us7.quantity !== 0 && daikin_OutDoor.quantity !== 0){
        for(let x in line){        
            daikin_OutDoor.addImg($("#daikin_outdoor")[0], line[x], null);
            
            daikin_Us7.addImg($("#daikin-us7")[0], null, line[x]);
            canvas.add(line[x]);
        }
    } else if(daikin_Us7.quantity !== 0) {
        daikin_Us7.addImg($("#daikin-us7")[0]);
    } else if(daikin_OutDoor.quantity !== 0) {
        daikin_OutDoor.addImg($("#daikin_outdoor")[0]);
    } else {
        daikin_OutDoor.updateQuantity();
    }
}
);
//end add component

//add floor plan function

let img;
let sizeOfcanvasBg;

$('#floor-plan-option').on('click', '#FloorItems', (e) =>{

    img = e.target
    canvas.setBackgroundImage(img.src, canvas.renderAll.bind(canvas), {
        // Needed to position backgroundImage at 0/0
        originX: 'left',

        originY: 'top'
    }).setDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight
    }).setZoom(1);
    
    
    // getBgImage(true);

    // $(".canvas-container")[0].style.margin = "auto";
    // $(".canvas-container")[0].style.top = "10%";
    UpdateModif(true);
});

// Copy and Paste
$('#copy').on('click',() =>{
	// clone what are you copying since you
	// may want copy and paste on different moment.
	// and you do not want the changes happened
    // later to reflect on the copy.
    daikin_Us7.copy_and_paste();
});

$('#copy').on('click', () =>{
    daikin_OutDoor.copy_and_paste();
});

//End Copy and Paste

$("#zoomIn").click(()=>{
    if(canvas.backgroundImage !== null){
        canvas.discardActiveObject();
        $(".deleteBtn").remove();
        
        canvas.setZoom(canvas.getZoom() * 1.1);
        canvas.setHeight(Math.round(canvas.getHeight() * 1.1));
        canvas.setWidth(Math.round(canvas.getWidth() * 1.1));
        // canvas.setDimensions({ 
        //     width : canvas.getWidth(),
        //     height : canvas.getHeight(),
        //     originX: 'left',
        //     originY: 'top'
        // })
        // console.log(canvas.getHeight(), canvas.getWidth());
        canvas.renderAll();
        UpdateModif(true);
    }    
});

$("#zoomOut").click(()=>{
    if(canvas.backgroundImage !== null){
        canvas.discardActiveObject();
        $(".deleteBtn").remove();
        
        canvas.setZoom(canvas.getZoom() / 1.1);
        canvas.setHeight(Math.round(canvas.getHeight() / 1.1));
        canvas.setWidth(Math.round(canvas.getWidth() / 1.1));
        // canvas.setDimensions({
        //     width : canvas.getWidth(),
        //     height : canvas.getHeight(),
        //     originX: 'left',
        //     originY: 'top'
        // })
        // console.log(canvas.getHeight(), canvas.getWidth());
        canvas.renderAll();
        UpdateModif(true);
    }
});

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
    
    header_disable();
}

$('#undoBtn').click(()=>{

    if(state[state.length - 1 - mods - 1] !== undefined){
        currState = state[state.length - 1 - mods].height;
        heig = state[state.length - 1 - mods - 1].height;
        widt = state[state.length - 1 - mods - 1].width;        
        canvas.setHeight(heig);
        canvas.setWidth(widt);
        value = currState / heig;

        canvas.setZoom(canvas.getZoom() / value);
    }
   

    if (mods < state.length && (state.length - 1 - mods - 1) >= 0) {
        canvas.clear().renderAll();
        
        canvas.loadFromJSON(state[state.length - 1 - mods - 1]);
        canvas.renderAll();
        // console.log("geladen " + (state.length - 1 - mods - 1) );
        // console.log("state " + state.length);
        
        // console.log(state[state.length - 1 - mods - 1])
        mods += 1;
        
        on_undo(true)
        // console.log("mods " + mods);
        
    }
    if((state.length - 1 - mods - 1) < 0){
        canvas.loadFromJSON(state[1]);
    }
    undo_redo_enable(state, mods);
    modifyCanvas();
    // console.log(heig, widt);
    canvas.renderAll();
}
    
    
)

$('#redoBtn').click(()=>{
    
    // let heig = state[state.length - 1 - mods + 1].height;
    // let widt = state[state.length - 1 - mods + 1].width;
    
    // canvas.setHeight(heig);
    // canvas.setWidth(widt);
   

    
    if (mods > 0) {
        canvas.clear().renderAll();
        if(state[state.length - 1 - mods] !== undefined){
            let currState = state[state.length - 1 - mods].height;
            let heig = state[state.length - 1 - mods + 1].height;
            let widt = state[state.length - 1 - mods + 1].width;    
            canvas.setHeight(heig);
            canvas.setWidth(widt);
            let value = currState / heig;
    
            canvas.setZoom(canvas.getZoom() / value);
            // console.log("geladen " + (state.length - 1 - mods + 1));
            // console.log(heig, widt);
        }
        
        canvas.loadFromJSON(state[state.length - 1 - mods + 1]);
        canvas.renderAll();
        // console.log("geladen " + (state.length-1-mods+1));
        // console.log(state[state.length - 1 - mods + 1])
        mods -= 1;
        // console.log("state " + state.length);
        // console.log("mods " + mods);
        
    }
    if((state.length - 1 - mods + 1) <= 0){
        canvas.loadFromJSON(state[1])
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