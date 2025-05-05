<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jiffy - Home</title>
  <link rel="stylesheet" href="/jiffy/shared/styles.css">
  <link rel="manifest" href="/jiffy/manifest.json">
  <link rel="apple-touch-icon" href="/jiffy/assets/icon.png">
</head>
<body style="background-color: #000000 !important; color: #FFFFFF !important; height: 100vh; display: flex; flex-direction: column; justify-content: flex-start; align-items: center; margin: 0; padding: 0; position: relative;">
  <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 20px 20px 0 20px; box-sizing: border-box;">
    <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin: 0;">Select</span>
    <h1 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 20px; text-align: center; margin: 0; font-weight: normal;">Jiffy</h1>
    <div style="font-size: 24px; font-weight: 300; line-height: 1; cursor: pointer;">☰</div>
  </div>
  <div style="display: flex; flex-direction: column; align-items: center; margin-top: 30px;">
    <div style="display: flex; justify-content: center; align-items: center; gap: 20px; margin-bottom: 20px;">
      <div style="display: flex; flex-direction: column; align-items: center;">
        <button style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid #0057B7; background-color: #C8E6C9; cursor: pointer;"></button>
        <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-top: 5px;">Prompts</span>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center;">
        <button style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid #0057B7; background-color: #C8E6C9; cursor: pointer;"></button>
        <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-top: 5px;">Rewards</span>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center;">
        <button style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid #0057B7; background-color: #C8E6C9; cursor: pointer;" onclick="showAddPopup();"></button>
        <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-top: 5px;">Add</span>
      </div>
    </div>
    <div style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 20px; max-width: 240px;" class="category-row">
      <div style="display: flex; flex-direction: column; align-items: center;">
        <button style="width: 40px; height: 40px; border-radius: 50%; background-color: #1E3A8A; cursor: pointer; border: none;" onclick="alert('Remove category coming soon!');"></button>
        <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-top: 5px;">Home</span>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center;">
        <button style="width: 40px; height: 40px; border-radius: 50%; background-color: #3B82F6; cursor: pointer; border: none;" onclick="alert('Remove category coming soon!');"></button>
        <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-top: 5px;">Life</span>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center;">
        <button style="width: 40px; height: 40px; border-radius: 50%; background-color: #60A5FA; cursor: pointer; border: none;" onclick="alert('Remove category coming soon!');"></button>
        <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-top: 5px;">Work</span>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center;">
        <button style="width: 40px; height: 40px; border-radius: 50%; background-color: #93C5FD; cursor: pointer; border: none;" onclick="alert('Remove category coming soon!');"></button>
        <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; margin-top: 5px;">School</span>
      </div>
    </div>
  </div>
  <div id="popup" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: none; justify-content: center; align-items: center;">
    <!-- Debug: This div should be hidden by default due to display: none -->
    <div style="background: #C8E6C9; padding: 20px; border-radius: 8px; text-align: center; width: 80%; max-width: 300px;">
      <h2 id="popup-title" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 16px; margin: 0 0 10px;">Add Category</h2>
      <input id="category-input" type="text" placeholder="Enter category name" style="width: 100%; padding: 5px; margin-bottom: 10px; border: 1px solid #0057B7; border-radius: 4px;">
      <button style="background: #0057B7; color: #FFFFFF; border: none; padding: 5px 10px; border-radius: 4px; margin-right: 5px; cursor: pointer;" onclick="confirmAddCategory();">Confirm</button>
      <button style="background: #FFFFFF; color: #0057B7; border: 1px solid #0057B7; padding: 5px 10px; border-radius: 4px; cursor: pointer;" onclick="closePopup();">Cancel</button>
    </div>
  </div>
  <script src="/jiffy/shared/scripts.js"></script>
</body>
</html>