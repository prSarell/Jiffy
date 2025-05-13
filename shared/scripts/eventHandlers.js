// /jiffy/shared/scripts/eventHandlers.js
import { addCategory } from './categoryActions.js';
import { getCategories, saveCategories } from './categoryManagement.js';

let selectMode = false;
const selectedCategories = new Set();

export function setupEventHandlers() {
  const addButton = document.getElementById("add-button");
  const addForm = document.getElementById("add-form");
  const confirmAdd = document.getElementById("confirm-add");
  const cancelAdd = document.getElementById("cancel-add");
  const categoryInput = document.getElementById("category-input");
  const selectButton = document.getElementById("select-button");
  const selectContainer = document.getElementById("select-container");
  const categoryContainer = document.getElementById("category-container");

  if (!addButton || !addForm || !confirmAdd || !cancelAdd || !categoryInput || !selectButton || !selectContainer || !categoryContainer) {
    console.error("setupEventHandlers: Required DOM elements missing");
    return;
  }

  addButton.addEventListener("click", () => {
    addForm.style.display = 'flex';
  });

  confirmAdd.addEventListener("click", () => {
    const name = categoryInput.value.trim();
    if (name) {
      addCategory(name);
      addForm.style.display = 'none';
      categoryInput.value = '';
    } else {
      alert("Please enter a category name!");
    }
  });

  cancelAdd.addEventListener("click", () => {
    addForm.style.display = 'none';
    categoryInput.value = '';
  });

  selectButton.addEventListener("click", () => {
    selectMode = true;
    selectContainer.innerHTML = `
      <span id="delete-button">Delete</span>
      <span id="cancel-button">Cancel</span>
    `;
    document.querySelectorAll('.category-specific-button').forEach(button => {
      button.classList.add('active');
      button.style.display = 'block';
    });
    setupSelectHandlers();
  });

  function setupSelectHandlers() {
    const deleteButton = document.getElementById("delete-button");
    const cancelButton = document.getElementById("cancel-button");
    if (!deleteButton || !cancelButton) {
      console.error("setupSelectHandlers: Delete or Cancel button not found");
      return;
    }

    cancelButton.addEventListener("click", () => {
      selectMode = false;
      selectedCategories.clear();
      selectContainer.innerHTML = '<span id="select-button">Select</span>';
      document.querySelectorAll('.category-specific-button').forEach(button => {
        button.classList.remove('active');
        button.style.display = 'none';
        const innerCircle = button.querySelector('.inner-circle');
        if (innerCircle) innerCircle.style.display = 'none';
      });
      renderCategories();
    });

    deleteButton.addEventListener("click", () => {
      if (selectedCategories.size === 0) {
        alert("Please select at least one category to delete.");
        return;
      }
      const categories = getCategories();
      const updatedCategories = categories.filter(cat => !selectedCategories.has(cat.id.toString()));
      saveCategories(updatedCategories);
      selectMode = false;
      selectedCategories.clear();
      selectContainer.innerHTML = '<span id="select-button">Select</span>';
      document.querySelectorAll('.category-specific-button').forEach(button => {
        button.classList.remove('active');
        button.style.display = 'none';
        const innerCircle = button.querySelector('.inner-circle');
        if (innerCircle) innerCircle.style.display = 'none';
      });
      renderCategories();
    });
  }

  categoryContainer.addEventListener("click", (event) => {
    const categorySpecificButton = event.target.closest('.category-specific-button');
    if (categorySpecificButton && selectMode) {
      const categoryDiv = categorySpecificButton.closest('.category-item');
      if (!categoryDiv) return;
      const categoryId = categoryDiv.dataset.id;
      const innerCircle = categorySpecificButton.querySelector('.inner-circle');
      if (!innerCircle) return;
      if (selectedCategories.has(categoryId)) {
        selectedCategories.delete(categoryId);
        innerCircle.style.display = 'none';
      } else {
        selectedCategories.add(categoryId);
        innerCircle.classList.add('active');
        innerCircle.style.display = 'block';
      }
      console.log('Selected categories:', Array.from(selectedCategories));
    }
  });
}

function renderCategories() {
  const categoryContainer = document.getElementById("category-container");
  if (!categoryContainer) {
    console.error("renderCategories: Category container not found");
    return;
  }

  const categories = getCategories();
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