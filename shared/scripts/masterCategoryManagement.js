// File: /jiffy/shared/scripts/masterCategoryManagement.js
// Purpose: Render and manage master category buttons as tabs on the homepage.

const masterCategories = ['Home', 'Life', 'Work', 'School'];
let selectedCategory = 'Home';

function renderMasterCategories(container, onSelect) {
  container.innerHTML = '';

  masterCategories.forEach((category) => {
    const button = document.createElement('button');
    button.className = 'category-button master';
    button.textContent = '';
    button.style.width = '40px';
    button.style.height = '40px';
    button.style.borderRadius = '50%';
    button.style.cursor = 'pointer';
    button.style.backgroundColor = getMasterColor(category);
    button.style.margin = '0 5px';
    button.style.position = 'relative';

    if (category === selectedCategory) {
      button.classList.add('selected');
    }

    button.addEventListener('click', () => {
      selectedCategory = category;
      renderMasterCategories(container, onSelect);
      onSelect(category);
    });

    const label = document.createElement('span');
    label.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    label.style.fontSize = '8px';
    label.style.marginTop = '5px';
    label.style.display = 'block';
    label.style.textAlign = 'center';
    label.textContent = category;

    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.alignItems = 'center';
    wrapper.appendChild(button);
    wrapper.appendChild(label);

    container.appendChild(wrapper);
  });
}

function getMasterColor(category) {
  switch (category) {
    case 'Home': return '#1E3A8A'; // Navy blue
    case 'Life': return '#3B82F6'; // Bright blue
    case 'Work': return '#60A5FA'; // Mid blue
    case 'School': return '#93C5FD'; // Light blue
    default: return '#1E3A8A';
  }
}

export { renderMasterCategories };
