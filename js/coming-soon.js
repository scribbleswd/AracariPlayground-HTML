const page = document.querySelector(".page");
function updateScroll() {
  page.style.overflowY =
    page.scrollHeight > page.clientHeight ? "auto" : "hidden";
}
new ResizeObserver(updateScroll).observe(page);
updateScroll();

function handleSubmit(e) {
  e.preventDefault();
  const confirm = document.getElementById("confirm");
  confirm.style.display = "block";
  e.target.style.opacity = "0.4";
  e.target.style.pointerEvents = "none";
}
