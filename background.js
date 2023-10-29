chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension running");
});

var messages = [];

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.message !== null && request.message == "start_request") {
    try {
      // clear records
      messages = [];
      // create tab
      let newTab = await chrome.tabs.create({
        url: "https://www.paipai.fm/message.php",
      });
      await new Promise((resp) => setTimeout(resp, 3000));
      if (!newTab || !newTab.id) {
        console.log("Task failed. Cannot create tab");
        return;
      }
      // check if logged in
      let userName = await chrome.tabs.sendMessage(newTab.id, {
        message: "login",
      });
      // find max page
      let pageUrlList = await chrome.tabs.sendMessage(newTab.id, { message: "getPageUrlList" });
      if (pageUrlList.message || !pageUrlList.result) {
        return;
      }
      // check all pages
      let pages = pageUrlList.result;
      console.log("page urls", pages);

      for (let url of pages) {
        let msgTab = await chrome.tabs.create({
          url: url,
        });
        await new Promise((resp) => setTimeout(resp, 3000));
        if (msgTab && msgTab.id) {
          let result = await chrome.tabs.sendMessage(msgTab.id, { message: "getMessages" });
          if (result && result.length) {
            messages.push(...result);
          }
          try {
            await chrome.tabs.remove(msgTab.id);
          } catch (err) {
            console.log("failed to close tab for " + url);
          }
        }
      }
      console.log("messages", messages);
      // format data into csv file
      const headers = [
        "评分者",
        "影响",
        "帖子",
        "发表日期",
        "所在版块",
        "操作时间",
        "操作理由",
        "影响类别",
        "影响分数",
      ];
      let content = messages.map((el) => {
        let line = el.split("\n");
        line = line.slice(0, line.length - 1);
        line = line.map((el, i) => {
          let index = el.indexOf("：");
          if (index > -1) {
            return el.slice(index + 1, el.length);
          } else {
            return el;
          }
        });
        let influence = line[1].split(":");
        let iType = influence[0] || "";
        let iScore = influence[1] || "";
        line.push(iType, iScore);
        return line.join(",");
      });
      content.unshift(headers);
      content = content.join("\n");

      // download csv file
      // for utf8 bom
      const data = "\uFEFF" + content;
      const blob = new Blob([data], { type: "text/csv;charset=utf-8" });

      // use BlobReader object to read Blob data
      const reader = new FileReader();
      reader.onload = () => {
        const buffer = reader.result;
        const blobUrl = `data:${blob.type};base64,${btoa(
          new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
        )}`;
        chrome.downloads.download(
          {
            url: blobUrl,
            filename: request.filename,
            saveAs: true,
            conflictAction: "uniquify",
          },
          () => {
            sendResponse({ success: true });
          }
        );
      };
      reader.readAsArrayBuffer(blob);
      return true;
    } catch (err) {
      console.log(err);
    }
  }
});
