<html lang="en">
<?php header('Access-Control-Allow-Origin: http://new.suitecrm-pure.com/'); ?>

<head>
    <title>Daikin Design Tool By Pure Electric</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">


    <link rel="icon" type="image/png" href="icon/logo_pure_icon.png" />

    <link rel="stylesheet" type="text/css" href="css/util.css">
    <link rel="stylesheet" type="text/css" href="css/style.css">
    <link rel="stylesheet" type="text/css" href="lib/jquery-ui-1.12.1/jquery-ui.css">


</head>

<body>
    <div class="wrapper">
        <input type="hidden" id="quote_id" value="">
        <input type="hidden" id="pre_install_photos_c" value="">

        <div class="b-page__header">
            <header class="b-header">
                <div class="b-header__left">
                    <div class="b-header__item b-header__undo is-disabled" id="undoBtn" title="UNDO" mode="undo" data-modes="editor noauth">
                        <span class="b-icon b-header__icon">
                            <img src="icon/undo.png" height="100%" alt="">
                        </span>
                    </div>
                    <!-- is-disabled -->
                    <div class="b-header__item b-header__redo is-disabled" id="redoBtn" title="REDO" mode="redo" data-modes="editor noauth">
                        <span class="b-icon b-header__icon">
                            <img src="icon/redo.png" height="100%" alt="">
                        </span>
                    </div>
                    <div class="b-header__item b-header__clear" id="clear" title="CLEAR" mode="clear" onclick="" data-modes="editor noauth">
                        <span class="b-icon b-header__icon">
                            <img src="icon/clear.png" height="100%" alt="">
                        </span>
                    </div>
                    <div class="b-header__item b-header__rotate_left is-disabled" id="rot_lef" title="Rotate Left" mode="Rotate Left" data-modes="editor noauth">
                        <span class="b-icon b-header__icon">
                            <img src="icon/rr_15.png" height="100%" alt="">
                        </span>
                    </div>
                    <div class="b-header__item b-header__rotate_right is-disabled" id="rot_rig" title="Rotate Right" mode="Rotate Right" data-modes="editor noauth">
                        <span class="b-icon b-header__icon">
                            <img src="icon/rl-15.png" height="100%" alt="">
                        </span>
                    </div>
                    <div class="b-header__item b-header__rotate_90deg_left is-disabled" id="rot_90_lef" title="Rotate 90 Degree Left" mode="Rotate 90 Degree Left" data-modes="editor noauth">
                        <span class="b-icon b-header__icon">
                            <img src="icon/rl_90.png" height="100%" alt="">
                        </span>
                    </div>
                    <div class="b-header__item b-header__rotate_90deg_right is-disabled" id="rot_90_rig" title="Rotate 90 Degree Right" mode="Rotate 90 Degree Right" data-modes="editor noauth">
                        <span class="b-icon b-header__icon">
                            <img src="icon/rr_90.png" height="100%" alt="">
                        </span>
                    </div>
                    <div class="b-header__item b-header__copy is-disabled" id="copy" title="Copy and Paste" mode="Copy and Paste" data-modes="editor noauth">
                        <span class="b-icon b-header__icon">
                            <img src="icon/copy.png" height="100%" alt="">
                        </span>
                    </div>
                </div>
                <div class="b-header__center">
                    <div class="b-header__switch">
                        <div class="b-switch js-switch">
                            <div class="b-switch__item js-switch-item" mode="view3d">
                                <img src="icon/logoPure.png" height="100%" alt=""><span style="margin-left: 10px">Pure
                                    Electric</span>
                            </div>

                            <!-- <div class="b-switch__item js-switch-item" mode="view3d">
                                <img src="icon/Daikin_logo_white_background.png" height="100%" alt="">
                            </div> -->

                        </div>
                    </div>
                </div>
                <div class="b-header__right">
                    <div class="b-header__item has-dropdown dropdown is-hover-open is-default is-top-right"  
                        data-modes="editor">
                        <span class="b-icon b-header__icon">
                            <img src="icon/download.png" height="100%" alt="">
                        </span>
                        <div class="dropdown__content">
                            <div class="dropdown__menu">
                                <a class="dropdown__item" id="save" mode="print">Print</a>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </div>
        <div class="b-page__editor" id="editor">
        
            <div class="workArea" id="wrapCanvas">

                <canvas id="c"></canvas>
            </div>
        </div>
        <div id="editorControls"  >
            <div class="pane-point">
                <button class="pane-point__button pane-point__button--enhance" mode="zoomIn" id="zoomIn">
                    <span class="b-icon is-24">
                        <img src="icon/plus.png" alt="">
                    </span>
                </button>
                <button class="pane-point__button pane-point__button--reduce" mode="zoomOut" id="zoomOut">
                    <span class="b-icon is-24">
                        <img src="icon/minus.png" alt="">
                    </span>
                </button>
            </div>

            <div class="pane-nav js-pane-nav" id="leftPanel" data-modes="editor|noauth">

                <div class="pane-nav__item js-pane-nav-item is-selected" data-href="floor-plan-option" content="1" data-id="1"
                    data-type="floor-plan-option">
                    <span class="pane-nav__item-icon">
                        <img src="icon/floor-plan.png" alt="">
                    </span>
                </div>
                <div class="pane-nav__item js-pane-nav-item" data-href="daikin-option" content="4" data-id="0"
                    data-type="daikin-option">
                    <span class="pane-nav__item-icon">
                        <img src="icon/air.png" alt="">
                    </span>

                </div>
            </div>
            <div id="daikin-option" class="pane-affix pane-affix--catalog js-pane-affix" data-target="daikin">
                <div class="pane-affix__container">
                    <div class="pane-affix__header">
                        <div class="pane-affix__header-title js-pane-affix-link" data-href="construction">
                            <div class="pane-affix__header-title-label">Daikin Type</div>
                        </div>
                        <div class="pane-affix__header-close js-pane-affix-close"><span class="b-icon is-24">
                                <img style="width: 25px;" src="icon/close.png" alt="">
                        </div>
                    </div>
                    <div class="pane-affix__content pane-affix__content--type-catalog">
                        <div class="pane-affix__catalog" id="daikinItems">
                            <!-- Add Daikin Devices Here -->

                        </div>
                    </div>
                </div>
            </div>

            <div id="floor-plan-option" class="pane-affix pane-affix--catalog js-pane-affix" data-target="floor-plan">
                <div class="pane-affix__container">
                    <div class="pane-affix__header">
                        <div class="pane-affix__header-title js-pane-affix-link" data-href="construction">
                            <div class="pane-affix__header-title-label">Floor Plan</div>
                        </div>
                        <div class="pane-affix__header-close js-pane-affix-close"><span class="b-icon is-24">
                            <img style="width: 25px;" src="icon/close.png" alt="">
                        </div>
                    </div>
                    <div class="pane-affix__content pane-affix__content--type-catalog">
                        <div class="pane-affix__catalog" id="FloorItems">
                            <!-- Add Plan Floor -->
                        </div>
                    </div>
                    <div class="pane-floor_upload-file">
                        <form id="uploadFloor" action method="POST" enctype="multipart/form-data">
                            <div class="upload-btn-wrapper">
                                <button class="btn">Upload</button>
                                <input type="file" id="area-upload" name="floor_image[]" accept="image/*" multiple />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="loading">
        <!-- <img src="icon/loading.svg" alt=""> -->
        <img src="icon/upload.gif" alt="" style="width: 300px">
        <h3>Preparing Daikin Option</h3>
    </div>
    <div class="loading_send none">
        <div class="background-loading"></div>
        <div class="content_loading">
            <img src="icon/loading.svg" alt="">
            <!-- <div id="lottie"></div> -->
            <h3>Downloading PDF</h3>
        </div>
    </div>
    <div id='modal_dialog'>
        <div class='message'></div>
    </div>
    <script src="js/jquery-3-5-1.js"></script>    
    <script src="js/FileSaver.js" type="text/javascript"></script>
    <script src="js/fabric.js" type="text/javascript"></script>
    <script src="lib/jquery-ui-1.12.1/jquery-ui.js" type="text/javascript"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.7.3/lottie.min.js" integrity="sha512-35O/v2b9y+gtxy3HK+G3Ah60g1hGfrxv67nL6CJ/T56easDKE2TAukzxW+/WOLqyGE7cBg0FR2KhiTJYs+FKrw==" crossorigin="anonymous"></script>
    <script src="js/main.js" type="text/javascript"></script>
</body>
</html>