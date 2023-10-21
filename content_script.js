chrome.storage.sync.get("paiMessages", (data) => {
  data.unshift(location.href);
  chrome.storage.sync.set({ paiMessages: data });
});

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
      var pageTotal = document.querySelectorAll("").length;
      var lastPage = document.querySelectorAll('ul[class="a-pagination"] span li a')[pageTotal - 1].innerHTML;
      console.log("Last pages: " + lastPage);

      var pageUrlList = [];

      for (let i = 1; i <= lastPage; i++) {
        let tmp = `https://sellercentral.amazon.com/orders-v3?page=${i}&date-range=${dateFrom}-${dateTo}`;
        pageUrlList.push(tmp);
      }

      console.log("Total pages: " + pageUrlList.length);
      chrome.runtime.sendMessage({
        message: "runPageScan",
        data: pageUrlList,
        orderDate: orderDate,
      });
      sendResponse(true);
    } catch (err) {
      console.log("getPageUrlList", err);
      sendResponse(err);
    }
  }
});
