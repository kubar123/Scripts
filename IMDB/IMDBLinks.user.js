// ==UserScript==
// @name         IMDB Additional Links
// @namespace    https://github.com/kubar123/Scripts
// @version      0.4.0
// @description  adds some additional links to airdates
// @author       kubar123
// @match        https://www.imdb.com/title/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==

(() => {
    // 'use strict';
    // LINKS
    const URL1337x = "https://1337x.to/search/@@LINK@@/1/";
    const URLTv1337x = "https://1337x.to/category-search/@@LINK@@/TV/1/";
    const IMG1337x = "https://www.google.com/s2/favicons?domain=1337x.to";
    const URLPirateBay = "https://www.thepiratebay.org/search/@@LINK@@/0/99/0";
    const IMGPirateBay = "https://www.google.com/s2/favicons?domain=thepiratebay.org";
    const URLTorrentz2 = "https://torrentz2.eu/searchA?f=@@LINK@@";
    const IMGTorrentz2 = "https://www.google.com/s2/favicons?domain=torrentz2.eu";

    //TODO: Use tv category or add 's01e01' to link if is tv show
    const item = $(".hero__primary-text").parent().parent();
    const itemName = $(".hero__primary-text").text();
    const isTVShow = item.find("[role='presentation']").text().includes("TV Series");

    //Add buttons to page with extra padding added below the buttons
    $(".hero__primary-text").parent().parent().append(`<br>${makeAllLink()}`);

    // -------------------------- FUNCTIONS -----------------------------------

    //returns all buttons wrapped in a container that adds padding beneath them
    function makeAllLink(){
        const allButtons = isTVShow
            ? makeaLink(IMG1337x, URLTv1337x, itemName, "1337x")
            : makeaLink(IMG1337x, URL1337x, itemName, "1337x");
        const combinedButtons = `${allButtons}|${makeaLink(IMGPirateBay, URLPirateBay, itemName, "TPB")}|${makeaLink(IMGTorrentz2, URLTorrentz2, itemName, "Torrentz2")}`;
        return `<div style="padding-bottom: 5px;">${combinedButtons}</div>`;
    }

    function makeaLink(img, search, link, name) {
        const searchTerm = isTVShow ? `${link} season 1` : link;
        
        //fix link
        const newSearch = search.replace("@@LINK@@", searchTerm);

        //make button with similar styling to 1337x's but with yellow text instead of orange
        const data = `<a href="${newSearch}">
            <button style="margin: 0 3px; padding: 5px 10px; background: #333; color: #ff0; border: none; cursor: pointer;">
                <img src="${img}" style="vertical-align: middle;"/> ${name}
            </button>
        </a>`;
        return data;
    }
})();