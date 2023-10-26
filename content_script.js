chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.message !== null && request.message == "login") {
    let userinfo = document.querySelector("#td_userinfomore");
    if (userinfo && userinfo.firstChild && userinfo.firstChild.textContent) {
      sendResponse(userinfo.firstChild.textContent);
    } else {
      sendResponse("");
    }
  }
});

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.message !== null && request.message == "getPageUrlList") {
    try {
      const pageTotalText = document.querySelector(".fr .pages .fl").innerHTML;
      let pageTotal = pageTotalText.slice(1, pageTotalText.length - 1);
      if (!pageTotal || !pageTotal.length) return sendResponse({ message: "Failed to find total pages" });
      pageTotal = Number(pageTotal);
      if (!pageTotal) return sendResponse({ message: "Cannot find urls" });
      let urls = [];
      for (let i = 1; i <= pageTotal; i++) {
        let tmp = `https://www.paipai.fm/message.php?type=sms&boxname=inbox&action=rate&page=${i}`;
        urls.push(tmp);
      }
      sendResponse({ result: urls });
    } catch (err) {
      console.log("getPageUrlList", err);
      sendResponse(err);
    }
  }
});

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.message !== null && request.message == "getMessages") {
    try {
      let result = [];
      let nodes = document.querySelectorAll(".value p.lh_18");
      nodes.forEach((el) => {
        if (el.innerHTML) {
          result.push(el.innerHTML);
        }
      });
      sendResponse(result);
    } catch (err) {
      console.log("getPageUrlList", err);
      sendResponse(err);
    }
  }
});
