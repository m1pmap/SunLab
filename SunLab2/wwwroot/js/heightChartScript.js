let heightChart;

document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('heightChart');
    heightChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['08.05.2018', '05.08.2022', '05.11.2023'],
            datasets: [{
                label: 'height',
                data: [132, 180, 183],
                borderWidth: 3,
                borderColor: 'rgba(184, 84, 3, 0.5)'
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