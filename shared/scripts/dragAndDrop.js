// shared/scripts/dragAndDrop.js
import { saveCategories } from './categoryManagement.js';

export function initializeDragAndDrop(categoryRow, saveCallback) {
  let draggedItem = null;

  categoryRow.addEventListener('dragstart', (event) => {
    const target = event.target.closest('div[draggable="true"]');
    if (target) {
      draggedItem = target;
      event.dataTransfer.setData('text/plain', ''); // Required for Firefox
      setTimeout(() => {
        target.style.opacity = '0.5';
      }, 0);
      console.log('Drag started:', draggedItem.querySelector('span:last-child').textContent);
    }
  });

  categoryRow.addEventListener('dragend', (event) => {
    if (draggedItem) {
      draggedItem.style.opacity = '1';
      draggedItem = null;
      saveCallback(); // Save the new order
      console.log('Drag ended');
    }
  });

  categoryRow.addEventListener('dragover', (event) => {
    event.preventDefault(); // Allow dropping
  });

  categoryRow.addEventListener('drop', (event) => {
    event.preventDefault();
    const target = event.target.closest('div[draggable="true"]');
    if (draggedItem && target && draggedItem !== target) {
      const allItems = Array.from(categoryRow.querySelectorAll('div[draggable="true"]'));
      const draggedIndex = allItems.indexOf(draggedItem);
      const targetIndex = allItems.indexOf(target);

      if (draggedIndex < targetIndex) {
        categoryRow.insertBefore(draggedItem, target.nextSibling);
      } else {
        categoryRow.insertBefore(draggedItem, target);
      }
      console.log('Dropped:', draggedItem.querySelector('span:last-child').textContent, 'before/after', target.querySelector('span:last-child').textContent);
    }
  });
}
