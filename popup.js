// functions
function loadnr() {
  let startPage = document.getElementById("startPageInput").value;
  let endPage = document.getElementById("endPageInput").value;
  if (endPage && startPage && Number(endPage) < Number(startPage)) {
    alert("End page must be bigger than start page. start: " + startPage + " end: " + endPage);
    return;
  }
  if (startPage && Number(startPage) < 1) {
    startPage = 1;
  }
  chrome.runtime.sendMessage({ message: "start_request", startPage: startPage, endPage: endPage });
}

// onload
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("start_request").addEventListener("click", loadnr);
});
