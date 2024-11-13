let myChart;

document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('myChart');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'steps',
                data: [2800, 3581, 5224, 2324, 1478, 3485, 2521],
                borderWidth: 3,
                borderColor: 'rgba(112, 1, 145, 0.5)'
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // Отключаем отображение легенды
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    display: false // Отключаем подписи оси Y
                },
                x: {
                    display: true // Если нужно оставить подписи оси X
                }
            }
        }
    });
});