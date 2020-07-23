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
                                                <img src="icon/daikin-us7.jpg" alt="">\
                                            </div>\
                                        </a>\
                                        <span><strong>'+res['products'][keys[i]]['Product']+'('+res['products'][keys[i]]['Quantity']+'X)</strong></span>\
                                    </div>';
                    var itemDaikinOutdoor = '<div class="pane-affix__catalog-column is-2">\
                                        <a class="pane-affix__catalog-item item-texture is-shrink" id="freeRoomBtn">\
                                            <div class="item-texture__image">\
                                                <img src="icon/daikin_outdoor.png" alt="">\
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
                                                    <img src="'+res[i]+'" alt="">\
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
                                                <img src="'+e.target.result+'" alt="">\
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

})(jQuery);