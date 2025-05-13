// /jiffy/shared/scripts/categoryActions.js
export function addCategory(categoryName, appContext) {
  const { categoryRow, getColor, saveCategories, selectMode } = appContext;
  const categoryDivs = categoryRow.querySelectorAll('div');
  const position = categoryDivs.length;
  const newColor = getColor(categoryName, position);
  const newButton = document.createElement('div');
  newButton.style = 'display: flex; flex-direction: column; align-items: center; width: 40px; position: relative;';
  newButton.innerHTML = `
    <button style="width: 40px; height: 40px; border-radius: 50%; background-color: ${newColor}; cursor: pointer; border: none; position: relative;">
      <span class="category-specific-button" style="display: ${selectMode ? 'block' : 'none'};">
        <span class="inner-circle"></span>
      </span>
    </button>
    <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-top: 5px;">${categoryName}</span>
  `;
  categoryRow.appendChild(newButton);
  appContext.setCategories(saveCategories(categoryRow));
}
