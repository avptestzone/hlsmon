const ORDINARY_START_DELAY = 1500;
const ROUND_ROBIN_DELAY = 10000;

var alarmSound = new Audio("files/alarm.mp3");

window.onload = function () { }

window.onbeforeunload = function (e) { 
    var e = e || window.event; 
    if (e) {
        stopMon();  
    } 
}

function channelDiv(button) {
    var channel = button;
    while (!channel.classList.contains('channel')){
        channel=channel.parentNode;      
    }
    return channel;
}

function logDiv(id) { return document.querySelector("#"+id+" .log");}
function eventsDiv(id) { return document.querySelector("#"+id+" .events");}
function levelsDiv(id) { return document.querySelector("#"+id+" .levels");}
function panelDiv(id) { return document.querySelector("#"+id+" .panel");}
function muteButton(id) { return document.querySelector("#"+id+" .mute");}
function logButton(id) { return document.querySelector("#"+id+" .log_button");}
function levelsButton(id) {return document.querySelector("#"+id+" .levels_button");}


function ajax (method,url,callback,data) {
    var request;
    try {
        request = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            request = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (E) {
            request = false;
        }
    }
    if (!request && typeof XMLHttpRequest!='undefined') {
        request = new XMLHttpRequest();
    }
    if (!request) alert("Error initializing XMLHttpRequest!");    
    request.open(method,url,true);
    request.onreadystatechange = function () {
        if (request.readyState == 4){
            callback.call(request.responseText);
        }
    }
    if (method=='POST') {
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    request.send(data);    

}

function rrToggle(button){
    if (button.classList.contains('active')){
        button.innerHTML='Off';
    }
    else {
        button.innerHTML='On';
    }
}

function appendLog(channel,note) {
    var url = `${location.origin}/query/append_log.php?channel=${channel}&note=${note}`;
    ajax ('GET',url,function(){});
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function load(channel) {
    channel.api.stop();
    channel.levels = null;
    channel.load();
    appendLog(channel.name, "Старт мониторинга: загрузка URL " + channel.url);
}

function startMon() {
    if(document.querySelector('#rr').classList.contains('active')){
        var numberOfChannelsToMon=Math.ceil(channels.length/2);
        if (numberOfChannelsToMon>=channels.length){
            ordinaryStart();
        }
        else {
            roundRobinStart(numberOfChannelsToMon);    
        }
    }
    else {
        ordinaryStart();    
    }    
}

async function ordinaryStart(){
    for (let i=0;i<channels.length;i++){
        load(channels[i]); 
        await sleep(ORDINARY_START_DELAY);
    }
}

async function roundRobinStart(n){

    var position=0;
    var mask=new Array(channels.length+1).join('0').split('');
    
    while(position!=n) {
        load(channels[position]);
        mask[position]=1;
        position++; 
        await sleep(ORDINARY_START_DELAY);
        console.log(mask);
    }
    while(1){

        load(channels[position]); 
        mask[position]=1;
        
        if ((position-n)>=0){
            mask[position-n]=0;
            channels[position-n].api.stop();
        }
        else {
            mask[position-n+mask.length]=0;
            channels[position-n+mask.length].api.stop(); 
        }
        
        if (position==mask.length-1){
            position=0;
        }
        else{
            position++;
        }

        await sleep(ROUND_ROBIN_DELAY);
        console.log(mask);
    }

}

function initStartButton(stream) {
    var stream = document.getElementById('stream_button');
    stream.classList.toggle('disabled');
    
    stream.onclick = function() {
        stream.classList.toggle('disabled');
        stream.onclick='';
        startMon();
    }
}

function toggleSound(button) {
    for(let i=0;i<channels.length;i++){
        if(channels[i].name==channelDiv(button).id){
            channelObj=channels[i];
        }
    }
    if (button.classList.contains('on')){
        channelObj.load('http://192.168.2.10/Content/test/Live/Channel(Bridge)/Stream(01)/index.m3u8');
        button.getElementsByTagName('span')[0].className = 'glyphicon glyphicon-volume-off';  
    }
    else {
        channelObj.api.stop();
        button.getElementsByTagName('span')[0].className = 'glyphicon glyphicon-volume-up'; 
    }
    button.classList.toggle('on');
}

function toggleLog (button) {
    var channelName=channelDiv(button).id;
    var log = logDiv(channelName);    
    var url = location.origin + '/query/get_log.php?channel='+channelName; 
    if (!levelsDiv(channelName).classList.contains('hidden')){
        toggleLevels(levelsButton(channelName));  
    }
    ajax ('GET',url,function(){
        button.classList.toggle('pushed');
        if (log.classList.contains('hidden')){
            log.className='log';
            log.innerHTML=this;
        }
        else {
            log.className='log hidden';  
        } 
    });
}

function toggleLevels (button) {
    var channelName=channelDiv(button).id;
    button.classList.toggle('pushed');
    if (!logDiv(channelName).classList.contains('hidden')){ 
        toggleLog(logButton(channelName));  
    }    
    levelsDiv(channelName).classList.toggle('hidden');
}

function changeProfile(pushedButton){
    for(let i=0;i<channels.length;i++){
        if(channels[i].name==channelDiv(pushedButton).id){
            var channelObj=channels[i];
            if(true){}
        }
    }
    var newLevel=pushedButton.id.slice(-1);
    var currentLevel=channelObj.api.getCurrentLevel();
    /* uncomment for deny reloading current level
    if (newLevel==currentLevel) return; */
    channelObj.api.setCurrentLevel(newLevel);
}

function profileButton(id,txt){
    var button = document.createElement('button');
    button.id=id;
    button.type='button';
    button.classList.add('btn');
    button.classList.add('btn-xs');
    button.classList.add('btn-primary');
    button.innerHTML=txt;
    button.setAttribute('onclick','changeProfile(this)');
    return button;
}

function alarm(channel) {
    var count=29;
    var div=document.getElementById(channel);
    alarmSound.play();
    div.classList.remove('green');
    var blink=setInterval(function(){
        if (count<1) clearInterval(blink);
        div.classList.toggle('red');
        count=count-1;
    },500);

}

function checkOtherObjects(){
    for(let i=0;i<channels.length;i++){
        if(channels[i].status!='ready') return;
    } 
    initStartButton();
}

function stopMon(){
    for(let i=0;i<channels.length;i++){
        if (channels[i].status=='playing'){
            appendLog(channels[i].name,'Мониторинг остановлен');
        }
    }    
}

function showInputForWindowName() {
    var input=document.querySelector('.window_name input');
    var button=document.querySelector('.add_del_buttons .add');
    input.style.width='200px';
    input.style.visibility='visible';
    button.setAttribute('onclick','addNewWindow()');
}

function addNewWindow(){
    let name=document.querySelector('.window_name input').value;
    if(!name) return;
    let url = location.origin + '/query/add_new_window.php?name='+name;
    ajax ('GET',url,function(){document.location.replace(location.origin + '/?window='+this);}); 
}

function deleleCurrentWindow() {
    let a=document.querySelectorAll('.control a');

    for(let i=0;i<a.length; i++) {
        if (a[i].classList.contains('disabled')){
            var id=a[i].id;
        }
    }
    let url = location.origin + '/query/delete_window.php?id='+id;
    ajax ('GET',url,function(){document.location.replace(location.origin);}); 
}