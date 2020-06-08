// ==UserScript==
// @name         1337x Media buttons for TV shows
// @namespace    https://github.com/kubar123/Scripts
// @version      0.1
// @description  Add previous/next buttons to the top of the page. Makes switching between episodes easier
// @author       kubar123
// @match        https://1337x.to/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var seasonNo, episodeNo;
    var showStr;

    // ---- ADD DATA TO BOX ----
    grabDataFromSite();
    addDataToWindow();

    return;




    function addDataToWindow(){
        //Create buttons
        // ------- EIPSODES ---------
        var MainLinkDown=makeTvLink(showStr,parseInt(episodeNo)-1,seasonNo);
        var buttonData="<button onclick='location.href=\"https://1337x.to/search/"+MainLinkDown+"/1/\"'>Previous</Button>__"
        var MainLinkUp=makeTvLink(showStr,parseInt(episodeNo)+1,seasonNo);
        buttonData+="<button onclick='location.href=\"https://1337x.to/search/"+MainLinkUp+"/1/\"'>Next</Button> | ~~ ";

        // ---------- SEASONS ---------
        var mainLinkDownS=makeTvLink(showStr,episodeNo,parseInt(seasonNo)-1);
        buttonData+="|<button onclick='location.href=\"https://1337x.to/search/"+mainLinkDownS+"/1/\"'>Previous Season</Button> |";
        var mainLinkUpS=makeTvLink(showStr,episodeNo,parseInt(seasonNo)+1);
        buttonData+="<button onclick='location.href=\"https://1337x.to/search/"+mainLinkUpS+"/1/\"'>Next Season</Button>";



        //grab the top box, append data to it
        $(".box-info").before().prepend(buttonData);


    }

    function grabDataFromSite(){

        //get search from site
        var searchTerm=$(".box-info-heading :contains('Searching for:')").text();
        searchTerm=searchTerm.substr(2+searchTerm.indexOf(":"));
        searchTerm=searchTerm.substr(0,searchTerm.indexOf(":")-3);


        //console.log(searchTerm);

        //find 'S**E**'
        var reg=/S\d\dE\d\d/ig;
        var seasonEpTerm= searchTerm.match(reg).toString();

        //get the TV Show name -- remove matched string
        showStr=searchTerm.replace(reg,"");
        console.log(showStr);

        //find season / episode numbers
        // -- [0] = season [1] = episode        
        var reg2=/\d\d/ig;
        var epSeasonInfo=seasonEpTerm.match(reg2);
        seasonNo=epSeasonInfo[0];
        episodeNo=epSeasonInfo[1];

        console.log(epSeasonInfo.toString());
        return

    }

    function makeTvLink(showN, epN, sN){

        epN=parseInt(epN);
        //add '0' before ep name to keep format (S**E**)
        if(epN<=9){
            epN="0"+epN;
        }

        //make the main link
        var mainLink=showN+" S"+sN+"E"+epN;
        return mainLink;
    }


})();