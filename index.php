<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CANVAS</title>
    <link rel="stylesheet" type="text/css" href="assets/css/canvas.css">
    <script src="assets/js/mootools-yui-compressed.js"></script>
</head>
<body>
    <p>Drag images from blue toolbar onto red canvas</p>
    <img id="layout" src="images/Draft_layout_daikin_US7_x6.png" style="display: none">
    <div id="toolbar">
        <img id="img1" draggable="true" ondragstart="drag(event)" width=61 height=24 src="images/Daikin_IAC-1.5hp_R32.png">
        <!-- <img id="img2" class="tool" draggable="true" ondragstart="drag(event)" width=60 height=24 src="Daikin_IAC-1.5hp_R32.png"> -->
    </div>
    <br>
    <canvas id="canvas" ondrop="drop(event)" ondragover="allowDrop(event)" width=669 height=400></canvas><br>   
    <a id="download" download="download.png"><button type="button" onclick="convertCanvasToImage()">Download</button></a>
	<script src="assets/js/canvas.js"></script>
</body>
</html>
