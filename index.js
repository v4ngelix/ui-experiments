async function initializePage() {
  const readmeFile = await fetch('./README.md');
  document.getElementById("description").innerHTML = await readmeFile.text();
  const kana = document.getElementsByClassName("exp__spinner-backdrop")?.[0];
  if (kana) {
    kana.classList.add("exp__spinner-backdrop--has-loaded");
    setTimeout(() => {
      document.body.removeChild(kana);
    },351);
  }
}

initializePage();