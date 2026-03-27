import { debounce } from "../utils/debounce.js";

const USERS = [
  "Arun",
  "Bala",
  "Charan",
  "Deepak",
  "Dinesh",
  "Karthik",
  "Mahesh",
  "Praveen",
  "Rahul",
  "Suresh",
];

function getFilteredUsers(query) {
  return USERS.filter((user) => user.toLowerCase().includes(query));
}

function openResults(root) {
  const input = root.querySelector(".search__input");

  root.dataset.open = "true";
  root.setAttribute("aria-open", "true");
  input.setAttribute("aria-expanded", "true");
}

function closeResults({ root, resultsList }) {
  const input = root.querySelector(".search__input");

  resultsList.innerHTML = "";

  root.dataset.open = "false";
  root.setAttribute("aria-open", "false");
  input.setAttribute("aria-expanded", "false");

  input.removeAttribute("aria-activedescendant");
}

function renderResults({ dataList, root, resultsList }) {
  resultsList.innerHTML = "";

  if (dataList.length === 0) {
    const noResultEl = document.createElement("li");
    noResultEl.className = "search__result search__no-result";
    noResultEl.textContent = "No results found.";
    resultsList.appendChild(noResultEl);
  } else {
    dataList.forEach((name, index) => {
      const li = document.createElement("li");

      li.className = "search__result";
      li.textContent = name;

      li.setAttribute("role", "option");
      li.setAttribute("id", `search-option-${index}`);
      li.setAttribute("aria-selected", "false");

      resultsList.appendChild(li);
    });
  }

  openResults(root);
}

function handleKeyDown({ e, root, input, resultsList }) {
  const results = [...resultsList.querySelectorAll('[role="option"]')];

  if (!results.length) return;

  let currentIndex = results.findIndex((result) =>
    result.classList.contains("is-active"),
  );

  let nextIndex = null;

  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      nextIndex = (currentIndex + 1) % results.length;
      break;

    case "ArrowUp":
      e.preventDefault();
      nextIndex = (currentIndex - 1 + results.length) % results.length;
      break;

    case "Enter":
      e.preventDefault();

      if (currentIndex !== -1) {
        input.value = results[currentIndex].textContent;

        closeResults({
          root,
          resultsList,
        });
      }

      return;

    case "Escape":
      closeResults({
        root,
        resultsList,
      });
      return;

    default:
      return;
  }

  const currentItem = results[currentIndex];
  const nextItem = results[nextIndex];

  currentItem?.classList.remove("is-active");
  currentItem?.setAttribute("aria-selected", "false");

  nextItem?.classList.add("is-active");
  nextItem?.setAttribute("aria-selected", "true");

  input.setAttribute("aria-activedescendant", nextItem?.id || "");

  nextItem?.scrollIntoView({ block: "nearest" });
}

function searchHandler({ e, root, resultsList }) {
  const query = e.target.value.trim().toLowerCase();

  if (query === "") {
    closeResults({ root, resultsList });
    return;
  }

  const filtered = getFilteredUsers(query);

  renderResults({
    dataList: filtered,
    root,
    resultsList,
  });
}

export default function initSearch() {
  const root = document.querySelector(".search");
  const input = root?.querySelector(".search__input");
  const resultsList = root?.querySelector(".search__results");

  if (!root || !input || !resultsList) return;

  const debouncedSearch = debounce((e) => {
    searchHandler({
      e,
      root,
      resultsList,
    });
  }, 300);

  input.addEventListener("input", debouncedSearch);

  input.addEventListener("focus", (e) => {
    const query = e.target.value.trim().toLowerCase();

    if (!query) return;

    const filtered = getFilteredUsers(query);

    renderResults({
      dataList: filtered,
      root,
      resultsList,
    });
  });

  document.addEventListener("click", (e) => {
    if (!root.contains(e.target)) {
      closeResults({
        root,
        resultsList,
      });
    }
  });

  input.addEventListener("keydown", (e) =>
    handleKeyDown({
      e,
      root,
      input,
      resultsList,
    }),
  );

  // Click selection
  resultsList.addEventListener("click", (e) => {
    const option = e.target.closest('[role="option"]');

    if (!option) return;

    input.value = option.textContent;

    closeResults({
      root,
      resultsList,
    });
  });

  // Hover highlight
  resultsList.addEventListener("mouseover", (e) => {
    const option = e.target.closest('[role="option"]');

    if (!option) return;

    const results = [...resultsList.querySelectorAll('[role="option"]')];

    results.forEach((item) => {
      item.classList.remove("is-active");
      item.setAttribute("aria-selected", "false");
    });

    option.classList.add("is-active");
    option.setAttribute("aria-selected", "true");

    input.setAttribute("aria-activedescendant", option.id);
  });
}

// What improved in this refactor
// Before -------------
// Arrow key
//    ↓
// querySelectorAll
//    ↓
// findIndex
//    ↓
// update DOM
// After ---------------
// Arrow key
//    ↓
// activeIndex++
//    ↓
// update DOM

// So now state is JS-driven, not DOM-driven. This reduces the number of DOM queries and manipulations, improving performance and making the code cleaner.
