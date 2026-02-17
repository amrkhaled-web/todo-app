// SELECTORS FIRST
let plusBtn = document.querySelector(`.add`);
let textTask = document.querySelector(`.task-input`);
let hideClass = document.querySelector(`.hidden`);
let iPlus = document.querySelector(`#pl`);

let inpTask = document.querySelector(`.inp`);
let addBtn = document.querySelector(`.confirm`);
let mainTasks = document.querySelector(`.tasks`);
let filtersParent = document.querySelector(`.filters`);

// DATA
let tasksArr = [
  {
    id: 1,
    title: `megumi`,
    description: `will take over megumi's body.`,
    favorite: true,
  },
  { id: 2, title: `title`, description: `description`, favorite: false },
  { id: 3, title: `title`, description: `description`, favorite: false },
];

let currentFilter = `all`;

// LOCAL STORAGE
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasksArr));
}

function loadTasks() {
  let storedData = localStorage.getItem("tasks");
  if (storedData) {
    tasksArr = JSON.parse(storedData);
  } else {
    saveTasks();
  }
}

// UI RENDER
function createTaskElement(obj) {
  let articleContainer = document.createElement(`article`);
  let taskContentDiv = document.createElement(`div`);
  let titleDiv = document.createElement(`div`);
  let descriptionDiv = document.createElement(`div`);
  let crudDiv = document.createElement(`div`);
  let starDiv = document.createElement(`div`);
  let trashDiv = document.createElement(`div`);

  articleContainer.className = `task`;
  taskContentDiv.className = `task-content`;
  crudDiv.className = `crud`;
  starDiv.className = `fa-solid fa-star`;
  trashDiv.className = `fa-solid fa-trash`;

  articleContainer.dataset.id = obj.id;

  titleDiv.textContent = obj.title;
  descriptionDiv.textContent = obj.description;

  if (obj.favorite) {
    starDiv.classList.add(`favorite`);
    articleContainer.classList.add(`favorite-task`);
  }

  taskContentDiv.appendChild(titleDiv);
  taskContentDiv.appendChild(descriptionDiv);

  crudDiv.appendChild(starDiv);
  crudDiv.appendChild(trashDiv);

  articleContainer.appendChild(taskContentDiv);
  articleContainer.appendChild(crudDiv);

  return articleContainer;
}

function renderTask() {
  mainTasks.innerHTML = ``;

  // ✅ فلترة بالداتا
  let visibleTasks = tasksArr;

  if (currentFilter === "favorite") {
    visibleTasks = tasksArr.filter((t) => t.favorite);
  } else if (currentFilter === "tomorrow") {
    // لسه مش معمول عندك (هتتزود بعدين لو ضفت date)
    visibleTasks = tasksArr;
  }

  visibleTasks.forEach((task) => {
    mainTasks.appendChild(createTaskElement(task));
  });
}

// INIT
loadTasks();
renderTask();

// PLUS TOGGLE
let toggleFn = function () {
  hideClass.classList.toggle(`hidden`);
  iPlus.classList.toggle(`fa-plus`);
  iPlus.classList.toggle(`fa-x`);
  inpTask.focus();
};
plusBtn.addEventListener(`click`, toggleFn);

inpTask.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addBtn.click();
  }
});

// ADD
function addNewTask() {
  let content = inpTask.value.trim();
  if (!content) return;

  let updatedId = tasksArr.length
    ? Math.max(...tasksArr.map((t) => t.id)) + 1
    : 1;

  tasksArr.push({
    id: updatedId,
    title: `Title`,
    description: content,
    favorite: false,
  });

  saveTasks();
  renderTask();
}

addBtn.addEventListener(`click`, () => {
  addNewTask();
  inpTask.focus();
  inpTask.value = ``;
});

// DELETE & FAVORITE (event delegation)
mainTasks.addEventListener(`click`, (e) => {
  let taskEl = e.target.closest(".task");
  if (!taskEl) return;

  let idN = Number(taskEl.dataset.id);
  let index = tasksArr.findIndex((t) => t.id === idN);
  if (index === -1) return;

  if (e.target.classList.contains(`fa-trash`)) {
    tasksArr.splice(index, 1);
    saveTasks();
    renderTask();
  } else if (e.target.classList.contains(`fa-star`)) {
    tasksArr[index].favorite = !tasksArr[index].favorite;
    saveTasks();
    renderTask();
  }
});

// FILTERS + ACTIVE BUTTONS ✅
filtersParent.addEventListener(`click`, (e) => {
  let btn = e.target.closest(".filter");
  if (!btn) return;

  let dataFilterattr = btn.dataset.filter; // all / favorite / tomorrow / plus
  if (!dataFilterattr || dataFilterattr === "plus") return;

  // ✅ active UX
  document
    .querySelectorAll(".filters .filter")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");

  // ✅ change state + render
  currentFilter = dataFilterattr;
  renderTask();
});
