// shared/scripts/main.js
document.addEventListener('DOMContentLoaded', () => {
  const popup = document.getElementById('popup');
  const categoryRow = document.querySelector('.category-row');

  if (!popup || !categoryRow) {
    console.error('Required DOM elements not found:', { popup, categoryRow });
    return;
  }

  if (popup.style.display !== 'none') popup.style.display = 'none';

  const exampleCategories = [
    { name: 'Home', color: '#1666BA' },
    { name: 'Life', color: '#368CE7' },
    { name: 'Work', color: '#7AB3EF' },
    { name: 'School', color: '#BEDAF7' }
  ];

  categoryRow.innerHTML = ''; // Clear the category row
  exampleCategories.forEach(category => {
    const categoryDiv = document.createElement('div');
    categoryDiv.style = 'display: flex; flex-direction: column; align-items: center; width: 40px; position: relative;';
    categoryDiv.innerHTML = `
      <button style="width: 40px; height: 40px; border-radius: 50%; background-color: ${category.color}; cursor: pointer; border: none; position: relative;"></button>
      <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-top: 5px;">${category.name}</span>
    `;
    categoryRow.appendChild(categoryDiv);
  });

  console.log(`Loaded ${exampleCategories.length} categories into DOM`);

  function showAddPopup() {
    const title = document.getElementById('popup-title');
    const input = document.getElementById('category-input');
    if (!title || !input) {
      console.error('Popup elements not found:', { title, input });
      return;
    }
    title.textContent = 'Add Category';
    input.value = '';
    popup.style.display = 'flex';
    console.log('Show add popup');
  }

  function closePopup() {
    const input = document.getElementById('category-input');
    if (!input) {
      console.error('Category input not found');
      return;
    }
    input.value = '';
    popup.style.display = 'none';
    console.log('Close popup');
  }

  function addCategory(categoryName) {
    const defaultColor = '#1666BA'; // Default color for new categories
    const newButton = document.createElement('div');
    newButton.style = 'display: flex; flex-direction: column; align-items: center; width: 40px; position: relative;';
    newButton.innerHTML = `
      <button style="width: 40px; height: 40px; border-radius: 50%; background-color: ${defaultColor}; cursor: pointer; border: none; position: relative;"></button>
      <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-top: 5px;">${categoryName}</span>
    `;
    categoryRow.appendChild(newButton);
    console.log('Added category:', categoryName);
  }

  document.addEventListener('click', (event) => {
    const actionButton = event.target.closest('.action-button');
    if (actionButton) {
      const action = actionButton.getAttribute('data-action');
      console.log(`Action button clicked with action: ${action}`);
      if (action === 'add') {
        console.log('Attempting to show add popup');
        showAddPopup();
      } else if (action === 'show-rewards') {
        console.log('Rewards action not implemented');
      }
      return;
    }

    const popupButton = event.target.closest('.popup-button');
    if (popupButton) {
      const action = popupButton.getAttribute('data-action');
      console.log(`Popup button clicked with action: ${action}`);
      if (action === 'confirm') {
        console.log('Attempting to confirm add category');
        const input = document.getElementById('category-input');
        if (!input) {
          console.error('Category input not found');
          return;
        }
        const categoryName = input.value.trim();
        if (categoryName) {
          addCategory(categoryName);
          input.value = '';
          closePopup();
        } else {
          alert('Please enter a category name!');
          console.log('No category name entered');
        }
      } else if (action === 'cancel') {
        console.log('Attempting to close popup');
        closePopup();
      }
    }
  });
});