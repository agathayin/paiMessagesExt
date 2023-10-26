// functions
function loadnr() {
  chrome.runtime.sendMessage({ message: "start_request" });
}

function loadMessage() {
  chrome.storage.sync.get("paiMessages", ({ data }) => {
    console.log(data);
    const contentHTML = data.map((el) => `<p>${el}</p>`).join("");
    document.querySelector("#message").innerHTML = contentHTML;
  });
}

// onload
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("start_request").addEventListener("click", loadnr);
  document.getElementById("load_message").addEventListener("click", loadMessage);
});

loadMessage();
