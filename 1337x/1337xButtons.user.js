// ==UserScript==
// @name         1337x Media buttons for TV shows
// @namespace    https://github.com/kubar123/Scripts
// @version      0.1.2
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
        // Create episode navigation buttons
        const firstEpLink = makeTvLink(showStr, 1, seasonNo);
        const prevEpLink = makeTvLink(showStr, Number.parseInt(episodeNo)-1, seasonNo);
        const nextEpLink = makeTvLink(showStr, Number.parseInt(episodeNo)+1, seasonNo);
        
let buttonData = `
    <div style="margin: 8px 0; text-align: center; background: #2a2a2a; padding: 8px; border-radius: 4px;">
        <span style="color: #666; margin-right: 5px;">Episodes:</span>
        <button style="margin: 0 3px; padding: 5px 10px; background: #333; border: none; color: #f90; cursor: pointer;" onclick='location.href="https://1337x.to/search/${firstEpLink}/1/"' title="First Episode">⏮</button>
        <button style="margin: 0 3px; padding: 5px 10px; background: #333; border: none; color: #f90; cursor: pointer;" onclick='location.href="https://1337x.to/search/${prevEpLink}/1/"' title="Previous Episode">◀</button>
        <button style="margin: 0 3px; padding: 5px 10px; background: #333; border: none; color: #f90; cursor: pointer;" onclick='location.href="https://1337x.to/search/${nextEpLink}/1/"' title="Next Episode">▶</button>
        <span style="display: inline-block; margin: 0 12px; border-left: 2px solid #666; height: 28px; vertical-align: middle;"></span>`;

const firstSeasonLink = makeTvLink(showStr, episodeNo, 1);
const prevSeasonLink = makeTvLink(showStr, episodeNo, Number.parseInt(seasonNo)-1);
const nextSeasonLink = makeTvLink(showStr, episodeNo, Number.parseInt(seasonNo)+1);

buttonData += `
        <span style="color: #666; margin-right: 5px;">Seasons:</span>
        <button style="margin: 0 3px; padding: 5px 10px; background: #333; border: none; color: #f90; cursor: pointer;" onclick='location.href="https://1337x.to/search/${firstSeasonLink}/1/"' title="First Season">⏮</button>
        <button style="margin: 0 3px; padding: 5px 10px; background: #333; border: none; color: #f90; cursor: pointer;" onclick='location.href="https://1337x.to/search/${prevSeasonLink}/1/"' title="Previous Season">◀</button>
        <button style="margin: 0 3px; padding: 5px 10px; background: #333; border: none; color: #f90; cursor: pointer;" onclick='location.href="https://1337x.to/search/${nextSeasonLink}/1/"' title="Next Season">▶</button>
    </div>`;

        // Add buttons to page
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
        let seasonNo = Number.parseInt(sN);
        //add '0' before ep name to keep format (S**E**)
        if(episodeNum <= 9) {
            episodeNum = `0${episodeNum}`;

        }
        //add '0' before Season name to keep format (S**E**)
        if(seasonNo <= 9) {
            seasonNo = `0${seasonNo}`;
        }



        //make the main link
        const mainLink = `${showN} S${seasonNo}E${episodeNum}`;
        return mainLink;
    }
})();