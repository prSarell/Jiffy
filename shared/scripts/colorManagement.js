// shared/scripts/main.js
document.addEventListener('DOMContentLoaded', () => {
  const categoryRow = document.querySelector('.category-row');

  if (!categoryRow) {
    console.error('Category row not found');
    return;
  }

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
});