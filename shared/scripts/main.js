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
    categoryDiv.style = "display: flex; flex-direction: column; align-items: center; width: 40px; position: relative;";
    const color = getColor(category.name, index);
    categoryDiv.innerHTML = `
      <button style="width: 40px; height: 40px; border-radius: 50%; background-color: ${color}; cursor: pointer; border: none; position: relative;">
        <span class="category-specific-button" style="display: none;">
          <span class="inner-circle"></span>
        </span>
      </button>
      <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10px; margin-top: 5px;">${category.name}</span>
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