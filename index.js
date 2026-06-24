const SPINNER_ANIMATION_DURATION = 250;

/** Show the spinner overlay, resolving once its fade-in animation completes. */
function showSpinner() {
  const spinnerTemplate = document.getElementById("spinner-template");
  document.body.appendChild(spinnerTemplate.content.cloneNode(true));
  const spinner = document.getElementById("spinner");

  return new Promise((resolve) => {
    setTimeout(() => {
      spinner.classList.remove("hidden");
    }, 0)

    setTimeout(() => {
      console.log('Resolved?')
      resolve(spinner);
    }, SPINNER_ANIMATION_DURATION)
  });
}

/** Enable drag-and-drop reordering of the layout sections. */
function enableSectionReordering(main) {
  const sections = main.querySelectorAll("section");
  let dragged = null;

  sections.forEach((section) => {
    section.style.gridArea = section.id;
    section.draggable = true;

    section.addEventListener("dragstart", () => {
      dragged = section;
      section.classList.add("dragging");
    });

    section.addEventListener("dragend", () => {
      section.classList.remove("dragging");
      dragged = null;
    });

    section.addEventListener("dragover", (event) => {
      event.preventDefault();
      if (dragged && dragged !== section) {
        section.classList.add("drag-over");
      }
    });

    section.addEventListener("dragleave", () => {
      section.classList.remove("drag-over");
    });

    section.addEventListener("drop", (event) => {
      event.preventDefault();
      section.classList.remove("drag-over");
      if (!dragged || dragged === section) return;

      const draggedArea = dragged.style.gridArea;
      dragged.style.gridArea = section.style.gridArea;
      section.style.gridArea = draggedArea;
    });
  });
}

/** Fetch the generated experiments list and render it into the sidebar. */
async function loadExperimentLinks() {
  const response = await fetch("./experiments.json");
  const experiments = await response.json();

  const template = document.getElementById("experiment-link");
  const list = document.querySelector("#experiments-list ul");

  let selectedUrl = null;

  experiments.forEach((experiment) => {
    const item = template.content.cloneNode(true);
    const button = item.querySelector("button");
    button.textContent = experiment.title;
    button.dataset.url = experiment.url;
    button.addEventListener("click", async () => {
      if (selectedUrl === experiment.url) return;
      selectedUrl = experiment.url;

      const frame = document.getElementById("experiment-frame");
      frame.src = encodeURI(`${experiment.url}/index.html`);

      const paragraph = document.getElementById("experiment-description");
      paragraph.classList.add("hidden");

      const readme = await fetch(encodeURI(`${experiment.url}/README.md`));
      const text = await readme.text();

      setTimeout(() => {
        paragraph.innerHTML = text;
        paragraph.classList.remove("hidden");
      }, SPINNER_ANIMATION_DURATION * 2);
    });
    list.appendChild(item);
  });
}

/** Build and populate the main content. */
async function loadMain() {
  const template = document.getElementById("main-template");
  document.body.prepend(template.content.cloneNode(true));

  const readmeFile = await fetch("./README.md");
  document.getElementById("description").innerHTML = await readmeFile.text();

  await loadExperimentLinks();

  enableSectionReordering(document.querySelector("main"));

  document.querySelector("main").classList.remove("hidden");
}

showSpinner()
  .then(async () => {
    try {
      await loadMain();
    } catch (error) {
      const main = document.getElementsByTagName("main")?.[0];
      if (main) {
        main.classList.add("error");
        main.innerHTML = error.message;
      }
    } finally {
      spinner.classList.add("hidden");
      setTimeout(() => {
        document.body.removeChild(spinner);
      }, SPINNER_ANIMATION_DURATION);
    }
  })