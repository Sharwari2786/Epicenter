let newsChart = null;

function updateDashboard(articles, bookmarks) {
    document.getElementById('stat-total').innerText = articles.length;
    document.getElementById('stat-saved').innerText = bookmarks.length;

    // Count articles per source for the chart
    const sourceMap = {};
    articles.forEach(art => {
        sourceMap[art.source.name] = (sourceMap[art.source.name] || 0) + 1;
    });

    const labels = Object.keys(sourceMap).slice(0, 5);
    const counts = Object.values(sourceMap).slice(0, 5);

    const canvas = document.getElementById('newsChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (newsChart) newsChart.destroy(); // Clear old chart data

    newsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: counts,
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
                borderColor: 'transparent'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 20 } }
            }
        }
    });
}