// Path: /jiffy/pages/prompts/scripts.js
// Purpose: Initializes the Prompts page, manages prompt display, cycle duration settings, swipe-to-delete, and handles adding, editing, and importance toggling of prompts via popups and weight icons, saving to localStorage.

import { addPrompt, getPrompts, updatePrompt, removePrompt } from './promptManagement.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded: Initializing prompts page');
  initializePromptsPage();
});

function initializePromptsPage() {
  console.log('initializePromptsPage: Starting initialization');
  const promptList = document.querySelector('.prompt-list');
  const addPromptButton = document.getElementById('add-prompt-button');
  const addPromptPopup = document.getElementById('add-prompt-popup');
  const editPromptPopup = document.getElementById('edit-prompt-popup');
  const cycleDurationInput = document.getElementById('cycle-duration');

  if (!promptList || !addPromptButton || !addPromptPopup) {
    console.error('initializePromptsPage: Required DOM elements not found:', { promptList, addPromptButton, addPromptPopup });
    return;
  }
  if (!editPromptPopup) {
    console.warn('initializePromptsPage: Edit prompt popup not found, editing disabled');
  }
  if (!cycleDurationInput) {
    console.warn('initializePromptsPage: Cycle duration input not found');
  }

  if (addPromptPopup.style.display !== 'none') addPromptPopup.style.display = 'none';
  if (editPromptPopup && editPromptPopup.style.display !== 'none') editPromptPopup.style.display = 'none';

  // Initialize cycle duration from localStorage
  if (cycleDurationInput) {
    cycleDurationInput.value = localStorage.getItem('cycleDurationMMSS') || '00:08';
    cycleDurationInput.addEventListener('change', () => {
      const value = cycleDurationInput.value;
      const regex = /^([0-5][0-9]):([0-5][0-9])$/;
      if (regex.test(value)) {
        const [minutes, seconds] = value.split(':').map(Number);
        const totalSeconds = minutes * 60 + seconds;
        if (totalSeconds >= 1) {
          localStorage.setItem('cycleDuration', totalSeconds * 1000); // Store in milliseconds
          localStorage.setItem('cycleDurationMMSS', value); // Store MM:SS for display
          console.log('Cycle duration updated:', totalSeconds, 'seconds');
        } else {
          cycleDurationInput.value = '00:01';
          localStorage.setItem('cycleDuration', '1000');
          localStorage.setItem('cycleDurationMMSS', '00:01');
          console.warn('Cycle duration set to minimum: 1 second');
        }
      } else {
        cycleDurationInput.value = '00:08';
        localStorage.setItem('cycleDuration', '8000');
        localStorage.setItem('cycleDurationMMSS', '00:08');
        console.warn('Invalid MM:SS format, reset to default: 8 seconds');
      }
    });
  }

  let editingPromptId = null;

  // Load prompts
  function loadPrompts() {
    console.log('loadPrompts: Loading prompts');
    const prompts = getPrompts();
    console.log('loadPrompts: Prompts retrieved:', prompts);
    promptList.innerHTML = '';
    if (prompts.length === 0) {
      console.log('loadPrompts: No prompts to display');
    }
    prompts.sort((a, b) => (b.weighted ? 1 : 0) - (a.weighted ? 1 : 0));
    prompts.forEach(prompt => {
      if (!prompt.id || !prompt.text) {
        console.error('loadPrompts: Invalid prompt:', prompt);
        return;
      }
      console.log('loadPrompts: Rendering prompt:', prompt);
      const promptItem = document.createElement('div');
      promptItem.className = `prompt-item${prompt.weighted ? ' weighted' : ''}`;
      promptItem.dataset.promptId = prompt.id;
      const timeDisplay = prompt.dueTime ? new Date(prompt.dueTime).toLocaleString() : '';
      promptItem.innerHTML = `
        <span>${prompt.text}${timeDisplay ? ` (Due: ${timeDisplay})` : ''}</span>
        <span class="weight-icon${prompt.weighted ? ' weighted' : ''}" data-prompt-id="${prompt.id}">${prompt.weighted ? '★' : '☆'}</span>
        <button class="delete-button" data-prompt-id="${prompt.id}">Delete</button>
      `;
      if (editPromptPopup) {
        promptItem.querySelector('span:not(.weight-icon)').addEventListener('click', () => showEditPromptPopup(prompt));
      }
      promptItem.querySelector('.weight-icon').addEventListener('click', (event) => {
        console.log('weightIcon: Toggling weight for prompt ID:', prompt.id);
        updatePrompt(prompt.id, prompt.text, !prompt.weighted, prompt.dueTime);
        loadPrompts();
      });
      promptItem.querySelector('.delete-button').addEventListener('click', (event) => {
        event.stopPropagation();
        console.log('deletePrompt: Deleting prompt ID:', prompt.id);
        removePrompt(prompt.id);
        loadPrompts();
      });

      // Swipe-to-delete
      let startX = 0;
      let currentX = 0;
      let isSwiping = false;

      promptItem.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isSwiping = true;
        promptItem.style.transition = 'none';
      });

      promptItem.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        currentX = e.touches[0].clientX;
        const diffX = currentX - startX;
        if (diffX <= 0 && diffX >= -60) { // Right-to-left swipe, max 60px
          promptItem.style.transform = `translateX(${diffX}px)`;
        }
      });

      promptItem.addEventListener('touchend', () => {
        isSwiping = false;
        promptItem.style.transition = 'transform 0.3s ease';
        if (currentX - startX < -30) { // Swipe threshold
          promptItem.style.transform = 'translateX(-60px)';
          promptItem.classList.add('swiped');
        } else {
          promptItem.style.transform = 'translateX(0)';
          promptItem.classList.remove('swiped');
        }
      });

      promptList.appendChild(promptItem);
    });
    console.log(`loadPrompts: Loaded ${prompts.length} prompts, list HTML:`, promptList.innerHTML);
  }

  // Show add prompt popup
  function showAddPromptPopup() {
    console.log('showAddPromptPopup: Opening add prompt popup');
    const input = document.getElementById('prompt-input');
    const timeInput = document.getElementById('prompt-time');
    if (!input || !timeInput) {
      console.error('showAddPromptPopup: Prompt inputs not found');
      return;
    }
    input.value = '';
    timeInput.value = '';
    addPromptPopup.style.display = 'flex';
    input.focus();
  }

  // Close add prompt popup
  function closeAddPromptPopup() {
    console.log('closeAddPromptPopup: Closing add prompt popup');
    const input = document.getElementById('prompt-input');
    if (!input) {
      console.error('closeAddPromptPopup: Prompt input not found');
      return;
    }
    input.value = '';
    addPromptPopup.style.display = 'none';
  }

  // Show edit prompt popup
  function showEditPromptPopup(prompt) {
    if (!editPromptPopup) {
      console.warn('showEditPromptPopup: Edit prompt popup not available');
      return;
    }
    console.log('showEditPromptPopup: Opening edit prompt popup for:', prompt);
    const input = document.getElementById('edit-prompt-input');
    const timeInput = document.getElementById('edit-prompt-time');
    if (!input || !timeInput) {
      console.error('showEditPromptPopup: Edit prompt inputs not found');
      return;
    }
    input.value = prompt.text;
    timeInput.value = prompt.dueTime ? new Date(prompt.dueTime).toISOString().slice(0, 16) : '';
    editingPromptId = prompt.id;
    editPromptPopup.style.display = 'flex';
    input.focus();
  }

  // Close edit prompt popup
  function closeEditPromptPopup() {
    if (!editPromptPopup) {
      console.warn('closeEditPromptPopup: Edit prompt popup not available');
      return;
    }
    console.log('closeEditPromptPopup: Closing edit prompt popup');
    const input = document.getElementById('edit-prompt-input');
    if (!input) {
      console.error('closeEditPromptPopup: Edit prompt input not found');
      return;
    }
    input.value = '';
    editingPromptId = null;
    editPromptPopup.style.display = 'none';
  }

  // Add event listener for add prompt button
  addPromptButton.addEventListener('click', (event) => {
    console.log('addPromptButton: Add prompt button clicked');
    event.stopPropagation();
    event.preventDefault();
    showAddPromptPopup();
  });

  // Add event listener for popup buttons
  document.addEventListener('click', (event) => {
    const popupButton = event.target.closest('.popup-button');
    if (!popupButton) return;
    const action = popupButton.getAttribute('data-action');
    console.log(`click: Popup button clicked with action: ${action}`);

    if (action === 'confirm') {
      if (popupButton.closest('#add-prompt-popup')) {
        const input = document.getElementById('prompt-input');
        const timeInput = document.getElementById('prompt-time');
        if (!input || !timeInput) {
          console.error('click: Prompt inputs not found');
          return;
        }
        const promptText = input.value.trim();
        if (promptText) {
          const prompt = {
            id: Date.now(),
            text: promptText,
            done: false,
            weighted: false,
            dueTime: timeInput.value ? new Date(timeInput.value).toISOString() : null
          };
          addPrompt(prompt);
          loadPrompts();
          closeAddPromptPopup();
        } else {
          alert('Please enter a prompt!');
        }
      } else if (popupButton.closest('#edit-prompt-popup') && editPromptPopup) {
        const input = document.getElementById('edit-prompt-input');
        const timeInput = document.getElementById('edit-prompt-time');
        if (!input || !timeInput) {
          console.error('click: Edit prompt inputs not found');
          return;
        }
        const promptText = input.value.trim();
        if (promptText && editingPromptId !== null) {
          const prompt = getPrompts().find(p => p.id === editingPromptId);
          updatePrompt(editingPromptId, promptText, prompt.weighted, timeInput.value ? new Date(timeInput.value).toISOString() : null);
          loadPrompts();
          closeEditPromptPopup();
        } else {
          alert('Please enter a prompt!');
        }
      }
    } else if (action === 'cancel') {
      if (popupButton.closest('#add-prompt-popup')) {
        closeAddPromptPopup();
      } else if (popupButton.closest('#edit-prompt-popup') && editPromptPopup) {
        closeEditPromptPopup();
      }
    }
  });

  // Initialize cycle duration from localStorage
  if (cycleDurationInput) {
    cycleDurationInput.value = localStorage.getItem('cycleDurationMMSS') || '00:08';
    cycleDurationInput.addEventListener('change', () => {
      const value = cycleDurationInput.value;
      const regex = /^([0-5][0-9]):([0-5][0-9])$/;
      if (regex.test(value)) {
        const [minutes, seconds] = value.split(':').map(Number);
        const totalSeconds = minutes * 60 + seconds;
        if (totalSeconds >= 1) {
          localStorage.setItem('cycleDuration', totalSeconds * 1000);
          localStorage.setItem('cycleDurationMMSS', value);
          console.log('Cycle duration updated:', totalSeconds, 'seconds');
        } else {
          cycleDurationInput.value = '00:01';
          localStorage.setItem('cycleDuration', '1000');
          localStorage.setItem('cycleDurationMMSS', '00:01');
          console.warn('Cycle duration set to minimum: 1 second');
        }
      } else {
        cycleDurationInput.value = '00:08';
        localStorage.setItem('cycleDuration', '8000');
        localStorage.setItem('cycleDurationMMSS', '00:08');
        console.warn('Invalid MM:SS format, reset to default: 8 seconds');
      }
    });
  }

  // Initial load
  loadPrompts();
}