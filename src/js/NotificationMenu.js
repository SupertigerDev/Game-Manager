function openNotificationMenu(params) {
    GameOpenSound()

    currentScreen = "notificationScreen"
    content = '<div class="button" onclick="closeMenu(\'add-game\', true); closeMenu(\'detect-fail\', true);currentScreen = \'homeScreen\';">Close</div></div>'
    appendMenu("notification-area", "Notifications", content, true, true, 760, 654, 698, 553)
    
}