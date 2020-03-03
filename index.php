<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CANVAS</title>
    <link rel="stylesheet" type="text/css" href="assets/css/canvas.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.0/jquery-ui.min.js"></script>
    <script src="assets/js/mootools-yui-compressed.js"></script>
</head>
<body>
    <p>Drag images from blue toolbar onto red canvas</p>

    <div id="toolbar">
        <img id="img1" draggable="true" ondragstart="drag(event)" width="78px" height="27px" src="images/logo.png"><br>
        <img id="img2" draggable="true" ondragstart="drag(event)" width="80%" height="20%" src="images/Daikin_IAC-1.5hp_R32.png"><br>
        <img id="img3" draggable="true" ondragstart="drag(event)" width="80%" height="20%" src="images/daikin-inverter-air-conditioner-1.5hp-R32.png"><br>
        <img id="img4" draggable="true" ondragstart="drag(event)" width="78px" height="27px" src="images/logo.png">
        <!-- <img id="img2" class="tool" draggable="true" ondragstart="drag(event)" width=60 height=24 src="Daikin_IAC-1.5hp_R32.png"> -->
       
    </div>
    <div id="ImagesLayOut">
    <canvas id="canvas" ondrop="drop(event)" ondragover="allowDrop(event)"></canvas>
    </div>

    <div id="mySidenav" class="sidenav">
    </div>

    <div id="BtnGroup">
        <!-- <span style="cursor:pointer;" onclick="openNav()">&#9776; Crawled Images</span> -->
        <form runat="server" >
            <input type='file' id="imgInp" accept="image/jpeg, image/png, image/jpg"/>
            <img id="layout" class="layout" src="images/Draft_layout_daikin_US7_x6.png" style="display: none">
            <!-- <img class="layout" src="#" alt="your image" /> -->
        </form>
        <a id="download" download="download.png"><button type="button" onclick="convertCanvasToImage()" >Download</button></a>
        <button type="button" onclick="saveImage()">Save</button>
        <button type="button" onclick="loadImage()">Load Images</button>

    </div>

	<script src="assets/js/canvas.js"></script>
</body>
</html>