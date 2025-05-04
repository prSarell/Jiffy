// Initialize categories from local storage
document.addEventListener('DOMContentLoaded', () => {
  window.categories = window.loadCategories() || [
    { name: 'Home', buttonColor: '#4CAF50' },
    { name: 'Work', buttonColor: '#2196F3' },
    { name: 'School', buttonColor: '#FF9800' }
  ];
  renderCategories();
});

// Render category buttons
function renderCategories() {
  const categoriesSection = document.getElementById('categories');
  categoriesSection.innerHTML = '';
  window.categories.forEach((category, index) => {
    const button = document.createElement('button');
    button.className = 'bg-gray-200 p-4 rounded text-center hover:bg-gray-300';
    button.style.backgroundColor = category.buttonColor;
    button.textContent = category.name;
    button.addEventListener('click', () => {
      window.location.href = `/jiffy/pages/category/?id=${index}`;
    });
    categoriesSection.appendChild(button);
  });
}

// Add category dialog
document.getElementById('addCategoryBtn').addEventListener('click', () => {
  const name = prompt('Enter category name:');
  if (name) {
    window.categories.push({ name, buttonColor: '#4CAF50' });
    window.saveCategories(window.categories);
    renderCategories();
  }
});

// Navigate to prompts/rewards
document.getElementById('promptsBtn').addEventListener('click', () => {
  window.location.href = '/jiffy/pages/prompts/';
});
document.getElementById('rewardsBtn').addEventListener('click', () => {
  window.location.href = '/jiffy/pages/rewards/';
});
