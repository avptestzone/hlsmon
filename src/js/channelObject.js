var channelObject = function (channelName, channelUrl) {
    this.name = channelName;
    this.url = channelUrl;
    this.status = 'init';
    this.currentlevel=0;

    this.ready = function(flashTime) {  
        this.flashPingDate = flashTime;
        this.jsPingDate = new Date();
        this.api = new flashlsAPI(getFlashMovieObject(this.name + "_movie"));
        this.status = 'ready';
        //this.api.playerSetLogDebug(1);
        onReadyChannel(this.name);
    }

    this.videoSize = function(width, height) {
        var event = {time : new Date() - this.jsLoadDate, type : "resize", name : width + 'x' + height};
        this.events.video.push(event);
    }

    this.complete = function() {
        appendLog(this.name, "playback completed");
    }

    this.error = function(code, url, message) {
        document.getElementById(this.name).classList.add('red');
        eventsDiv(this.name).innerHTML = 'status: ERROR';
        appendLog(this.name, "Ошибка мониторинга: " + message);
        alarm(this.name);
    }

    this.manifest = function(duration, levels_, loadmetrics) {
        appendLog(this.name, "Старт мониторинга: playlist загружен");
        //duration.toFixed(2)
        this.levels = levels_;
        this.api.play(-1);
        this.api.volume(0);
        eventsDiv(this.name).innerHTML = 'status: MANIFEST_LOADED';
        onManifestLoaded(this.levels,this.name); 
    }
    
    this.load = function (u=0) {
        if(u){
            this.url = u;    
        }
        this.api.load(this.url);
    }

    this.levelLoaded = function(loadmetrics) {
        var oldLevel=this.currentlevel;
        this.currentlevel=this.api.getCurrentLevel();
        onLevelLoaded(this.name,this.currentlevel,oldLevel);
    }

    this.state = function(newState) {
        eventsDiv(this.name).innerHTML = 'status: ' + newState;
        if(newState=='PLAYING'){
            if(this.status=='ready'){
                appendLog(channelName, "Старт мониторинга: канал запущен");
                muteButton(channelName).addEventListener('click',function(event){
                    toggleSound(this);   
                });
            }
            this.status = 'playing';
            document.getElementById(channelName).classList.add('green');
        }
        if(newState=='PLAYING_BUFFERING') 
            document.getElementById(channelName).classList.remove('green');
    }

    this.seekState = function(newState) {}

    this.switch = function(newLevel) {

    }

    this.audioLevelLoaded = function(loadmetrics) {}
    
    this.fragmentLoaded = function(loadmetrics) {}
  
    this.fragmentPlaying = function(playmetrics) {}

    this.position = function(timemetrics) {}

    this.audioTracksListChange = function(trackList) {}

    this.audioTrackChange = function(trackId) {}

    this.id3Updated = function(ID3Data) {} 
  
    this.fpsDrop = function(level) {}

    this.fpsDropLevelCapping  = function(level) {}

    this.fpsDropSmoothLevelSwitch = function() {}

   // this.requestPlaylist = JSLoaderPlaylist.requestPlaylist.bind(JSLoaderPlaylist),
    //this.abortPlaylist = JSLoaderPlaylist.abortPlaylist.bind(JSLoaderPlaylist),
   // this.requestFragment = JSLoaderFragment.requestFragment.bind(JSLoaderFragment),
   // this.abortFragment = JSLoaderFragment.abortFragment.bind(JSLoaderFragment)

    function onReadyChannel(channelName){
        eventsDiv(channelName).innerHTML = 'status: READY';
        logButton(channelName).addEventListener('click',function(event){
            toggleLog(this);          
        });
        checkOtherObjects();        
    }

    function onManifestLoaded(levels,channleName) {
        var buttonTxt;
        for (index in levels){
            if(index=='fixed' || index=='length') continue;
            buttonTxt='Профиль_'+(+index+1)+' ('+Math.floor(levels[index].bitrate/1000)+' Kbit/s)';
            levelsDiv(channelName).appendChild(profileButton(channleName+'_'+index,buttonTxt));
            levelsDiv(channelName).innerHTML+='<br/>';
        }
        levelsButton(channelName).addEventListener('click',function(event){
            toggleLevels(this);           
        });
    }

    function onLevelLoaded(channleName,currentlevel,oldLevel){
        if (currentlevel!=oldLevel){
            var profile=currentlevel+1;
            appendLog(channelName, "Текущий профиль: "+profile);
        }
        var profileButtons=levelsDiv(channelName).getElementsByTagName('button');
        for (let i=0;i<profileButtons.length;i++){
            var id=profileButtons[i].id.slice(-1);
            if(profileButtons[i].classList.contains('btn-success') && id!=currentlevel){
                profileButtons[i].classList.toggle('btn-success');
                profileButtons[i].classList.toggle('btn-primary');
            }
            if(id==currentlevel && profileButtons[i].classList.contains('btn-primary')){
                profileButtons[i].classList.toggle('btn-primary');
                profileButtons[i].classList.toggle('btn-success');            
            }
        }
    }
}
