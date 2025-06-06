// File: /jiffy/shared/scripts/masterCategoryManagement.js
// Purpose: Renders and manages master category buttons on the homepage. Used to switch between tabs.

function renderMasterCategories(container, onClickCallback) {
  const masterCategories = ['Home', 'Work', 'Life', 'School'];
  container.innerHTML = ''; // Clear existing buttons

  masterCategories.forEach(category => {
    const wrapper = document.createElement('div');
    wrapper.className = 'category-item'; // This enables vertical stacking & alignment

    const button = document.createElement('button');
    const colorClass = `master-${category.toLowerCase()}`;
    button.className = `master-category-button ${colorClass}`;
    button.setAttribute('data-category', category);

    const label = document.createElement('span');
    label.textContent = category;
    label.className = 'master-category-label';

    // Button click handling
    button.addEventListener('click', () => {
      document.querySelectorAll('.master-category-button').forEach(btn => {
        btn.classList.remove('active');
      });
      button.classList.add('active');

      if (typeof onClickCallback === 'function') {
        onClickCallback(category);
      }
    });

    wrapper.appendChild(button);
    wrapper.appendChild(label);
    container.appendChild(wrapper);
  });
}
