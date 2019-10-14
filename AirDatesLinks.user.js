// ==UserScript==
// @name         AirDates Additional links
// @namespace    https://github.com/kubar123/Scripts
// @version      0.2.0
// @description  adds some additional links to airdates
// @author       kubar123
// @match        https://www.airdates.tv/
// @grant        none
// @require https://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==

(function() {
    'use strict';
    $.noConflict();

    //google icons in case website is down
    //@@LINK@@ = search query location
    var link1337xImg="https://www.google.com/s2/favicons?domain=1337x.to";
    var link1337xSearch="https://1337x.to/search/@@LINK@@/1/";

    // -----------------------------------------------------------------------------------

    $(document).on("click",".entry",function(){

        var name=$(this).find(".title").ignore().text();

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

    //Ignore children in .text/.html
    //usage: var text = $('#test').ignore("span").text();
    //<div id="test"><b>Hello</b><span> World</span>!!!</div>
    $.fn.ignore = function(sel){
        return this.clone().find(sel||">*").remove().end();
    };
})();