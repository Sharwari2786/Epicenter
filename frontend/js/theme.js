document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('theme-toggle');
    
    // --- ADD THIS PART ---
    // Check if 'dark' was saved in a previous session
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }
    // ----------------------

    if (btn) {
        btn.onclick = function() {
            document.body.classList.toggle('dark-mode');
            
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        };
    }
});
