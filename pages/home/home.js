function renderCategories(categories) {
  const list = document.getElementById('category-list');
  list.innerHTML = '';
  categories.forEach(category => {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'category-item';

    const nameSpan = document.createElement('span');
    nameSpan.textContent = category.name;
    categoryDiv.appendChild(nameSpan);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = () => deleteCategory(category.name);
    categoryDiv.appendChild(deleteBtn);

    list.appendChild(categoryDiv);
  });
}

function deleteCategory(categoryName) {
  let categories = window.loadCategories() || [];
  categories = categories.filter(cat => cat.name !== categoryName);
  window.saveCategories(categories);
  renderCategories(categories);
}

document.addEventListener('DOMContentLoaded', () => {
  let categories = window.loadCategories() || [];
  if (categories.length === 0) {
    categories = [
      { name: 'Home', color: '#C8E6C9' },
      { name: 'Work', color: '#A5D6A7' },
      { name: 'School', color: '#81C784' }
    ];
    window.saveCategories(categories);
  }
  renderCategories(categories);

  const form = document.querySelector('#add-category-dialog form');
  form.onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById('category-name').value.trim();
    const color = document.getElementById('category-color').value;
    if (!name) return;

    let categories = window.loadCategories() || [];
    if (categories.some(cat => cat.name === name)) {
      alert('Category already exists!');
      return;
    }

    categories.push({ name, color });
    window.saveCategories(categories);
    renderCategories(categories);
    document.getElementById('add-category-dialog').close();
    form.reset();
  };
});