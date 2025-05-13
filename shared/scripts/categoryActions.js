// /jiffy/shared/scripts/categoryActions.js
import { getColor } from './colorManagement.js';
import { saveCategories } from './categoryManagement.js';

export function addCategory(categoryName, appContext) {
  console.log(`addCategory: Adding category: ${categoryName}`);
  const { categoryRow, setCategories, getColor } = appContext;
  const position = categoryRow.querySelectorAll('div').length;
  const color = getColor(categoryName, position);
  const categoryDiv = document.createElement('div');
  categoryDiv.style = 'display: flex; flex-direction: column; align-items: center; width: 40px; position: relative;';
  categoryDiv.innerHTML = `
    <button style="width: 40px; height: 40px; border-radius: 50%; background-color: ${color}; cursor: pointer; border: none; position: relative;">
      <span class="category-specific-button" style="display: none;">
        <span class="inner-circle"></span>
      </span>
    </button>
    <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-top: 5px;">${categoryName}</span>
  `;
  categoryRow.appendChild(categoryDiv);
  setCategories(saveCategories(categoryRow));
}