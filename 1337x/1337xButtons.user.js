// ==UserScript==
// @name         1337x Media buttons for TV shows
// @namespace    https://github.com/kubar123/Scripts
// @version      0.1.3 
// @description  Add previous/next buttons to the top of the page. Makes switching between episodes easier
// @author       kubar123
// @match        https://1337x.to/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==

// GLOBAL function definitions for testing and script execution
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

function addDataToWindow() {
    const navHtml = buildNavigationHtml();
    $(".box-info").prepend(navHtml);
}
        
function buildNavigationHtml() {
    // Assume seasonNo, episodeNo, showStr are available in global scope when called in a browser
    return `<div style="margin: 8px 0; text-align: center; background: #2a2a2a; padding: 8px; border-radius: 4px;">
                ${createEpisodeButtons(showStr, seasonNo, episodeNo)}
                ${createSeasonButtons(showStr, seasonNo, episodeNo)}
            </div>`;
}
        
function createEpisodeButtons(show, season, episode) {
    const currentEp = Number.parseInt(episode);
    const firstEpNum = 1;
    const prevEpNum = currentEp - 1;
    const nextEpNum = currentEp + 1;
    
    const firstEpLink = makeTvLink(show, firstEpNum, season);
    const prevEpLink = makeTvLink(show, prevEpNum, season);
    const nextEpLink = makeTvLink(show, nextEpNum, season);
    
    // Helper function to determine button style based on the target episode number.
    // If the episode number is 0, apply special styling to indicate it's the 'end'.
    function buttonStyle(targetEp) {
        const baseStyle = "margin: 0 3px; padding: 5px 10px; border: none; cursor: pointer;";
        if (targetEp === 0) {
            return `${baseStyle}background: #555; color: #f90; border: 1px dashed #ff0;`;
        }
        return `${baseStyle}background: #333; color: #f90;`;
    }
    
    return `
        <span style="color: #666; margin-right: 5px;">Episodes:</span>
        <button style="${buttonStyle(firstEpNum)}" onclick='location.href="https://1337x.to/search/${firstEpLink}/1/"' title="First Episode">⏮</button>
        <button style="${buttonStyle(prevEpNum)}" onclick='location.href="https://1337x.to/search/${prevEpLink}/1/"' title="Previous Episode">◀</button>
        <button style="${buttonStyle(nextEpNum)}" onclick='location.href="https://1337x.to/search/${nextEpLink}/1/"' title="Next Episode">▶</button>
        <span style="display: inline-block; margin: 0 12px; border-left: 2px solid #666; height: 28px; vertical-align: middle;"></span>`;
}
        
function createSeasonButtons(show, season, episode) {
    const currentSeason = Number.parseInt(season);
    const firstSeasonNum = 1;
    const prevSeasonNum = currentSeason - 1;
    const nextSeasonNum = currentSeason + 1;
    
    const firstSeasonLink = makeTvLink(show, episode, firstSeasonNum);
    const prevSeasonLink = makeTvLink(show, episode, prevSeasonNum);
    const nextSeasonLink = makeTvLink(show, episode, nextSeasonNum);
    
    // Helper function to determine button style based on the target season number.
    // If the season number is 0, apply special styling to indicate it's the 'end'.
    function buttonStyle(targetSeason) {
        const baseStyle = "margin: 0 3px; padding: 5px 10px; border: none; cursor: pointer;";
        if (targetSeason === 0) {
            return `${baseStyle}background: #555; color: #f90; border: 1px dashed #ff0;`;
        }
        return `${baseStyle}background: #333; color: #f90;`;
    }
    
    return `
        <span style="color: #666; margin-right: 5px;">Seasons:</span>
        <button style="${buttonStyle(firstSeasonNum)}" onclick='location.href="https://1337x.to/search/${firstSeasonLink}/1/"' title="First Season">⏮</button>
        <button style="${buttonStyle(prevSeasonNum)}" onclick='location.href="https://1337x.to/search/${prevSeasonLink}/1/"' title="Previous Season">◀</button>
        <button style="${buttonStyle(nextSeasonNum)}" onclick='location.href="https://1337x.to/search/${nextSeasonLink}/1/"' title="Next Season">▶</button>`;
}

function makeTvLink(showN, epN, sN) {
    let episodeNum = Number.parseInt(epN);
    let seasonNum = Number.parseInt(sN);

    if(episodeNum <= 9) {
        episodeNum = `0${episodeNum}`;
    }
    if(seasonNum <= 9) {
        seasonNum = `0${seasonNum}`;
    }

    return `${showN} S${seasonNum}E${episodeNum}`;
}

// Only execute the DOM-dependent code if running in a browser environment
if (typeof document !== "undefined") {
    // Here you can assign or compute seasonNo, episodeNo, and showStr as needed.
    // For example, they might be obtained via grabDataFromSite().
    grabDataFromSite();
    addDataToWindow();
}

// Expose functions for tests (only when running in Node/Bun)
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        makeTvLink,
        createEpisodeButtons,
        createSeasonButtons,
        buildNavigationHtml // if you want to test this too.
    };
}