// ==UserScript==
// @name         1337x Media buttons for TV shows
// @namespace    https://github.com/kubar123/Scripts
// @version      0.2.0
// @description  Add previous/next buttons to the top of the page. Makes switching between episodes easier
// @author       kubar123
// @match        https://1337x.to/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==

/**
 * Main function to extract show information from the search page.
 * Parses the search term to find TV show name, season number, and episode number.
 * Handles both S**E** format (e.g. S01E05) and "Season X" format.
 * Sets global variables showStr, seasonNo, and episodeNo.
 * @returns {boolean} True if parsing succeeded, false otherwise
 */
function grabDataFromSite() {
    //get search from site
    let searchTerm = $(".box-info-heading :contains('Searching for:')").text();
    searchTerm = searchTerm.substr(2+searchTerm.indexOf(":"));
    searchTerm = searchTerm.substr(0,searchTerm.indexOf(":")-3);

    //console.log(searchTerm);

    // First try to find 'S**E**' format
    const regEpisode = /S\d\dE\d\d/ig;
    const seasonEpTerm = searchTerm.match(regEpisode);

    // If S**E** format found
    if (seasonEpTerm) {
        //get the TV Show name -- remove matched string
        showStr = searchTerm.replace(regEpisode,"");
        
        //find season / episode numbers
        // -- [0] = season [1] = episode        
        const reg2 = /\d\d/ig;
        const epSeasonInfo = seasonEpTerm[0].match(reg2);
        seasonNo = epSeasonInfo[0];
        episodeNo = epSeasonInfo[1];
    } 
    // Try to find 'Season X' format
    else {
        const regSeason = /Season\s+(\d+)/i;
        const seasonMatch = searchTerm.match(regSeason);
        
        if (seasonMatch) {
            showStr = searchTerm.replace(regSeason, "").trim();
            seasonNo = seasonMatch[1].padStart(2, '0');
            episodeNo = "00"; // Disable episode navigation
        } else {
            // Neither format found
            return false;
        }
    }
    return true;
}

/**
 * Adds the navigation HTML to the page.
 * Prepends the navigation buttons to the .box-info element.
 */
function addDataToWindow() {
    const navHtml = buildNavigationHtml();
    $(".box-info").prepend(navHtml);
}
        
/**
 * Builds the main navigation HTML container.
 * Includes both episode and season navigation if applicable.
 * @returns {string} HTML string containing navigation buttons
 */
function buildNavigationHtml() {
    // Assume seasonNo, episodeNo, showStr are available in global scope when called in a browser
    return `<div style="margin: 8px 0; text-align: center; background: #2a2a2a; padding: 8px; border-radius: 4px;">
                ${episodeNo === "00" ? "" : createEpisodeButtons(showStr, seasonNo, episodeNo)}
                ${createSeasonButtons(showStr, seasonNo, episodeNo)}
            </div>`;
}
        
/**
 * Creates the episode navigation buttons HTML.
 * Includes first, previous, and next episode buttons.
 * @param {string} show - The TV show name
 * @param {string} season - The season number
 * @param {string} episode - The current episode number
 * @returns {string} HTML string containing episode navigation buttons
 */
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
            return `${baseStyle}background: black; color: white;`;
        }
        return `${baseStyle}background: #f14e13; color: white;`;
    }
    
    return `
        <span style="color: #666; margin-right: 5px;">Episodes:</span>
        <button style="${buttonStyle(firstEpNum)}" ${firstEpNum === 0 ? '' : 'onmouseover="this.style.background=\'black\'" onmouseout="this.style.background=\'#f14e13\'"'} onclick='location.href="https://1337x.to/search/${firstEpLink}/1/"' title="First Episode">⏮</button>
        <button style="${buttonStyle(prevEpNum)}" ${prevEpNum === 0 ? '' : 'onmouseover="this.style.background=\'black\'" onmouseout="this.style.background=\'#f14e13\'"'} onclick='location.href="https://1337x.to/search/${prevEpLink}/1/"' title="Previous Episode">◀</button>
        <button style="${buttonStyle(nextEpNum)}" ${nextEpNum === 0 ? '' : 'onmouseover="this.style.background=\'black\'" onmouseout="this.style.background=\'#f14e13\'"'} onclick='location.href="https://1337x.to/search/${nextEpLink}/1/"' title="Next Episode">▶</button>
        <span style="display: inline-block; margin: 0 12px; border-left: 2px solid #666; height: 28px; vertical-align: middle;"></span>`;
}
        
/**
 * Creates the season navigation buttons HTML.
 * Includes first, previous, and next season buttons.
 * @param {string} show - The TV show name
 * @param {string} season - The current season number
 * @param {string} episode - The current episode number
 * @returns {string} HTML string containing season navigation buttons
 */
function createSeasonButtons(show, season, episode) {
    const currentSeason = Number.parseInt(season);
    const firstSeasonNum = 1;
    const prevSeasonNum = currentSeason - 1;
    const nextSeasonNum = currentSeason + 1;
    
    const firstSeasonLink = episode === "00" ? `${show} Season ${firstSeasonNum}` : makeTvLink(show, episode, firstSeasonNum);
    const prevSeasonLink = episode === "00" ? `${show} Season ${prevSeasonNum}` : makeTvLink(show, episode, prevSeasonNum);
    const nextSeasonLink = episode === "00" ? `${show} Season ${nextSeasonNum}` : makeTvLink(show, episode, nextSeasonNum);
    
    // Helper function to determine button style based on the target season number.
    // If the season number is 0, apply special styling to indicate it's the 'end'.
    function buttonStyle(targetSeason) {
        const baseStyle = "margin: 0 3px; padding: 5px 10px; border: none; cursor: pointer;";
        if (targetSeason === 0) {
            return `${baseStyle}background: black; color: white;`;
        }
        return `${baseStyle}background: #f14e13; color: white;`;
    }
    
    return `
        <span style="color: #666; margin-right: 5px;">Seasons:</span>
        <button style="${buttonStyle(firstSeasonNum)}" ${firstSeasonNum === 0 ? '' : 'onmouseover="this.style.background=\'black\'" onmouseout="this.style.background=\'#f14e13\'"'} onclick='location.href="https://1337x.to/search/${firstSeasonLink}/1/"' title="First Season">⏮</button>
        <button style="${buttonStyle(prevSeasonNum)}" ${prevSeasonNum === 0 ? '' : 'onmouseover="this.style.background=\'black\'" onmouseout="this.style.background=\'#f14e13\'"'} onclick='location.href="https://1337x.to/search/${prevSeasonLink}/1/"' title="Previous Season">◀</button>
        <button style="${buttonStyle(nextSeasonNum)}" ${nextSeasonNum === 0 ? '' : 'onmouseover="this.style.background=\'black\'" onmouseout="this.style.background=\'#f14e13\'"'} onclick='location.href="https://1337x.to/search/${nextSeasonLink}/1/"' title="Next Season">▶</button>`;
}

/**
 * Creates a formatted TV show link string.
 * Pads season and episode numbers with leading zeros if needed.
 * @param {string} showN - The TV show name
 * @param {string|number} epN - The episode number
 * @param {string|number} sN - The season number
 * @returns {string} Formatted string like "Show Name S01E02"
 */
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
    if (grabDataFromSite()) {
        addDataToWindow();
    }
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