const SPINNER_ANIMATION_DURATION = 400;

function showSpinner() {
  const spinner = document.getElementById("spinner");

  return new Promise((resolve) => {
    setTimeout(() => {
      spinner.classList.remove("hidden");
    }, 0)

    setTimeout(() => {
      resolve(spinner);
    }, SPINNER_ANIMATION_DURATION)
  });
}

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

function renderInspiration(experiment, gallery) {
  gallery.replaceChildren();

  const media = experiment.inspiration || [];

  if (!media.length) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "No inspiration pictures for this experiment.";
    gallery.appendChild(empty);
    return;
  }

  media.forEach(({ file, type }) => {
    const template = document.getElementById(`inspiration-${type}`);
    const item = template.content.cloneNode(true);
    const source = encodeURI(`${experiment.url}/inspiration/${file}`);
    const label = `Inspiration for ${experiment.title}`;

    const link = item.querySelector("a");
    link.href = source;

    if (type === "video") {
      item.querySelector("video").src = `${source}#t=0.1`;
      link.ariaLabel = `${label} (video)`;
    } else {
      const image = item.querySelector("img");
      image.src = source;
      image.alt = label;
    }

    gallery.appendChild(item);
  });
}

async function loadExperimentLinks() {
  const response = await fetch("./experiments.json");
  const experiments = await response.json();

  const template = document.getElementById("experiment-link");
  const list = document.querySelector("#experiments-list ol");

  let selectedUrl = null;
  let selectedButton = null;

  async function selectExperiment(experiment, button) {
    if (selectedUrl === experiment.url) return;
    selectedUrl = experiment.url;

    if (selectedButton) selectedButton.disabled = false;
    selectedButton = button;
    button.disabled = true;

    const params = new URLSearchParams(window.location.search);
    params.set("demo", experiment.url);
    history.replaceState(null, "", `?${params.toString()}`);

    const frame = document.getElementById("experiment-frame");
    frame.classList.add("hidden");

    const paragraph = document.querySelector("#experiment-description fieldset p");
    paragraph.classList.add("hidden");

    const gallery = document.querySelector("#inspiration .gallery");
    gallery.classList.add("hidden");

    const readme = await fetch(encodeURI(`${experiment.url}/README.md`));
    const text = await readme.text();

    setTimeout(() => {
      paragraph.innerHTML = text;
      paragraph.classList.remove("hidden");
      frame.src = encodeURI(`${experiment.url}/index.html`);
      frame.classList.remove("hidden");
      renderInspiration(experiment, gallery);
      gallery.classList.remove("hidden");
    }, SPINNER_ANIMATION_DURATION / 2);
  }

  const buttons = new Map();

  experiments.forEach((experiment) => {
    const item = template.content.cloneNode(true);
    const button = item.querySelector("button");
    button.textContent = experiment.title;
    button.dataset.url = experiment.url;
    button.addEventListener("click", () => selectExperiment(experiment, button));
    buttons.set(experiment.url, button);
    list.appendChild(item);
  });

  const requestedUrl = new URLSearchParams(window.location.search).get("demo");
  const initial =
    experiments.find((experiment) => experiment.url === requestedUrl) ||
    experiments[0];
  if (initial) selectExperiment(initial, buttons.get(initial.url));
}

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
