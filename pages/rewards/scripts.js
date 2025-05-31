// Path: /jiffy/pages/rewards/scripts.js
// Purpose: Initializes the Rewards page, manages reward display, and handles adding, editing, and importance toggling of rewards via popups and weight icons, saving to localStorage.

import { addReward, getRewards, updateReward, removeReward } from './rewardManagement.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded: Initializing rewards page');
  initializeRewardsPage();
});

function initializeRewardsPage() {
  console.log('initializeRewardsPage: Starting initialization');
  const rewardList = document.querySelector('.reward-list');
  const addRewardButton = document.getElementById('add-reward-button');
  const addRewardPopup = document.getElementById('add-reward-popup');
  const editRewardPopup = document.getElementById('edit-reward-popup');

  if (!rewardList || !addRewardButton || !addRewardPopup) {
    console.error('initializeRewardsPage: Required DOM elements not found:', { rewardList, addRewardButton, addRewardPopup });
    return;
  }
  if (!editRewardPopup) {
    console.warn('initializeRewardsPage: Edit reward popup not found, editing disabled');
  }

  if (addRewardPopup.style.display !== 'none') addRewardPopup.style.display = 'none';
  if (editRewardPopup && editRewardPopup.style.display !== 'none') editRewardPopup.style.display = 'none';

  let editingRewardId = null;

  // Load rewards
  function loadRewards() {
    console.log('loadRewards: Loading rewards');
    const rewards = getRewards();
    console.log('loadRewards: Rewards retrieved:', rewards);
    rewardList.innerHTML = '';
    if (rewards.length === 0) {
      console.log('loadRewards: No rewards to display');
    }
    rewards.sort((a, b) => (b.weighted ? 1 : 0) - (a.weighted ? 1 : 0));
    rewards.forEach(reward => {
      if (!reward.id || !reward.text) {
        console.error('loadRewards: Invalid reward:', reward);
        return;
      }
      console.log('loadRewards: Rendering reward:', reward);
      const rewardItem = document.createElement('div');
      rewardItem.className = `reward-item${reward.weighted ? ' weighted' : ''}`;
      rewardItem.dataset.rewardId = reward.id;
      const timeDisplay = reward.dueTime ? new Date(reward.dueTime).toLocaleString() : '';
      rewardItem.innerHTML = `
        <span class="reward-text">${reward.text}${timeDisplay ? ` (Due: ${timeDisplay})` : ''}</span>
        <span class="weight-icon${reward.weighted ? ' weighted' : ''}" data-reward-id="${reward.id}">${reward.weighted ? '★' : '☆'}</span>
        <button class="delete-button" data-reward-id="${reward.id}">Delete</button>
      `;
      if (editRewardPopup) {
        rewardItem.querySelector('.reward-text').addEventListener('click', (event) => {
          event.stopPropagation();
          showEditRewardPopup(reward);
        });
      }
      rewardItem.querySelector('.weight-icon').addEventListener('click', (event) => {
        event.stopPropagation();
        console.log('weightIcon: Toggling weight for reward ID:', reward.id);
        updateReward(reward.id, reward.text, !reward.weighted, reward.dueTime);
        loadRewards();
      });
      rewardItem.querySelector('.delete-button').addEventListener('click', (event) => {
        event.stopPropagation();
        console.log('deleteReward: Deleting reward ID:', reward.id);
        removeReward(reward.id);
        loadRewards();
      });

      // Swipe-to-delete
      let startX = 0;
      let currentX = 0;
      let isSwiping = false;

      rewardItem.addEventListener('touchstart', (e) => {
        if (e.target.classList.contains('weight-icon') || e.target.classList.contains('delete-button')) return;
        startX = e.touches[0].clientX;
        isSwiping = true;
        rewardItem.style.transition = 'none';
      });

      rewardItem.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        currentX = e.touches[0].clientX;
        const diffX = currentX - startX;
        if (diffX <= 0 && diffX >= -60) {
          rewardItem.style.transform = `translateX(${diffX}px)`;
        }
      });

      rewardItem.addEventListener('touchend', () => {
        isSwiping = false;
        rewardItem.style.transition = 'transform 0.3s ease';
        if (currentX - startX < -30) {
          rewardItem.style.transform = 'translateX(-60px)';
          rewardItem.classList.add('swiped');
        } else {
          rewardItem.style.transform = 'translateX(0)';
          rewardItem.classList.remove('swiped');
        }
      });

      rewardList.appendChild(rewardItem);
    });
    console.log(`loadRewards: Loaded ${rewards.length} rewards, list HTML:`, rewardList.innerHTML);
  }

  // Show add reward popup
  function showAddRewardPopup() {
    console.log('showAddRewardPopup: Opening add reward popup');
    const input = document.getElementById('reward-input');
    const timeInput = document.getElementById('reward-time');
    if (!input || !timeInput) {
      console.error('showAddRewardPopup: Reward inputs not found');
      return;
    }
    input.value = '';
    timeInput.value = '';
    addRewardPopup.style.display = 'flex';
    input.focus();
  }

  // Close add reward popup
  function closeAddRewardPopup() {
    console.log('closeAddRewardPopup: Closing add reward popup');
    const input = document.getElementById('reward-input');
    if (!input) {
      console.error('closeAddRewardPopup: Reward input not found');
      return;
    }
    input.value = '';
    addRewardPopup.style.display = 'none';
  }

  // Show edit reward popup
  function showEditRewardPopup(reward) {
    if (!editRewardPopup) {
      console.warn('showEditRewardPopup: Edit reward popup not available');
      return;
    }
    console.log('showEditRewardPopup: Opening edit reward popup for:', reward);
    const input = document.getElementById('edit-reward-input');
    const timeInput = document.getElementById('edit-reward-time');
    if (!input || !timeInput) {
      console.error('showEditRewardPopup: Edit reward inputs not found');
      return;
    }
    input.value = reward.text;
    timeInput.value = reward.dueTime ? new Date(reward.dueTime).toISOString().slice(0, 16) : '';
    editingRewardId = reward.id;
    editRewardPopup.style.display = 'flex';
    input.focus();
  }

  // Close edit reward popup
  function closeEditRewardPopup() {
    if (!editRewardPopup) {
      console.warn('closeEditRewardPopup: Edit reward popup not available');
      return;
    }
    console.log('closeEditRewardPopup: Closing edit reward popup');
    const input = document.getElementById('edit-reward-input');
    if (!input) {
      console.error('closeEditRewardPopup: Edit reward input not found');
      return;
    }
    input.value = '';
    editingRewardId = null;
    editRewardPopup.style.display = 'none';
  }

  // Add event listener for add reward button
  addRewardButton.addEventListener('click', (event) => {
    console.log('addRewardButton: Add reward button clicked');
    event.stopPropagation();
    event.preventDefault();
    showAddRewardPopup();
  });

  // Add event listener for popup buttons
  document.addEventListener('click', (event) => {
    const popupButton = event.target.closest('.popup-button');
    if (!popupButton) return;
    const action = popupButton.getAttribute('data-action');
    console.log(`click: Popup button clicked with action: ${action}`);

    if (action === 'confirm') {
      if (popupButton.closest('#add-reward-popup')) {
        const input = document.getElementById('reward-input');
        const timeInput = document.getElementById('reward-time');
        if (!input || !timeInput) {
          console.error('click: Reward inputs not found');
          return;
        }
        const rewardText = input.value.trim();
        if (rewardText) {
          const reward = {
            id: Date.now(),
            text: rewardText,
            done: false,
            weighted: false,
            dueTime: timeInput.value ? new Date(timeInput.value).toISOString() : null
          };
          addReward(reward);
          loadRewards();
          closeAddRewardPopup();
        } else {
          alert('Please enter a reward message!');
        }
      } else if (popupButton.closest('#edit-reward-popup') && editRewardPopup) {
        const input = document.getElementById('edit-reward-input');
        const timeInput = document.getElementById('edit-reward-time');
        if (!input || !timeInput) {
          console.error('click: Edit reward inputs not found');
          return;
        }
        const rewardText = input.value.trim();
        if (rewardText && editingRewardId !== null) {
          const reward = getRewards().find(r => r.id === editingRewardId);
          updateReward(editingRewardId, rewardText, reward.weighted, timeInput.value ? new Date(timeInput.value).toISOString() : null);
          loadRewards();
          closeEditRewardPopup();
        } else {
          alert('Please enter a reward message!');
        }
      }
    } else if (action === 'cancel') {
      if (popupButton.closest('#add-reward-popup')) {
        closeAddRewardPopup();
      } else if (popupButton.closest('#edit-reward-popup') && editRewardPopup) {
        closeEditRewardPopup();
      }
    }
  });

  // Initial load
  loadRewards();
}
