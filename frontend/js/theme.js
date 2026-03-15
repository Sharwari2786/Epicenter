document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.getElementById('theme-toggle');
    
    // Function to apply theme to both HTML and Body
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark-mode');
            document.body.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
            document.body.classList.remove('dark-mode');
        }
    };

    // 1. Initial Sync: Ensure body matches the head script immediately
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    if (themeBtn) {
        themeBtn.onclick = function() {
            // 2. Toggle logic
            const isNowDark = !document.documentElement.classList.contains('dark-mode');
            const newTheme = isNowDark ? 'dark' : 'light';
            
            // 3. Apply and Save
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        };
    }
});