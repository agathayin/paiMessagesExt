function loadnr() {
  chrome.runtime.sendMessage({ message: "start_request" });
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("start_request").addEventListener("click", loadnr);
});

chrome.storage.sync.get("paiMessages", ({ data }) => {
  const contentHTML = data.map((el) => `<p>${el}</p>`).join("");
  document.querySelector("#message").innerHTML = contentHTML;
});
