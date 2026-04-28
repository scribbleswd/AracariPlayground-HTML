const page = document.querySelector(".page");
function updateScroll() {
  page.style.overflowY =
    page.scrollHeight > page.clientHeight ? "auto" : "hidden";
}
new ResizeObserver(updateScroll).observe(page);
updateScroll();

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzzk6aMs2YoTbykHNFjTbUnbo5G4C5ZuyTDyBx-UNp0yqzC_GBBwojDJmIWIdkApAG5/exec";

async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const email = form.querySelector("input[type='email']").value;
  const confirm = document.getElementById("confirm");

  form.style.opacity = "0.4";
  form.style.pointerEvents = "none";

  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "email=" + encodeURIComponent(email),
    });
  } catch (err) {
    // network error — still show confirmation so UX isn't broken
  }

  confirm.style.display = "block";
}
