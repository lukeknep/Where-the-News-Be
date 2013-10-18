var timer;
function setTime(){
    var nd = new Date();
    var h, m, s;
    var time=" ";
    h = nd.getHours();
    m = nd.getMinutes();
    s = nd.getSeconds();
    if (s <=9) s="0" + s;
    if (m <=9) m="0" + m;
    if (h <=9) h="0" + h;
    time+=h+":"+m+":"+s;
    document.getElementById('clock').innerHTML=""+time+"";
    timer = setTimeout("setTime()",1000);
}
//Used to account for DOM not being ready during initial execution
setTimeout("setTime()", 50);
