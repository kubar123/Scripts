// ==UserScript==
// @name         IMDB Additional Links
// @namespace    https://github.com/kubar123/Scripts
// @version      0.1
// @description  adds some additional links to airdates
// @author       kubar123
// @match        https://www.imdb.com/title/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
// LINKS
    var URL1337x="https://1337x.to/search/@@LINK@@/1/";
    var IMG1337x="https://www.google.com/s2/favicons?domain=1337x.to";
    var URLPirateBay="https://www.thepiratebay.org/search/@@LINK@@/0/99/0";
    var IMGPirateBay="https://www.google.com/s2/favicons?domain=thepiratebay.org";

    //TODO: Use tv category or add 's01e01' to link if is tv show
    var itemName;
    var isTVShow;
    var item=$(".title_wrapper");

    //get show name
    itemName=$(".title_wrapper h1").text();

    //is the item a TV show/Movie?
    isTVShow= item.text().indexOf("TV")>=0;

    //Add buttons to page
    $(".title_wrapper").append(makeAllLink());


// -------------------------- FUNCTIONS -----------------------------------

    //returns all buttons
    function makeAllLink(){
        var allButtons=makeaLink(IMG1337x,URL1337x,itemName,"1337x");
        allButtons+="|";
        allButtons+=makeaLink(IMGPirateBay, URLPirateBay,itemName,"TPB");

        return allButtons;
    }

    function makeaLink(img,search,link,name){
        //fix link
        var newSearch=search.replace("@@LINK@@",link);

        //make buttons
        var data='<button onclick="location.href=\''+newSearch+' \'"><img src="'+img+'"/>';
        data+=name+'</button>';
        return data
    }


})();