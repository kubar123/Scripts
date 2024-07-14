// ==UserScript==
// @name         IMDB Additional Links
// @namespace    https://github.com/kubar123/Scripts
// @version      0.3.1
// @description  adds some additional links to airdates
// @author       kubar123
// @match        https://www.imdb.com/title/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==

(function() {
    'use strict';
// LINKS
    var URL1337x="https://1337x.to/search/@@LINK@@/1/";
    var URLTv1337x="https://1337x.to/category-search/@@LINK@@/TV/1/"
    var IMG1337x="https://www.google.com/s2/favicons?domain=1337x.to";
    var URLPirateBay="https://www.thepiratebay.org/search/@@LINK@@/0/99/0";
    var IMGPirateBay="https://www.google.com/s2/favicons?domain=thepiratebay.org";
    var URLTorrentz2="https://torrentz2.eu/searchA?f=@@LINK@@";
    var IMGTorrentz2="https://www.google.com/s2/favicons?domain=torrentz2.eu";

    //TODO: Use tv category or add 's01e01' to link if is tv show
    var itemName;
    var isTVShow;
    var item=$(".title_wrapper");

    //get show name
    itemName=$(".title_wrapper h1").text();

    //find all multiple spaces and replace with a single space
    itemName = itemName.replace(/\s+/g,' ').trim();

    //is the item a TV show/Movie?
    isTVShow= item.text().indexOf("TV")>=0;


    //Add buttons to page
    $(".title_wrapper").append(makeAllLink());


// -------------------------- FUNCTIONS -----------------------------------

    //returns all buttons
    function makeAllLink(){
        if(isTVShow)
            var allButtons=makeaLink(IMG1337x,URLTv1337x,itemName,"1337x");
        else
            var allButtons=makeaLink(IMG1337x,URL1337x,itemName,"1337x");
        allButtons+="|";
        allButtons+=makeaLink(IMGPirateBay, URLPirateBay,itemName,"TPB");
        allButtons+="|";
        allButtons+=makeaLink(IMGTorrentz2,URLTorrentz2,itemName, "Torrentz2");
        return allButtons;
    }

    function makeaLink(img,search,link,name){
        var searchTerm=link;
        //add season data if is TV show
        if(isTVShow)
            searchTerm+=" season 1";
        

        //fix link
        var newSearch=search.replace("@@LINK@@",searchTerm);

        //make buttons
        var data='<a href="'+newSearch+'"><img src="'+img+'"/>';
        data+=name+'</a>';
        return data
    }


})();