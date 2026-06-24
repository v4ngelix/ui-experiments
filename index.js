const SPINNER_ANIMATION_DURATION = 350;

/** Show the spinner overlay, resolving once its fade-in animation completes. */
function showSpinner() {
  const spinnerTemplate = document.getElementById("spinner-template");
  document.body.appendChild(spinnerTemplate.content.cloneNode(true));
  const spinner = document.getElementById("spinner");

  return new Promise((resolve) => {
    setTimeout(() => {
      spinner.classList.add("visible");
    }, 0)

    setTimeout(() => {
      console.log('Resolved?')
      resolve(spinner);
    }, SPINNER_ANIMATION_DURATION)
  });
}

/** Build and populate the main content. */
async function loadMain() {
  const template = document.getElementById("main-template");
  document.body.prepend(template.content.cloneNode(true));

  const readmeFile = await fetch("./README.md");
  document.getElementById("description").innerHTML = await readmeFile.text();
}

/** Fade out and remove the spinner overlay. */
function hideSpinner(spinner) {

}

/** Load page contents */
async function initializePage() {
  const spinner = await showSpinner();
  try {
    await loadMain();
  } catch (error) {
    const main = document.getElementsByTagName("main")?.[0];
    if (main) {
      main.classList.add("error");
      main.innerHTML = error.message;
    }
  } finally {
    spinner.classList.remove("visible");
    setTimeout(() => {
      document.body.removeChild(spinner);
    }, SPINNER_ANIMATION_DURATION);
  }
}

initializePage();
