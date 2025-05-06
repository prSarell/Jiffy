<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jiffy - Home</title>
  <link rel="stylesheet" href="/jiffy/shared/styles.css">
  <link rel="manifest" href="/jiffy/manifest.json">
  <link rel="apple-touch-icon" href="/jiffy/assets/icon.png">
  <style>
    .category-row div[draggable="true"] {
      transition: opacity 0.3s ease;
    }
  </style>
</head>
<body style="background-color: #000000; color: #FFFFFF; height: 100vh; display: flex; flex-direction: column; justify-content: flex-start; align-items: center; margin: 0; padding: 0; position: relative; touch-action: manipulation;">
  <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 20px 20px 0 20px; box-sizing: border-box;">
    <div id="select-container" style="display: flex; align-items: center;">
      <span id="select-button" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin: 0; cursor: pointer;">Select</span>
    </div>
    <h1 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 20px; text-align: center; margin: 0; font-weight: normal;">Jiffy</h1>
    <div style="font-size: 24px; font-weight: 300; line-height: 1; cursor: pointer;">☰</div>
  </div>
  <div style="display: flex; flex-direction: column; align-items: center; margin-top: 30px;">
    <div style="display: flex; justify-content: center; align-items: center; gap: 20px; margin-bottom: 20px;">
      <div style="display: flex; flex-direction: column; align-items: center;">
        <button style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid #0057B7; background-color: #C8E6C9; cursor: pointer; background-image: url('/jiffy/assets/prompts.png'); background-size: cover; background-position: center; background-repeat: no-repeat;"></button>
        <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-top: 5px;">Prompts</span>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center;">
        <button style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid #0057B7; background-color: #C8E6C9; cursor: pointer; background-image: url('/jiffy/assets/rewards.png'); background-size: cover; background-position: center; background-repeat: no-repeat;"></button>
        <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-top: 5px;">Rewards</span>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center;">
        <button style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid #0057B7; background-color: #C8E6C9; cursor: pointer; background-image: url('/jiffy/assets/add.png'); background-size: cover; background-position: center; background-repeat: no-repeat;" onclick="showAddPopup();"></button>
        <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-top: 5px;">Add</span>
      </div>
    </div>
    <div style="display: flex; flex-wrap: wrap; justify-content: flex-start; align-items: center; gap: 20px; width: 240px;" class="category-row">
      <div style="display: flex; flex-direction: column; align-items: center; width: 40px; position: relative;" draggable="true">
        <button style="width: 40px; height: 40px; border-radius: 50%; background-color: #1E3A8A; cursor: pointer; border: none; position: relative;">
          <span class="category-specific-button" style="display: none; position: absolute; top: 2px; right: 2px; width: 10px; height: 10px; border: 2px solid #FFFFFF; border-radius: 50%; background-color: #000000;">
            <span class="inner-circle" style="display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 6px; height: 6px; border-radius: 50%; background-color: #FFFFFF;"></span>
          </span>
        </button>
        <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-top: 5px;">Home</span>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center; width: 40px; position: relative;" draggable="true">
        <button style="width: 40px; height: 40px; border-radius: 50%; background-color: #3B82F6; cursor: pointer; border: none; position: relative;">
          <span class="category-specific-button" style="display: none; position: absolute; top: 2px; right: 2px; width: 10px; height: 10px; border: 2px solid #FFFFFF; border-radius: 50%; background-color: #000000;">
            <span class="inner-circle" style="display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 6px; height: 6px; border-radius: 50%; background-color: #FFFFFF;"></span>
          </span>
        </button>
        <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-top: 5px;">Life</span>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center; width: 40px; position: relative;" draggable="true">
        <button style="width: 40px; height: 40px; border-radius: 50%; background-color: #60A5FA; cursor: pointer; border: none; position: relative;">
          <span class="category-specific-button" style="display: none; position: absolute; top: 2px; right: 2px; width: 10px; height: 10px; border: 2px solid #FFFFFF; border-radius: 50%; background-color: #000000;">
            <span class="inner-circle" style="display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 6px; height: 6px; border-radius: 50%; background-color: #FFFFFF;"></span>
          </span>
        </button>
        <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-top: 5px;">Work</span>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center; width: 40px; position: relative;" draggable="true">
        <button style="width: 40px; height: 40px; border-radius: 50%; background-color: #93C5FD; cursor: pointer; border: none; position: relative;">
          <span class="category-specific-button" style="display: none; position: absolute; top: