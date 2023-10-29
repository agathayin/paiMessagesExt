// functions
function loadnr() {
  chrome.runtime.sendMessage({ message: "start_request" });
}

// onload
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("start_request").addEventListener("click", loadnr);
});

loadMessage();
