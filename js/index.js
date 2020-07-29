
$(function(){
  var canvas = document.querySelector('#canvas');
  var ctx = canvas.getContext('2d');
  var r = function(deg){
    return Math.PI/180*deg
  }
  var canvasS = 600;
  var row = 15;
  var blockS = canvasS/row;
  var off = blockS/2 + 0.5;
  var jiange = canvasS-blockS;
  var qizir = blockS/2 * 0.8;
  var draw = function(){
    // 横线
    ctx.save()
    ctx.beginPath()
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#523714';
    ctx.translate(off,off)
    for(var i=0;i<row;i++){
      ctx.moveTo(0,0)
      ctx.lineTo(jiange,0)
      ctx.translate(0,blockS)
    }
    ctx.stroke()
    ctx.closePath()
    ctx.restore()
    // 竖线
    ctx.save()
    ctx.beginPath()
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#523714';
    ctx.translate(off,off)
    for(var j=0;j<row;j++){
      ctx.moveTo(0,0)
      ctx.lineTo(0,jiange)
      ctx.translate(blockS,0)
    }
    ctx.stroke()
    ctx.closePath()
    ctx.restore()
    // 小黑点
    var arr = [
      {'x':3.5,'y':3.5},
      {'x':3.5,'y':11.5},
      {'x':11.5,'y':3.5},
      {'x':11.5,'y':11.5},
      {'x':7.5,'y':7.5}
    ];
    $.each(arr,function(k,v){
      ctx.save()
      ctx.beginPath()
      ctx.fillStyle = '#523714';
      ctx.strokeStyle = '#523714';
      ctx.arc(v.x*blockS+0.5,v.y*blockS+0.5,4,0,r(360))
      ctx.fill()
      ctx.stroke()
      ctx.closePath()
      ctx.restore()
    })
  }
  draw()
  var dict = {};
  var qizi;
  var step = 1;
  // 画出棋子
  var drop = function(qizi){
    ctx.save()
    ctx.beginPath()
    // ctx.arc(qizi.x*blockS+off,qizi.y*blockS+off,qizir,0,(Math.PI/180)*360)
    if(qizi.color === 1){
      var imgb = new Image();
      imgb.onload = function(){
        ctx.drawImage(imgb,qizi.x*blockS+2,qizi.y*blockS+2,38,38)
      }
      imgb.src = './image/qizib.png';
      // ctx.fill()
    }else{
      var imgw = new Image();
      imgw.onload = function(){
        ctx.drawImage(imgw,qizi.x*blockS+1,qizi.y*blockS+1,40,40)
      }
      imgw.src = './image/qiziw.png';
      // ctx.fillStyle = '#fff';
      // ctx.strokeStyle = 'black';
      // ctx.fill()
      // ctx.stroke()
    }
    ctx.closePath()
    ctx.restore()
  }
  var flag = true;
  var audiob = $('audio').get(0)
  var audiow = $('audio').get(1)
  // 点击把棋子添加到页面
var click = function(){
  $('canvas').click(function(e){
    var x = Math.floor(e.offsetX/blockS)
    var y = Math.floor(e.offsetY/blockS)
    var color;
    if(dict[x+'-'+y]){
      return;
    }
    dict[x+'-'+y] = true;
    if(flag){
      audiob.play();
      qizi={x:x,y:y,color:1,step:step};
      if(panduan(qizi)){
        $('.zhezhao').show().find('.tips').text('黑棋获胜');
        $('canvas').off()
      }
      flag = false;
    }else{
      audiow.play();
      qizi = {x:x,y:y,color:0,step:step};
      if(panduan(qizi)){
        $('.zhezhao').show().find('.tips').text('白棋获胜');
        $('canvas').off()
      }
      flag = true;
    }
    step += 1;
    dict[x+'-'+y] = qizi;
    drop(qizi)
  })
}
click()
  // 根据坐标判断竖、行、左斜、右斜四个方向的同色棋子数量
  panduan = function(){
    var obj = {};
    var tx,ty,shu = 1,hang = 1,zuoxie = 1,youxie = 1;
    // 遍历dict,把相同颜色的棋子记录在obj里；
    $.each(dict,function(k,v){
      if(v.color === qizi.color){
        return obj[k] = v;
      }
      //  console.log(v.color);
    })
    // 竖
    tx = qizi.x;ty = qizi.y;
    while(obj[tx+'-'+(ty+1)]){
      shu++;ty++;
    }
    tx = qizi.x;ty = qizi.y;
    while (obj[tx+'-'+(ty-1)]) {
      shu++;ty--;
    }
    // 横
    tx = qizi.x ; ty = qizi.y;
    while (obj[(tx+1)+'-'+ty]) {
      hang++;tx++;
    }
    tx = qizi.x;ty = qizi.y;
    while (obj[(tx-1)+'-'+ty]) {
      hang++;tx--;
    }
    // 左斜
    tx = qizi.x ; ty = qizi.y;
    while (obj[(tx+1)+'-'+(ty+1)]) {
      hang++;tx++;ty++;
    }
    tx = qizi.x;ty = qizi.y;
    while (obj[(tx-1)+'-'+(ty-1)]) {
      hang++;tx--;ty--;
    }
    // 右斜
    tx = qizi.x ; ty = qizi.y;
    while (obj[(tx-1)+'-'+(ty+1)]) {
      hang++;tx--;ty++;
    }
    tx = qizi.x;ty = qizi.y;
    while (obj[(tx+1)+'-'+(ty-1)]) {
      hang++;tx++;ty--;
    }

    if(shu >= 5 || hang >= 5 || zuoxie >= 5 || youxie >= 5){
      return true;
    }
  }

  $('.close').click(function(){
    $('.zhezhao').hide()
  })
  $('.zhezhao').click(function(){
    $(this).hide()
  })
  $('.chouse').click(function(){
    return false;
  })
  $('.again').click(function(){
    $('.zhezhao').hide();
    ctx.clearRect(0,0,600,600);
    draw();
    click();
    flag = true;
    dict = {};
    step = 1;
  })
  $('.qipu').click(function(){
    $('.zhezhao').hide();
    $('.save').show();
    ctx.save();
    ctx.font = '18px 微软雅黑';
    for(i in dict){
      if(dict[i].color === 1){
        ctx.fillStyle = '#fff'
      }else{
        ctx.fillStyle = '#000'
      }
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(dict[i].step,(dict[i].x+0.5)*blockS,(dict[i].y+0.5)*blockS);
    }
    ctx.restore()
    var image = $('#canvas').get(0).toDataURL('img/jpg',1);
    $('.save').attr('href',image);
    $('.save').attr('download','qipu.jpg');
  })


  // 背景轮播
  $('.banner img').fadeOut(0).eq(0).fadeIn(0);
  var num = 0;
  function change(){
    num++;
    if(num >= $('.banner img').length){
      num = 0;
    }
    $('.banner img').fadeOut(300).eq(num).fadeIn(300);
  }
  var t = setInterval(change,8000);

  $(".rules").click(function(){
    $('.rule-popup').css({'display':'flex'})
  })

  $(".rule-popup").click(function(){
    $(this).hide()
  })
})
