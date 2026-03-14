document.addEventListener('DOMContentLoaded', () => {
    // 1. Sidebar Elements
    const menuToggle = document.getElementById('menu-toggle');
    const sidePanel = document.getElementById('side-panel');

    // 2. Theme Elements
    const themeBtn = document.getElementById('theme-toggle');

    // --- SIDEBAR LOGIC ---
    if (menuToggle && sidePanel) {
        menuToggle.addEventListener('click', () => {
            sidePanel.classList.toggle('expanded');
            console.log("Sidebar Toggled");
        });
    }


});