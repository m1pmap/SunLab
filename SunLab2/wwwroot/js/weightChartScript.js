let weightChart;

document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('weightChart');
    weightChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['08.05.2024', '05.08.2024', '05.11.2024'],
            datasets: [{
                label: 'weight',
                data: [60, 61, 65],
                borderWidth: 3,
                borderColor: 'rgba(184, 3, 3, 0.5)'
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