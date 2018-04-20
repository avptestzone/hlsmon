import './js/flashlsAPI.js';
import './js/libs/js2flash.js';
import './js/libs/classList.min.js';
import './js/jquery.min.js';
import './js/bootstrap.min.js';
import './js/libs/ParsedQueryString.js';
import './js/libs/JSLoaderFragment.js';
import './js/libs/JSLoaderPlaylist.js';
import channelObject from './js/channelObject.js';
import axios from 'axios';


axios.get(`/copy/query/build_panel.php${location.search}`)
.then(function (response) {
    console.log(response.data[1])
    //document.querySelector(".middle").innerHTML=response.data;
})
.catch(function (error) {
    console.log(error);
});
