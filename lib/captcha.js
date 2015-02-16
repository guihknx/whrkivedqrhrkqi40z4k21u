var Canvas = require('canvas');

module.exports = function(req, res, next){

    var colors = [
        '#1abc9c',
        '#e74c3c',
        '#d35400',
        '#3498db',
        '#7f8c8d'
    ];
    var color = colors[Math.floor(Math.random() * colors.length)];
    var canvas = new Canvas(250, 150);
    var ctx = canvas.getContext('2d');
    ctx.antialias = 'gray';
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 250, 150);
    ctx.fillStyle = color;
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#222';
    ctx.font = '50px sans';

    for (var i = 0; i < 2; i++) {
        ctx.moveTo(20, Math.random() * 150);
        ctx.bezierCurveTo(80, Math.random() * 150, 160, Math.random() * 150, 230, Math.random() * 150);
        ctx.stroke();
    }

    var text = ('' + Math.random()).substr(3, 6);

    for (i = 0; i < text.length; i++) {
        ctx.setTransform(Math.random() * 0.5 + 1, Math.random() * 0.4, Math.random() * 0.4, Math.random() * 0.5 + 1, 30 * i + 20, 100);
        ctx.fillText(text.charAt(i), 0, 0);
    }

    req.session.captcha = text;
    console.log(req.session)
    canvas.toBuffer(function(err, buf) {
        res.end(buf);
    });
};
