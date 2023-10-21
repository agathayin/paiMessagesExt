chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension running");
  chrome.storage.sync.set({ paiMessages: [] });
});

var maxPage = 0;

function download(data) {
  let blob = new Blob(data, { type: "text/plain;charset=UTF-8" });
  let url = URL.createObjectURL(blob);
  chrome.downloads.download({ url: url });
}

function addMessage(msg) {
  chrome.storage.sync.get("paiMessages").then(({ data }) => {
    data.unshift(msg);
    chrome.storage.sync.set({ paiMessages: data });
  });
}

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.message !== null && request.message == "start_request") {
    try {
      // clear records
      chrome.storage.sync.set({ paiMessages: [] });
      maxPage = 0;
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

      // check all pages

      // add data into data

      // format data into csv file and download
    } catch (err) {
      console.log(err);
    }
    // reset all variables

    // start request
  }
});
