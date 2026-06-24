/** Load page contents */
async function initializePage() {
  const readmeFile = await fetch('./README.md');
  document.getElementById("description").innerHTML = await readmeFile.text();
}

initializePage().catch((error) => {
  const main = document.getElementsByTagName("main")?.[0];
  console.log("catch", error.message, main);
  if (main) {
    main.classList.add("error");
    main.innerHTML = error.message;
  }
}).finally(() => {
  console.log("finally");
  const spinner = document.getElementById("spinner");
  if (spinner) {
    spinner.classList.add("has-loaded");
    setTimeout(() => {
      document.body.removeChild(spinner);
    },351);
  }
});
