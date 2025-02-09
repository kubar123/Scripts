// ==UserScript==
// @name         1337x Media buttons for TV shows
// @namespace    https://github.com/kubar123/Scripts
// @version      0.1.1
// @description  Add previous/next buttons to the top of the page. Makes switching between episodes easier
// @author       kubar123
// @match        https://1337x.to/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==

(() => {
    // Your code here...
    let seasonNo;
    let episodeNo;
    let showStr;

    // ---- ADD DATA TO BOX ----
    grabDataFromSite();
    addDataToWindow();
    return;

    function addDataToWindow() {
        //Create buttons
        // ------- EPISODES ---------
        const MainLinkDown = makeTvLink(showStr, Number.parseInt(episodeNo)-1, seasonNo);
        let buttonData = `<button onclick='location.href="https://1337x.to/search/${MainLinkDown}/1/"'>Previous</Button>__`;
        const MainLinkUp = makeTvLink(showStr, Number.parseInt(episodeNo)+1, seasonNo);
        buttonData += `<button onclick='location.href="https://1337x.to/search/${MainLinkUp}/1/"'>Next</Button> | ~~ `;

        // ---------- SEASONS ---------
        const mainLinkDownS = makeTvLink(showStr, episodeNo, Number.parseInt(seasonNo)-1);
        buttonData += `|<button onclick='location.href="https://1337x.to/search/${mainLinkDownS}/1/"'>Previous Season</Button> |`;
        const mainLinkUpS = makeTvLink(showStr, episodeNo, Number.parseInt(seasonNo)+1);
        buttonData += `<button onclick='location.href="https://1337x.to/search/${mainLinkUpS}/1/"'>Next Season</Button>`;

        //grab the top box, append data to it
        $(".box-info").before().prepend(buttonData);
    }

    function grabDataFromSite() {
        //get search from site
        let searchTerm = $(".box-info-heading :contains('Searching for:')").text();
        searchTerm = searchTerm.substr(2+searchTerm.indexOf(":"));
        searchTerm = searchTerm.substr(0,searchTerm.indexOf(":")-3);

        //console.log(searchTerm);

        //find 'S**E**'
        const reg = /S\d\dE\d\d/ig;
        const seasonEpTerm = searchTerm.match(reg).toString();

        //get the TV Show name -- remove matched string
        showStr = searchTerm.replace(reg,"");
        //console.log(showStr);

        //find season / episode numbers
        // -- [0] = season [1] = episode        
        const reg2 = /\d\d/ig;
        const epSeasonInfo = seasonEpTerm.match(reg2);
        seasonNo = epSeasonInfo[0];
        episodeNo = epSeasonInfo[1];

        //console.log(epSeasonInfo.toString());
        return;
    }

    function makeTvLink(showN, epN, sN) {
        let episodeNum = Number.parseInt(epN);
        //add '0' before ep name to keep format (S**E**)
        if(episodeNum <= 9) {
            episodeNum = `0${episodeNum}`;
        }

        //make the main link
        const mainLink = `${showN} S${sN}E${episodeNum}`;
        return mainLink;
    }
})();