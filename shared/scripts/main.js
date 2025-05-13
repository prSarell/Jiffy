// /jiffy/shared/scripts/main.js
let categories = [
  { id: 1, name: "Home", color: "#1E3A8A" },
  { id: 2, name: "Life", color: "#3B82F6" },
  { id: 3, name: "Work", color: "#60A5FA" },
  { id: 4, name: "School", color: "#93C5FD" }
];

let selectMode = false;
const selectedCategories = new Set();

function renderCategories() {
  const categoryContainer = document.getElementById("category-container");
  if (!categoryContainer) {
    console.error("renderCategories: Category container not found");
    return;
  }

  categoryContainer.innerHTML = "";
  categories.forEach((category, index) => {
    const categoryDiv = document.createElement("div");
    categoryDiv.className = "category-item";
    categoryDiv.dataset.id = category.id;
    categoryDiv.innerHTML = `
      <button class="category-button" style="background-color: ${category.color};">
        <span class="category-specific-button">
          <span class="inner-circle"></span>
        </span>
      </button>
      <span class="category-label">${category.name}</span>
    `;
    categoryContainer.appendChild(categoryDiv);
    console.log(`renderCategories: Rendered ${category.name} with color ${category.color}`);
  });

  if (selectMode) {
    document.querySelectorAll('.category-specific-button').forEach(button => {
      button.classList.add('active');
      button.style.display = 'block';
    });
  }
}

function init() {
  console.log("init: Initializing Jiffy");
  const addButton = document.getElementById("add-button");
  const addForm = document.getElementById("add-form");
  const confirmAdd = document.getElementById("confirm-add");
  const cancelAdd = document.getElementById("cancel-add");
  const categoryInput = document.getElementById("category-input");
  const selectButton = document.getElementById("select-button");
  const selectContainer = document.getElementById("select-container");

  if (!addButton || !addForm || !confirmAdd || !cancelAdd || !categoryInput || !selectButton || !selectContainer) {
    console.error("init: Required DOM elements missing");
    return;
  }

  addButton.addEventListener("click", () => {
    addForm.style.display = 'flex';
  });

  confirmAdd.addEventListener("click", () => {
    const name = categoryInput.value.trim();
    if (name) {
      const colors = ['#1E3A8A', '#15803D', '#B91C1C', '#6B21A8', '#EA580C'];
      const newCategory = {
        id: categories.length + 1,
        name,
        color: colors[categories.length % colors.length]
      };
      categories.push(newCategory);
      renderCategories();
      addForm.style.display = 'none';
      categoryInput.value = '';
    } else {
      alert("Please enter a category name!");
    }
  });

  cancel