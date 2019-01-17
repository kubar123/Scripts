// ==UserScript==
// @name         AirDates Additional links
// @namespace    https://github.com/kubar123/Scripts
// @version      0.1
// @description  adds some additional links to airdates
// @author       kubar123
// @match        http://www.airdates.tv/
// @grant        none
// @require https://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==

(function() {
    'use strict';
    $.noConflict();
    //Use google icons incase website is down
    //@@LINK@@ = search query location
    var link1337xImg="https://www.google.com/s2/favicons?domain=1337x.to";
    var link1337xSearch="https://1337x.to/search/@@LINK@@/1/";

    // -----------------------------------------------------------------------------------

   
    $(".entry").click(function(){

        var name=$(this).find(".title").text();

        $(function(){
            // ------ making span --------
            var formatted1337x=makeLink(link1337xImg,link1337xSearch,name);

            var allLinkInfo="<span class='moreAirDatesLinks'>";
            allLinkInfo+=formatted1337x;
            allLinkInfo+="</span>";
            // --------- END SPAN --------

            //prevents links from being duplicated
            if($(".moreAirDatesLinks").length){
                $(this).find(".moreAirDatesLinks").replaceWith(allLinkInfo);
               }else{
                   $(this).find(".engines").after(allLinkInfo);
               }

        });
    });


    function makeLink(img,search,info){
        var newSearch=search.replace("@@LINK@@",info);
        var data='<img class="icon" src="'+img+'">';
        data+='<a class="link" target="_blank" href="'+newSearch+'">1337x</a>';
        return data
    }
})();