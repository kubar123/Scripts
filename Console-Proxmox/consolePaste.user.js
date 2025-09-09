// ==UserScript==
// @name         Proxmox Console Paste (Iframe Only)
// @namespace    https://github.com/kubar123/Scripts
// @version      1.9
// @description  Right click paste handler for Proxmox console iframe
// @author       Kubar123
// @match        https://*/?console=*
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// ==/UserScript==

const CHAR_DELAY = 10;

(function () {
    'use strict';


    window.sendString = function(text) {
        const canvas = document.querySelector("canvas");
        if (!canvas) {
            console.warn("Canvas not found for pasting");
            return;
        }

        const chars = text.split("");
        chars.forEach((char, index) => {
            setTimeout(() => {
                const needsShift = char.match(/[A-Z!@#$%^&*()_+{}:\"<>?~|]/);
                let keyEvent;

                if (needsShift) {
                    keyEvent = new KeyboardEvent("keydown", {keyCode: 16, shiftKey: true});
                    canvas.dispatchEvent(keyEvent);

                    keyEvent = new KeyboardEvent("keydown", {key: char, shiftKey: true});
                    canvas.dispatchEvent(keyEvent);

                    keyEvent = new KeyboardEvent("keyup", {keyCode: 16});
                    canvas.dispatchEvent(keyEvent);
                } else {
                    keyEvent = new KeyboardEvent("keydown", {key: char});
                    canvas.dispatchEvent(keyEvent);
                }
            }, index * CHAR_DELAY);
        });
    };

    // setup canvas when found
     function setupCanvas() {
        const canvas = document.querySelector("canvas");
        console.log("Debug - Canvas search result:", canvas);

        if (!canvas) {
            console.log("Debug - No canvas found, retrying in 3s...");
            setTimeout(setupCanvas, 3000);
            return;
        }

        console.log("Debug - Setting up canvas in console iframe");

        canvas.addEventListener("mousedown", (e) => {
            // console.log("Debug - Canvas mousedown, button:", e.button);
            if (e.button === 2) {
                console.log("Debug - Right-click detected!");
                e.preventDefault();
                e.stopPropagation();

                navigator.clipboard.readText()
                    .then(text => {
                        if (text.trim()) {
                            console.log(`Debug - Pasting ${text.length} characters`);
                            window.sendString(text);
                        }
                    })
                    .catch(err => console.warn("Clipboard read failed:", err));
            }
        });

        canvas.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        console.log("Debug - Canvas setup complete - right-click to paste");
    } /*<<+*/

    $(document).ready(() => {
        setTimeout(setupCanvas, 3000);
    });
})();