let calloryChart;

document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('calloryChart');
    calloryChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'callory',
                data: [],
                borderWidth: 3,
                borderColor: 'rgba(184, 3, 3, 0.5)'
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false 
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    display: false 
                },
                x: {
                    display: true
                }
            }
        }
    });
});