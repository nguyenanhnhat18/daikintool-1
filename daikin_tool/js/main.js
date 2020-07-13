(function($) {
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

    // var canvasEl = $('#wrapCanvas');

    // // get 2d context to draw on (the "bitmap" mentioned earlier)
    // var ctx = canvasEl.getContext('2d');

    // // set fill color of context
    // ctx.fillStyle = 'red';

    // // create rectangle at a 100,100 point, with 20x20 dimensions
    // ctx.fillRect(100, 100, 20, 20);
    debugger;
    // create a wrapper around native canvas element (with id="c")
    var canvas = new fabric.Canvas('c');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // create a rectangle object
    var rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: 'red',
        width: 20,
        height: 20
    });
    // "add" rectangle onto canvas
    canvas.add(rect);
})(jQuery);