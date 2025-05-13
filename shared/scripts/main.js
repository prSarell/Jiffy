// /jiffy/shared/scripts/main.js
// Initializes and renders Jiffy’s UI

import { getCategories } from './categoryManagement.js';
import { getColor } from './colorManagement.js';

// Render category buttons
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

  categoryContainer.innerHTML = ""; // Clear existing content

  categories.forEach((category, index) => {
    const button = document.createElement("button");
    button.textContent = category.name || "Unnamed";
    const color = getColor(category.name, index);
    button.style.backgroundColor = color || "#1E3A8A"; // Fallback to Blue-900
    button.className = "category-button";
    // Placeholder click handler for testing
    button.addEventListener("click", () => {
      console.log(`Clicked category: ${category.name}`);
    });
    categoryContainer.appendChild(button);
    console.log(`renderCategories: Rendered ${category.name} with color ${color}`);
  });
}

// Initialize the app
function init() {
  console.log("init: Initializing Jiffy");
  renderCategories();
}

// Run initialization after DOM is ready
document.addEventListener("DOMContentLoaded", init);