// ==UserScript==
// @name         EXPO2025 予約サイトの「もっと見る」ボタン自動押下
// @namespace    https://twitter.com/Akagi__JP/
// @description  EXPO2025 の予約サイトの「もっと見る」ボタンを自動で押下する
// @author       Akagi
// @version      0.0.1
// @match        https://ticket.expo2025.or.jp/event_search/*
// @grant        none
// @inject-into  content
// ==/UserScript==

(function () {
  'use strict';
  setInterval(function () {
    const btn = document.querySelector(".more-btn-wrap button");
    if (btn && !btn.disabled) {
      btn.click();
    }
  }, 100);
})();
