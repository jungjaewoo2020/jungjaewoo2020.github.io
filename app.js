"use strict";

// All publications remain readable if JavaScript is unavailable.
const filters = document.querySelector(".paper-filters");
const papers = [...document.querySelectorAll(".paper")];
const count = document.querySelector("#paper-count");

if (filters && count && papers.length) {
  filters.hidden = false;
  filters.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-filter]");
    if (!button || !filters.contains(button)) return;

    const category = button.dataset.filter;
    if (!["all", "preprint", "published"].includes(category)) return;

    for (const control of filters.querySelectorAll("button")) {
      control.setAttribute("aria-pressed", String(control === button));
    }

    let visibleCount = 0;
    for (const paper of papers) {
      paper.hidden = category !== "all" && paper.dataset.category !== category;
      if (!paper.hidden) visibleCount += 1;
    }

    const label = category === "preprint" ? "preprints" : category === "published" ? "published papers" : "papers";
    count.textContent = `${visibleCount} ${label}`;
  });
}
