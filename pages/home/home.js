document.addEventListener('DOMContentLoaded', () => {
  window.categories = window.loadCategories() || [
    { name: 'Home', buttonColor: '#4CAF50' },
    { name: 'Work', buttonColor: '#2196F3' },
    { name: 'School', buttonColor: '#FF9800' }
  ];
  renderCategories();

  // Add category dialog
  const dialog = document.getElementById('addCategoryDialog');
  const form = document.getElementById('addCategoryForm');
  document.getElementById('addCategoryBtn').addEventListener('click', () => dialog.showModal());
  document.getElementById('cancelAddCategory').addEventListener('click', () => dialog.close());
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('categoryName').value;
    const color = document.getElementById('categoryColor').value;
    window.categories.push({ name, buttonColor: color });
    window.saveCategories(window.categories);
    renderCategories();
    dialog.close();
    form.reset();
  });

  // Navigation
  document.getElementById('promptsBtn').addEventListener('click', () => {
    window.location.href = '/jiffy/pages/prompts/';
  });
  document.getElementById('rewardsBtn').addEventListener('click', () => {
    window.location.href = '/jiffy/pages/rewards/';
  });
});

function renderCategories() {
  const categoriesSection = document.getElementById('categories');
  categoriesSection.innerHTML = '';
  window.categories.forEach((category, index) => {
    const button = document.createElement('button');
    button.className = 'p-4 rounded text-center text-white font-medium';
    button.style.backgroundColor = category.buttonColor;
    button.textContent = category.name;
    button.addEventListener('click', () => {
      window.location.href = `/jiffy/pages/category/?id=${index}`;
    });
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.className = 'absolute top-0 right-0 text-red-500';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm(`Delete ${category.name}?`)) {
        window.categories.splice(index, 1);
        window.saveCategories(window.categories);
        renderCategories();
      }
    });
    const wrapper = document.createElement('div');
    wrapper.className = 'relative';
    wrapper.appendChild(button);
    wrapper.appendChild(deleteBtn);
    categoriesSection.appendChild(wrapper);
  });
}