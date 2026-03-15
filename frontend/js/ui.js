document.addEventListener('DOMContentLoaded', () => {
    // --- 1. WELCOME MESSAGE LOGIC ---
    const updateWelcomeMessage = () => {
        const profile = JSON.parse(localStorage.getItem('epicenter_profile'));
        const nameDisplay = document.getElementById('user-display-name');
        
        if (nameDisplay) {
            if (profile && profile.name && profile.name.trim() !== "") {
                nameDisplay.innerText = profile.name;
            } else {
                nameDisplay.innerText = "buddy";
            }
        }
    };

    updateWelcomeMessage();

    // --- 2. SIDEBAR TOGGLE ---
    const menuToggle = document.getElementById('menu-toggle');
    const sidePanel = document.getElementById('side-panel');

    if (menuToggle && sidePanel) {
        menuToggle.addEventListener('click', () => {
            sidePanel.classList.toggle('expanded');
        });
    }
});

// --- 3. GLOBAL PROFILE FUNCTION ---
// (Must be outside DOMContentLoaded so the HTML button can see it)
window.saveProfile = function() {
    const nameInput = document.getElementById('user-name-input');
    const nameDisplay = document.getElementById('user-display-name');
    
    if (nameInput && nameInput.value.trim() !== "") {
        const userName = nameInput.value.trim();
        
        // Save to localStorage
        localStorage.setItem('epicenter_profile', JSON.stringify({ name: userName }));
        
        // Update the UI immediately
        if (nameDisplay) nameDisplay.innerText = userName;
        
        // Clear input field
        nameInput.value = "";
        alert("Profile Updated, " + userName + "!");
    } else {
        alert("Please enter a name.");
    }
};