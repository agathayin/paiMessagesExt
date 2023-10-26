chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension running");
  chrome.storage.sync.set({ paiMessages: [] });
});

var messages = [];

function download(data) {
  let blob = new Blob(data, { type: "text/plain;charset=UTF-8" });
  let url = URL.createObjectURL(blob);
  chrome.downloads.download({ url: url });
}

function addMessage(msg) {
  chrome.storage.sync.get("paiMessages").then((result) => {
    let messages = [];
    if (result.paiMessages && result.paiMessages.length) messages = result.paiMessages;

    messages.unshift(msg);
    chrome.storage.sync.set({ paiMessages: messages });
  });
}

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.message !== null && request.message == "start_request") {
    try {
      // clear records
      chrome.storage.sync.set({ paiMessages: [] });
      messages = [];
      // create tab
      let newTab = await chrome.tabs.create({
        url: "https://www.paipai.fm/message.php",
      });
      await new Promise((resp) => setTimeout(resp, 3000));
      if (!newTab || !newTab.id) {
        console.log("Task failed. Cannot create tab");
        addMessage("Task failed. Cannot create tab");
        return;
      }
      // check if logged in
      let userName = await chrome.tabs.sendMessage(newTab.id, {
        message: "login",
      });
      if (userName) {
        addMessage("Logged as " + userName);
      } else {
        addMessage("Please Log in first.");
        return;
      }
      // find max page
      let pageUrlList = await chrome.tabs.sendMessage(newTab.id, { message: "getPageUrlList" });
      if (pageUrlList.message || !pageUrlList.result) {
        addMessage(urls.message);
        return;
      }
      // check all pages
      let pages = pageUrlList.result;
      console.log(pages);
      for (let url of pages) {
        let msgTab = await chrome.tabs.create({
          url: url,
        });
        await new Promise((resp) => setTimeout(resp, 3000));
        if (msgTab && msgTab.id) {
          let result = await chrome.tabs.sendMessage(msgTab.id, { message: "getMessages" });
          if (result && result.length) {
            console.log(result);
            messages.push(...result);
          }
          try {
            await chrome.tabs.remove(msgTab.id);
          } catch (err) {}
        }
      }
      // format data into csv file and download
      download(messages.join("\n"));
    } catch (err) {
      console.log(err);
    }
    // reset all variables

    // start request
  }
});
