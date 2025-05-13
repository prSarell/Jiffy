// /jiffy/shared/scripts/main.js
import { getCategories } from './categoryManagement.js';
import { getColor } from './colorManagement.js';

function renderCategories() {
  console.log("renderCategories: Rendering categories");
  const categoryContainer = document.getElementById("category-container");
  if (!categoryContainer) {
    console.error("renderCategories: Category container not found");
    return;
  }

  const categories = getCategories();
  if (!Array.isArray(categories)) {
    console.error("renderCategories: Invalid categories, expected an array");
    return;
  }

  categoryContainer.innerHTML = "";
  categories.forEach((category, index) => {
    const categoryDiv = document.createElement("div");
    categoryDiv.className = "category-item";
    const color = getColor(category.name, index);
    categoryDiv.innerHTML = `
      <button class="category-button" style="background-color: ${color};">
        <span class="category-specific-button">
          <span class="inner-circle"></span>
        </span>
      </button>
      <span class="category-label">${category.name}</span>
    `;
    categoryContainer.appendChild(categoryDiv);
    console.log(`renderCategories: Rendered ${category.name} with color ${color}`);
  });
}

function init() {
  console.log("init: Initializing Jiffy");
  renderCategories();
}

document.addEventListener("DOMContentLoaded", init);