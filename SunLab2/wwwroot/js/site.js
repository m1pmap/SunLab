let tg = window.Telegram.WebApp;
let isInputOpen = false;
let isCalmingStart = false;
let breathingInterval;
let timeoutIds = []; // Массив для хранения идентификаторов таймеров
let monthMoods = ["cool2", "clown1", "", "", "devil1", "", "", "", "", "confused1", "happy2", "", "", "cursing1", "", "", "crying1", "", "", "kiss1", "", "", "surprised1", "", "bigSmile1", "sick1", "", "", "smile1", "", ""];
let isDailyMoodSelected = false;
let isMoodsTrackerOpened = false;
let currentStage = "diseaseName";
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 && // Элемент сверху виден
        rect.left >= 0 && // Элемент слева виден
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && // Элемент снизу виден
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) // Элемент справа виден
    );
}

// Функция для добавления/удаления класса active
function checkVisibility() {
    const activity = document.querySelector('.activity');
    const bodyHealth = document.querySelector('.bodyHealth');
    const healthyFood = document.querySelector('.healthyFood');
    const analitics = document.querySelector('.analitics');

    if (window.scrollY == 0) {
        activity.classList.remove('active');
        bodyHealth.classList.remove('active');
        healthyFood.classList.remove('active');
        analitics.classList.remove('active');
    }
    else {
        const targetElement = document.querySelector('.arrowImage');

        if (window.scrollY > 100 && window.scrollY < 400) { // Установите порог прокрутки
            targetElement.classList.add('active'); // Добавляем класс active
        }
        else {
            targetElement.classList.remove('active'); // Убираем класс active
        }

        const targets = document.querySelectorAll('.anim');

        targets.forEach(target => {
            if (isElementInViewport(target)) {
                target.classList.add('active');
            } else {
                target.classList.remove('active'); // Убираем класс при выходе из области видимости
            }
        });
    }
}

// Добавляем обработчик события прокрутки
window.addEventListener('scroll', checkVisibility);

document.addEventListener('DOMContentLoaded', () => {
    const stepsInput = document.querySelector('.steps');
    const newWeightInput = document.querySelector('.newWeightInput');
    const newHeightInput = document.querySelector('.newHeightInput');
    const bedTimeInput = document.querySelector('.bedTimeInput');
    const diseasesWriterInput = document.querySelector('.diseasesWriterInput');

    tg.expand();

    tg.MainButton.show();
    tg.MainButton.text = "mipmap";
    tg.MainButton.onClick(() => {
        if (isInputOpen) {
            stepsInput.blur();
            newWeightInput.blur();
            newHeightInput.blur();
            diseasesWriterInput.blur();
            
            tg.MainButton.text = "mipmap";
            isInputOpen = false;
        }
        else {
            sendMessage(tg.initDataUnsafe.user.id, bedTimeInput.value);
        }
    });

    tg.ready();
    userName = tg.initDataUnsafe.user.username;

    let formData = new FormData();
    formData.append("userName", userName);

    fetch('/Main/AddUser', {
            method: 'POST',
            body: formData
    });

    document.querySelector('.addNewWeightButton').addEventListener('click', () => {
        document.querySelector('.addNewWeightButton').classList.add('active');
    });

    document.querySelector('.bedTimeCheckBox').addEventListener('click', function () {
        bedTimeInput.classList.toggle('active');
    });

    stepsInput.addEventListener('input', function () {
        if (adjustWidth(stepsInput, 5) == 1) {
            const chart = Chart.getChart('myChart');
            index = getCurrentDayIndex() - 1;
            updateData(chart, stepsInput.value, index);

            const steps = stepsInput.value;
            const distantion = steps * 1.15 / 1000;
            document.querySelector('.distantion').textContent = "~" + distantion.toFixed(3) + "km passed";

            const calories = steps * 0.04;
            document.querySelector('.calories').textContent = "~" + calories.toFixed(0) + "kcal burned";

            changeStepsAdvicies();
        }
    });

    document.querySelector('.addWeight').addEventListener('click', function () {
        const chart = Chart.getChart('weightChart');
        addHW(chart, newWeightInput);
        document.querySelector('.weightText').innerText = newWeightInput.value;
        changeWHAdvicies();
    });
    document.querySelector('.addHeight').addEventListener('click', function () {
        const chart = Chart.getChart('heightChart');
        addHW(chart, newHeightInput);
        document.querySelector('.heightText').innerText = newHeightInput.value;
        changeWHAdvicies();
    });

    newWeightInput.addEventListener('input', function () {
        adjustWidth(newWeightInput, 3);
    });
    newHeightInput.addEventListener('input', function () {
        adjustWidth(newHeightInput, 3);
    });

    document.querySelector('.activity').addEventListener('click', () => {
        const target = document.querySelector('.activityPageName');
        scrollToTarget(target);
    });

    document.querySelector('.bodyHealth').addEventListener('click', () => {
        const target = document.querySelector('.healthPageName');
        scrollToTarget(target);
    });

    document.querySelector('.stepsInfo').addEventListener('click', () => {
        focusItem(stepsInput);
    });

    document.querySelector('.newWeight').addEventListener('click', () => {
        focusItem(newWeightInput);
    });

    document.querySelector('.newHeight').addEventListener('click', () => {
        focusItem(newHeightInput);
    });

    const viralDiseasesButton = document.querySelector('.viralDiseasesButton');
    const chronicDiseasesButton = document.querySelector('.chronicDiseasesButton');
    const mentalDiseasesButton = document.querySelector('.mentalDiseasesButton');
    const otherButton = document.querySelector('.otherButton');

    viralDiseasesButton.addEventListener('click', () => {
        hideAllHealthButtons(viralDiseasesButton, chronicDiseasesButton, mentalDiseasesButton, otherButton);
        changeHealthPageName("Virus health");
        setTimeout(function () {
            openViralDiseasesPage();
        }, 650);

    });

    chronicDiseasesButton.addEventListener('click', () => {
        hideAllHealthButtons(chronicDiseasesButton, viralDiseasesButton, mentalDiseasesButton, otherButton);
        changeHealthPageName("Chronic health");
        setTimeout(function () {
            openChronicDiseasesPage();
        }, 650);
    });

    mentalDiseasesButton.addEventListener('click', () => {
        hideAllHealthButtons(mentalDiseasesButton, chronicDiseasesButton, viralDiseasesButton, otherButton);
        changeHealthPageName("Mental health");
        setTimeout(function () {
            openMentalDiseasesPage();
        }, 650);
    });

    otherButton.addEventListener('click', () => {
        hideAllHealthButtons(otherButton, mentalDiseasesButton, viralDiseasesButton, chronicDiseasesButton);
        changeHealthPageName("Other");

        setTimeout(function () {
            openOtherDiseasesPage();
        }, 650);
    });


    const chart = Chart.getChart('myChart');
    index = getCurrentDayIndex() - 1;
    updateData(chart, 508, index);
    adjustWidth(stepsInput, 5);
    adjustWidth(newWeightInput, 3);
    adjustWidth(newHeightInput, 3);
    //showMoods();

    changeStepsAdvicies();
    changeWHAdvicies();
});

function addHW(chart, input) {
    const today = new Date();

    // Получаем день, месяц и год
    const day = String(today.getDate()).padStart(2, '0'); // Добавляем ведущий ноль
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
    const year = today.getFullYear();

    // Форматируем дату в нужный формат
    const formattedDate = `${day}.${month}.${year}`;
    if (chart.data.labels[chart.data.datasets[0].data.length - 1] == formattedDate) {
        updateData(chart, input.value, chart.data.datasets[0].data.length - 1);
    } // Изменяем значение по индексу
    else {
        addData(chart, formattedDate, input.value);
    }
}

function openAddWidthMenu() {
    const addNewWeightButton = document.querySelector('.addNewWeightButton');
    const addNewWeight = document.querySelector('.addNewWeight');
    const addWeight = document.querySelector('.addWeight');
    const back = document.querySelector('.back');

    addNewWeightButton.style.opacity = '0';
    addWeight.disabled = false;
    addWeight.style.cursor = "pointer";
    back.disabled = false;
    back.style.cursor = "pointer";
    setTimeout(function () {
        addNewWeightButton.style.height = '0px';
        addNewWeightButton.style.marginTop = '0px';

        addNewWeight.style.height = '40px';
        addNewWeight.style.marginTop = '10px';


        setTimeout(function () {
            addNewWeight.style.opacity = '1';
        }, 400);

    }, 275);
}

function hideAddWeightMenu() {
    const addNewWeightButton = document.querySelector('.addNewWeightButton');
    const addNewWeight = document.querySelector('.addNewWeight');
    const addWeight = document.querySelector('.addWeight');
    const back = document.querySelector('.back');

    addNewWeight.style.opacity = '0';
    addWeight.disabled = true;
    addWeight.style.cursor = "default";
    back.disabled = true;
    back.style.cursor = "default";

    setTimeout(function () {
        addNewWeight.style.height = '0px';
        addNewWeight.style.marginTop = '0px';

        addNewWeightButton.style.height = '40px';
        addNewWeightButton.style.marginTop = '10px';

        setTimeout(function () {
            addNewWeightButton.style.opacity = '1';
        }, 400);

    }, 275);
}

function openAddHeightMenu() {
    const addNewHeightButton = document.querySelector('.addNewHeightButton');
    const addNewHeight = document.querySelector('.addNewHeight');
    const addHeight = document.querySelector('.addHeight');
    const heightBack = document.querySelector('.heightBack');

    addNewHeightButton.style.opacity = '0';
    addHeight.disabled = false;
    addHeight.style.cursor = "pointer";
    heightBack.disabled = false;
    heightBack.style.cursor = "pointer";
    setTimeout(function () {
        addNewHeightButton.style.height = '0px';
        addNewHeightButton.style.marginTop = '0px';

        addNewHeight.style.height = '40px';
        addNewHeight.style.marginTop = '10px';

        setTimeout(function () {
            addNewHeight.style.opacity = '1';
        }, 400);

    }, 275);
}

function hideAddHeightMenu() {
    const addNewHeightButton = document.querySelector('.addNewHeightButton');
    const addNewHeight = document.querySelector('.addNewHeight');
    const addHeight = document.querySelector('.addHeight');
    const heightBack = document.querySelector('.heightBack');

    addNewHeight.style.opacity = '0';
    addHeight.disabled = true;
    addHeight.style.cursor = "default";
    heightBack.disabled = true;
    heightBack.style.cursor = "default";

    setTimeout(function () {
        addNewHeight.style.height = '0px';
        addNewHeight.style.marginTop = '0px';

        addNewHeightButton.style.height = '40px';
        addNewHeightButton.style.marginTop = '10px';

        setTimeout(function () {
            addNewHeightButton.style.opacity = '1';
        }, 400);

    }, 275);
}

function HideStepsMoreInfo() {
    const button = document.querySelector('.stepsMoreButton');
    const stepsDescription = document.querySelector('.stepsDescription');
    const chart = document.getElementById('myChart');
    const stepsMoreInfo = document.querySelector('.stepsMoreInfo');
    const caloriesInfo = document.querySelector('.caloriesInfo');
    const calories = document.querySelector('.calories');
    const distInfo = document.querySelector('.distInfo');
    const distantion = document.querySelector('.distantion');

    button.classList.toggle('active');

    if (!button.classList.contains('active')) {
        stepsDescription.classList.remove('active');
        chart.classList.remove('active');
        stepsMoreInfo.classList.remove('active');

        setTimeout(function () {
            caloriesInfo.classList.remove('active');
            calories.classList.remove('active');
        }, 200);

        setTimeout(function () {
            distInfo.classList.remove('active');
            distantion.classList.remove('active');
        }, 400);
    }
    else {
        distInfo.classList.add('active');

        setTimeout(function () {
            distantion.classList.add('active');
        }, 100);

        setTimeout(function () {
            caloriesInfo.classList.add('active');
            calories.classList.add('active');
            stepsMoreInfo.classList.add('active');

        }, 100);

        setTimeout(function () {
            chart.classList.add('active');
            stepsDescription.classList.add('active');
        }, 300);
    }
}

function HideWeightMoreInfo() {
    const button = document.querySelector('.weightMoreButton');
    const weightDescription = document.querySelector('.weightDescription');
    const chart = document.getElementById('weightChart');
    const weightMoreInfo = document.querySelector('.weightMoreInfo');
    const addNewWeightButton = document.querySelector('.addNewWeightButton');
    const addNewWeight = document.querySelector('.addNewWeight');
    const newWeight = document.querySelector('.newWeight');
    const addWeight = document.querySelector('.addWeight');
    const back = document.querySelector('.back');

    button.classList.toggle('active');

    if (!button.classList.contains('active')) {
        chart.classList.remove('active');
        weightDescription.classList.remove('active');

        setTimeout(function () {
            weightMoreInfo.classList.remove('active');
        }, 100);

        setTimeout(function () {
            addNewWeight.style.opacity = '0';
            newWeight.style.opacity = '0';
            addWeight.style.opacity = '0';
            back.style.opacity = '0';

            addNewWeightButton.style.opacity = '0';
        }, 350);

        setTimeout(function () {
            addNewWeightButton.style.height = '0px';
            addNewWeightButton.style.marginTop = '0px';

            addWeight.style.height = '0px';
            back.style.height = '0px';

            addNewWeight.style.height = '0px';
            addNewWeight.style.marginTop = '0px';
        }, 400);

        addNewWeightButton.disabled = true;
        addNewWeightButton.style.cursor = "default";

        addWeight.disabled = true;
        addWeight.style.cursor = "default";
        back.disabled = true;
        back.style.cursor = "default";
    }
    else {
        addNewWeight.style.height = '0px';
        addNewWeight.style.marginTop = '0px';

        addWeight.style.height = '40px';
        back.style.height = '40px';

        addNewWeightButton.style.height = '40px';
        addNewWeightButton.style.marginTop = '10px';
        setTimeout(function () {
            addNewWeightButton.style.opacity = '1';
            addNewWeight.style.opacity = '0';
            newWeight.style.opacity = '1';
            addWeight.style.opacity = '1';
            back.style.opacity = '1';
            weightMoreInfo.classList.add('active');
        }, 100);

        setTimeout(function () {
            chart.classList.add('active');
            weightDescription.classList.add('active');
        }, 200);

        addNewWeightButton.disabled = false;
        addNewWeightButton.style.cursor = "pointer";
    }
}

function HideHeightMoreInfo() {
    const button = document.querySelector('.heightMoreButton');
    const heightDescription = document.querySelector('.heightDescription');
    const chart = document.getElementById('heightChart');
    const heightMoreInfo = document.querySelector('.heightMoreInfo');
    const addNewHeightButton = document.querySelector('.addNewHeightButton');
    const addNewHeight = document.querySelector('.addNewHeight');
    const newHeight = document.querySelector('.newHeight');
    const addHeight = document.querySelector('.addHeight');
    const heightBack = document.querySelector('.heightBack');

    button.classList.toggle('active');

    if (!button.classList.contains('active')) {
        chart.classList.remove('active');
        heightDescription.classList.remove('active');

        setTimeout(function () {
            heightMoreInfo.classList.remove('active');
        }, 100);

        setTimeout(function () {
            addNewHeight.style.opacity = '0';
            newHeight.style.opacity = '0';
            addHeight.style.opacity = '0';
            heightBack.style.opacity = '0';

            addNewHeightButton.style.opacity = '0';
        }, 350);

        setTimeout(function () {
            addNewHeightButton.style.height = '0px';
            addNewHeightButton.style.marginTop = '0px';

            addHeight.style.height = '0px';
            heightBack.style.height = '0px';

            addNewHeight.style.height = '0px';
            addNewHeight.style.marginTop = '0px';
        }, 400);

        addNewHeightButton.disabled = true;
        addNewHeightButton.style.cursor = "default";

        addHeight.disabled = true;
        addHeight.style.cursor = "default";
        heightBack.disabled = true;
        heightBack.style.cursor = "default";
    }
    else {

        addNewHeight.style.height = '0px';
        addNewHeight.style.marginTop = '0px';

        addHeight.style.height = '40px';
        heightBack.style.height = '40px';

        addNewHeightButton.style.height = '40px';
        addNewHeightButton.style.marginTop = '10px';
        setTimeout(function () {
            addNewHeightButton.style.opacity = '1';
            addNewHeight.style.opacity = '0';
            newHeight.style.opacity = '1';
            addHeight.style.opacity = '1';
            heightBack.style.opacity = '1';
            heightMoreInfo.classList.add('active');
        }, 100);

        setTimeout(function () {
            chart.classList.add('active');
            heightDescription.classList.add('active');
        }, 200);

        addNewHeightButton.disabled = false;
        addNewHeightButton.style.cursor = "pointer";
    }
}

function getCurrentDayIndex() {
    const today = new Date(); // Получаем текущую дату
    const dayIndex = today.getDay(); // Получаем день недели (0 - воскресенье, 6 - суббота)

    // Преобразуем день недели: воскресенье (0) -> 7, остальные дни остаются без изменений
    return dayIndex === 0 ? 7 : dayIndex;
}

function updateData(chart, newValue, index) {
    chart.data.datasets[0].data[index] = newValue; // Изменяем значение по индексу
    chart.update(); // Обновляем график
}

function addData(chart, label, data) {
    chart.data.labels.push(label); // Добавляем метку по оси X
    chart.data.datasets[0].data.push(data); // Добавляем новое значение
    chart.update(); // Обновляем график
}

function adjustWidth(input, count) {
    input.value = input.value.replace(/[^0-9]/g, '');
    const charCount = input.value.length; // Получаем количество символов
    if (charCount > count) {
        input.value = input.value.slice(0, count); // Обрезает строку до 6 символов
        return 0;
    }
    const multiplier = 21; // Задайте множитель (например, 10)

    // Устанавливаем ширину равной количеству символов * множитель
    input.style.width = (charCount * multiplier + 10) + 'px'; // +2 для небольшого отступа
    return 1;

}

function focusItem(item) {
    item.focus();
}

function scrollToTarget(target) {
    target.scrollIntoView({ behavior: 'smooth' });
}

function inputClick() {
    isInputOpen = true;
    tg.MainButton.text = "Скрыть клавиатуру";
}

function sendMessage(chatId, message) {
    // Создаем новый объект XMLHttpRequest
    var xhr = new XMLHttpRequest();

    // Настраиваем запрос: метод POST, URL API Telegram для отправки сообщения
    xhr.open("POST", "https://api.telegram.org/bot6434768119:AAHkMgo5yuxcOm4im9ccx1yDAieKkxY_Wco/sendMessage", true);

    // Устанавливаем заголовок Content-Type для передачи данных в формате JSON
    xhr.setRequestHeader("Content-Type", "application/json");

    // Обрабатываем ответ сервера
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            console.log('Сообщение успешно отправлено:', xhr.responseText);
        } else {
            console.error('Ошибка при отправке сообщения:', xhr.statusText);
        }
    };

    // Отправляем запрос с данными в формате JSON
    xhr.send(JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML' // Если нужно использовать HTML-разметку в сообщении
    }));
}

function changeStepsAdvicies() {
    const stepsIndicator = document.querySelector('.stepsIndicator');
    const stepsAdviciesText = document.querySelector('.stepsAdviciesText');
    const chart = Chart.getChart('myChart');
    const totalSum = chart.data.datasets[0].data.reduce((accumulator, currentValue) => {
        // Преобразуем текущее значение в число и заменяем NaN на 0
        const value = parseFloat(currentValue);
        return accumulator + (isNaN(value) ? 0 : value);
    }, 0); // Начальное значение для аккумулятора - 0

    if (totalSum <= 20000) {
        stepsIndicator.style.backgroundColor = "rgba(190,75,75,0.75)";
        stepsAdviciesText.textContent = "You have too few steps this week(" + totalSum + "). You need to go outside more often.";
    }
    else {
        if (totalSum <= 40000) {
            stepsIndicator.style.backgroundColor = "rgba(255, 207, 64, 0.75)";
            stepsAdviciesText.textContent = "You've got good steps this week(" + totalSum + "). But that's not enough to keep you healthy.";
        }
        else {
            stepsIndicator.style.backgroundColor = "rgba(100, 134, 83, 0.75)";
            stepsAdviciesText.textContent = "Well done. You have enough steps for this week(" + totalSum + "). Stay healthy!"
        }
    }
}

function changeWHAdvicies() {
    const WHIndicator = document.querySelector('.WHIndicator');
    const WHAdviciesText = document.querySelector('.WHAdviciesText');
    const newWeightInput = document.querySelector('.weightText');
    const newHeightInput = document.querySelector('.heightText');
    var weight = parseFloat(newWeightInput.textContent); // Преобразование веса в число
    var height = parseFloat(newHeightInput.textContent); // Преобразование роста в число
    var BMI = (weight / (height / 100) ** 2).toFixed(2);
    if (BMI < 18.5) {
        WHAdviciesText.textContent = "You have been diagnosed as underweight due to your BMI being too low(" + BMI + "). You should increase your caloric intake, eat more often and start doing physical activity.";
        WHIndicator.style.backgroundColor = "rgba(190,75,75,0.75)";
    }
    else {
        if (BMI < 25) {
            WHAdviciesText.textContent = "Your weight is fully consistent with your height according to BMI(" + BMI + ") and you have nothing to worry about.";
            WHIndicator.style.backgroundColor = "rgba(100, 134, 83, 0.75)";
        }
        else {
            if (BMI < 30) {
                WHAdviciesText.textContent = "You are overweight according to BMI(" + BMI + "). You should balance your diet, eat small meals more often, start doing physical activity and try to experience less stress.";
                WHIndicator.style.backgroundColor = "rgba(255, 207, 64, 0.75)";
            }
            else {
                WHAdviciesText.textContent = "Based on your BMI, you are obese(" + BMI + "). You should balance your diet, eat small meals more often, start doing physical activity and try to experience less stress.";
                WHIndicator.style.backgroundColor = "rgba(190,75,75,0.75)";
            }
        }
    }
}

function hideAllHealthButtons(button1, button2, button3, button4) {
    const healthButtons = document.querySelector('.healthButtons');

    button1.style.opacity = "0";
    setTimeout(function () {
        button2.style.opacity = "0";
    }, 100);

    setTimeout(function () {
        button3.style.opacity = "0";
    }, 200);

    setTimeout(function () {
        button4.style.opacity = "0";
    }, 300);

    setTimeout(function () {
        healthButtons.style.display = "none";
    }, 700);
}

function showAllHealthButtons(diseaseType) {
    const healthButtons = document.querySelector('.healthButtons');
    const viralDiseasesButton = document.querySelector('.viralDiseasesButton');
    const chronicDiseasesButton = document.querySelector('.chronicDiseasesButton');
    const mentalDiseasesButton = document.querySelector('.mentalDiseasesButton');
    const otherButton = document.querySelector('.otherButton');
    let delay = 550;

    if (diseaseType == "virus") {
        closeViralDiseasesPage();
    }
    else if (diseaseType == "chronic") {
        closeChronicDiseasesPage();
    }
    else if (diseaseType == "mental") {
        delay = closeMentalDiseasesPage();
        //delay = 950;
    }
    else if (diseaseType == "other") {
        closeOtherDiseasesPage();
    }

    setTimeout(function () {
        healthButtons.style.display = "block";
    }, delay);

    setTimeout(function () {
        viralDiseasesButton.style.opacity = "1";
    }, delay + 100);

    setTimeout(function () {
        chronicDiseasesButton.style.opacity = "1";
    }, delay + 200);

    setTimeout(function () {
        mentalDiseasesButton.style.opacity = "1";
    }, delay + 300);

    setTimeout(function () {
        otherButton.style.opacity = "1";
    }, delay + 400);
}

function changeHealthPageName(pageName) {
    const healthPageName = document.querySelector('.healthPageName');
    healthPageName.style.opacity = "0";
    setTimeout(function () {
        healthPageName.textContent = pageName;
        healthPageName.style.opacity = "1";
    }, 500);
}

function openViralDiseasesPage() {
    const viralDiseases = document.querySelector('.viralDiseases');
    const virusButtonsContainer = document.querySelector('.virusButtonsContainer');
    const virusBackButton = document.querySelector('.virusBackButton');
    const startVirusDiseaseButton = document.querySelector('.startVirusDiseaseButton');
    //const aboutViralDiseases = document.querySelector('.aboutViralDiseases');

    viralDiseases.style.display = "block";
    virusButtonsContainer.style.opacity = "1";
    setTimeout(function () {
        virusBackButton.style.opacity = "1";
    }, 50);
    setTimeout(function () {
        startVirusDiseaseButton.style.opacity = "1";
    }, 150);
    setTimeout(function () {
        //aboutViralDiseases.style.opacity = "1";
    }, 250);
}

function closeViralDiseasesPage() {
    const viralDiseases = document.querySelector('.viralDiseases');
    const virusButtonsContainer = document.querySelector('.virusButtonsContainer');
    const virusBackButton = document.querySelector('.virusBackButton');
    const startVirusDiseaseButton = document.querySelector('.startVirusDiseaseButton');

    setTimeout(function () {
        changeHealthPageName("Health");
        startVirusDiseaseButton.style.opacity = "0";
    }, 100);
    setTimeout(function () {
        virusBackButton.style.opacity = "0";
    }, 200);
    setTimeout(function () {
        virusButtonsContainer.style.opacity = "0";
        viralDiseases.style.display = "none";
    }, 550);
}

function openChronicDiseasesPage() {
    const chronicDiseases = document.querySelector('.chronicDiseases');
    const chronicButtonsContainer = document.querySelector('.chronicButtonsContainer');
    const chronicBackButton = document.querySelector('.chronicBackButton');
    const addChronicDiseaseButton = document.querySelector('.addChronicDiseaseButton');

    chronicDiseases.style.display = "block";
    chronicButtonsContainer.style.opacity = "1";
    setTimeout(function () {
        chronicBackButton.style.opacity = "1";
    }, 50);
    setTimeout(function () {
        addChronicDiseaseButton.style.opacity = "1";
    }, 150);
}

function closeChronicDiseasesPage() {
    const chronicDiseases = document.querySelector('.chronicDiseases');
    const chronicButtonsContainer = document.querySelector('.chronicButtonsContainer');
    const chronicBackButton = document.querySelector('.chronicBackButton');
    const addChronicDiseaseButton = document.querySelector('.addChronicDiseaseButton');

    setTimeout(function () {
        changeHealthPageName("Health");
        addChronicDiseaseButton.style.opacity = "0";
    }, 100);
    setTimeout(function () {
        chronicBackButton.style.opacity = "0";
    }, 200);
    setTimeout(function () {
        chronicButtonsContainer.style.opacity = "0";
        chronicDiseases.style.display = "none";
    }, 550);
}

function openMentalDiseasesPage() {
    const mentalDiseases = document.querySelector('.mentalDiseases');
    const mentalButtonsContainer = document.querySelector('.mentalButtonsContainer');
    const mentalBackButton = document.querySelector('.mentalBackButton');
    const addMentalDiseaseButton = document.querySelector('.addMentalDiseaseButton');
    const calmingButton = document.querySelector('.calmingButton');
    const CalmContainer = document.querySelector('.CalmContainer');
    const diseasesHistoryButton = document.querySelector('.diseasesHistoryButton');
    const moodTrackerButton = document.querySelector('.moodTrackerButton');
    const moodDataGrid = document.querySelector('.moodDataGrid');
    const MoodsContainer = document.querySelector('.MoodsContainer');

    mentalDiseases.style.display = "block";
    mentalButtonsContainer.style.opacity = "1";

    setTimeout(function () {
        mentalBackButton.style.opacity = "1";
    }, 50);

    setTimeout(function () {
        addMentalDiseaseButton.style.opacity = "1";
        CalmContainer.style.opacity = "1";
        setTimeout(function () {
            calmingButton.style.opacity = "1";
        }, 50);
    }, 150);

    setTimeout(function () {
        diseasesHistoryButton.style.opacity = "1";
    }, 400);

    setTimeout(function () {
        moodTrackerButton.style.opacity = "1";
    }, 600);

    if (isDailyMoodSelected) {
        moodDataGrid.style.display = "none";
        MoodsContainer.style.display = "block";
        moodDataGrid.classList.remove('visible');
        createMoodTracker(null);
    }
    else {
        setTimeout(function () {
            showMoods();
        }, 400);
    }
}

function closeMentalDiseasesPage() {
    if (isCalmingStart) {
        endCalming();
    }
    const mentalDiseases = document.querySelector('.mentalDiseases');
    const mentalButtonsContainer = document.querySelector('.mentalButtonsContainer');
    const mentalBackButton = document.querySelector('.mentalBackButton');
    const addMentalDiseaseButton = document.querySelector('.addMentalDiseaseButton');
    const diseasesHistoryButton = document.querySelector('.diseasesHistoryButton');
    const moodTrackerButton = document.querySelector('.moodTrackerButton');
    const moodDataGrid = document.querySelector('.moodDataGrid');
    const CalmContainer = document.querySelector('.CalmContainer');
    const calmingButton = document.querySelector('.calmingButton');
    let time = 0;
    if (isMoodsTrackerOpened) {
        moodDataGrid.classList.remove('visible');
        moodTrackerButton.style.opacity = "0";
    }
    else {
        time = 420;
        let delay = 30; // Задержка в миллисекундах

        const buttons3 = document.querySelectorAll('#dataGrid3 .image-button'); // Получаем все кнопки

        for (let index = buttons3.length - 1; index >= 0; index--) {
            const button = buttons3[index];
            setTimeout(() => {
                button.classList.remove('show'); // Добавляем класс для отображения и анимации
            }, (buttons3.length - 1 - index) * delay); // Увеличиваем задержку для каждого элемента
        }

        const buttons2 = document.querySelectorAll('#dataGrid2 .image-button'); // Получаем все кнопки

        buttons2.forEach((button, index) => {
            setTimeout(() => {
                button.classList.remove('show'); // Добавляем класс для отображения и анимации
            }, 150 + index * delay); // Увеличиваем задержку для каждого элемента
        });

        const buttons1 = document.querySelectorAll('#dataGrid1 .image-button'); // Получаем все кнопки

        for (let index = buttons1.length - 1; index >= 0; index--) {
            const button = buttons1[index];
            setTimeout(() => {
                button.classList.remove('show'); // Добавляем класс для отображения и анимации
            }, 270 + (buttons1.length - 1 - index) * delay); // Увеличиваем задержку для каждого элемента
        }
    }


    setTimeout(function () {
        moodTrackerButton.style.opacity = "0";
    }, time + 0);
    setTimeout(function () {
        diseasesHistoryButton.style.opacity = "0";
    }, time + 200);

    setTimeout(function () {
        calmingButton.style.opacity = "0";
        setTimeout(function () {
            CalmContainer.style.opacity = "0";
        }, 1000);
    }, time + 400);

    setTimeout(function () {
        addMentalDiseaseButton.style.opacity = "0";
        changeHealthPageName("Health");
    }, time + 700);
    setTimeout(function () {
        mentalBackButton.style.opacity = "0";
    }, time + 800);
    setTimeout(function () {
        mentalButtonsContainer.style.opacity = "0";
        mentalDiseases.style.display = "none";
    }, time + 950);

    return time + 950;
}

function openOtherDiseasesPage() {
    const otherDiseases = document.querySelector('.otherDiseases');
    const otherButtonsContainer = document.querySelector('.otherButtonsContainer');
    const otherBackButton = document.querySelector('.otherBackButton');
    const addOtherDiseaseButton = document.querySelector('.addOtherDiseaseButton');

    otherDiseases.style.display = "block";
    otherButtonsContainer.style.opacity = "1";
    setTimeout(function () {
        otherBackButton.style.opacity = "1";
    }, 50);
    setTimeout(function () {
        addOtherDiseaseButton.style.opacity = "1";
    }, 150);
}

function closeOtherDiseasesPage() {
    const otherDiseases = document.querySelector('.otherDiseases');
    const otherButtonsContainer = document.querySelector('.otherButtonsContainer');
    const otherBackButton = document.querySelector('.otherBackButton');
    const addOtherDiseaseButton = document.querySelector('.addOtherDiseaseButton');

    setTimeout(function () {
        changeHealthPageName("Health");
        addOtherDiseaseButton.style.opacity = "0";
    }, 100);
    setTimeout(function () {
        otherBackButton.style.opacity = "0";
    }, 200);
    setTimeout(function () {
        otherButtonsContainer.style.opacity = "0";
        otherDiseases.style.display = "none";
    }, 550);
}


function startCalming() {
    isCalmingStart = true;
    const calmingButton = document.querySelector('.calmingButton');
    const paragraph = calmingButton.querySelector('p');
    const calmingInstructor = document.querySelector('.calmingInstructor');

    // Начальная анимация
    timeoutIds.push(setTimeout(function () {
        calmingButton.style.marginTop = "30px";
        calmingButton.style.backgroundColor = "rgba(78, 171, 191,0.75)";
        calmingButton.style.marginBottom = "10px";
        calmingButton.style.width = "115px";
        calmingButton.style.height = "115px";
        calmingButton.style.borderRadius = "50%";
        paragraph.style.opacity = 0;
        calmingInstructor.style.height = "auto";
    }, 50));

    timeoutIds.push(setTimeout(function () {
        paragraph.textContent = "Starting";
        paragraph.style.opacity = 1;
    }, 500));

    timeoutIds.push(setTimeout(function () {
        calmingInstructor.style.opacity = "1";
    }, 1000));

    timeoutIds.push(setTimeout(function () {
        calmingInstructor.style.opacity = 0;
    }, 3000));

    timeoutIds.push(setTimeout(function () {
        calmingInstructor.textContent = "Focus on your breathing";
        calmingInstructor.style.opacity = 1;
    }, 4000));

    // Цикл с обратным отсчетом
    for (let i = 4; i > 0; i--) {
        timeoutIds.push(setTimeout((function (i) {
            return function () {
                paragraph.style.opacity = 0; // Скрываем параграф
                setTimeout(function () {
                    paragraph.textContent = i.toString(); // Устанавливаем текст
                    paragraph.style.opacity = 1; // Показываем параграф 
                }, 500); // Задержка перед показом текста
            };
        })(i), 1000 * (5 - i))); // Задержка для каждой итерации
    }

    // Запуск дыхания через 10 секунд
    timeoutIds.push(setTimeout(function () {
        calmingButton.style.transitionDuration = "5s";
        breathe();
    }, 5000));
}

function endCalming() {
    isCalmingStart = false; // Устанавливаем флаг в false

    // Останавливаем все таймеры
    timeoutIds.forEach(clearTimeout);
    timeoutIds = []; // Очищаем массив идентификаторов

    clearTimeout(breathingInterval); // Останавливаем дыхание

    const calmingButton = document.querySelector('.calmingButton');
    const paragraph = calmingButton.querySelector('p');
    const calmingInstructor = document.querySelector('.calmingInstructor');

    calmingButton.style.transitionDuration = "1s";

    // Возвращаем кнопку в исходное состояние
    paragraph.style.opacity = 0;


    setTimeout(function () {
        paragraph.textContent = "Stop"; // Устанавливаем текст на кнопке
        paragraph.style.opacity = 1;
        calmingInstructor.style.opacity = "0";
    }, 500);

    setTimeout(function () {
        paragraph.style.opacity = 0;
    }, 1000);

    setTimeout(function () {
        paragraph.style.opacity = 1;
        paragraph.textContent = "Calming"
        calmingButton.style.backgroundColor = "rgba(96, 96, 96,0.5)";
        calmingButton.style.width = "calc(100% - 20px)";
        calmingButton.style.height = "45px";
        calmingButton.style.marginTop = "10px";
        calmingButton.style.marginBottom = "0px";
        calmingButton.style.borderRadius = "12px";
        calmingInstructor.style.height = "0";
        calmingInstructor.textContent = "Relax and get comfortable";
    }, 1500);
}

function calming() {
    if (!isCalmingStart) {
        startCalming();
    } else {
        endCalming();
    }
}

function breathe() {
    if (!isCalmingStart) return; // Если не дышим, выходим из функции

    const calmingButton = document.querySelector('.calmingButton');
    const paragraph = calmingButton.querySelector('p');

    calmingButton.style.width = "150px";
    calmingButton.style.height = "150px";

    // Устанавливаем текст на кнопке для вдоха
    paragraph.textContent = "In";

    timeoutIds.push(setTimeout(function () {
        calmingButton.style.width = "75px";
        calmingButton.style.height = "75px";

        // Устанавливаем текст на кнопке для выдоха
        paragraph.textContent = "Out";
    }, 3500));

    breathingInterval = setTimeout(breathe, 7000); // Запускаем следующий цикл дыхания
}

function createMoodTracker(smile) {
    isMoodsTrackerOpened = true;
    const moodTrackerButtonParagraph = document.querySelector('.moodTrackerButton').querySelector('p');
    const MoodsContainer = document.querySelector('.MoodsContainer');
    const moodDataGrid = document.querySelector('.moodDataGrid');

    if (smile != null) {
        setTimeout(function () {
            moodTrackerButtonParagraph.style.opacity = "0";
            setTimeout(function () {
                moodTrackerButtonParagraph.textContent = "Change your mood";
                moodTrackerButtonParagraph.style.opacity = "1";
            }, 500);
        }, 500);
    }

    let delay = 30; // Задержка в миллисекундах

    const buttons3 = document.querySelectorAll('#dataGrid3 .image-button'); // Получаем все кнопки

    for (let index = buttons3.length - 1; index >= 0; index--) {
        const button = buttons3[index];
        setTimeout(() => {
            button.classList.remove('show'); // Добавляем класс для отображения и анимации
        }, (buttons3.length - 1 - index) * delay); // Увеличиваем задержку для каждого элемента
    }

    const buttons2 = document.querySelectorAll('#dataGrid2 .image-button'); // Получаем все кнопки

    buttons2.forEach((button, index) => {
        setTimeout(() => {
            button.classList.remove('show'); // Добавляем класс для отображения и анимации
        }, 150 + index * delay); // Увеличиваем задержку для каждого элемента
    });

    const buttons1 = document.querySelectorAll('#dataGrid1 .image-button'); // Получаем все кнопки

    for (let index = buttons1.length - 1; index >= 0; index--) {
        const button = buttons1[index];
        setTimeout(() => {
            button.classList.remove('show'); // Добавляем класс для отображения и анимации
        }, 270 + (buttons1.length - 1 - index) * delay); // Увеличиваем задержку для каждого элемента
    }

    let time = 1100;
    if (smile == null) {
        time = 750;
    }

    setTimeout(function () {
        isDailyMoodSelected = true;
        const date = new Date(); // Получаем текущую дату
        // Получаем номер дня месяца
        const day = date.getDate();
        if (smile != null) {
            monthMoods[day - 1] = smile;
        }
        const moodDataGrid = document.querySelector('.moodDataGrid');
        // Очищаем контейнер перед добавлением новых элементов
        moodDataGrid.innerHTML = '';

        const year = date.getFullYear(); // Получаем текущий год
        const month = date.getMonth(); // Получаем текущий месяц (0-11)

        // Определяем количество дней в текущем месяце
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Определяем первый день месяца (0 - воскресенье, ..., 6 - суббота)
        const firstDayOfMonth = new Date(year, month, 0).getDay();

        // Заполняем пустые ячейки до первого дня месяца
        for (let i = 0; i < firstDayOfMonth; i++) {
            const textNode = document.createTextNode(""); // Создаем текстовый узел с номером дня
            const textDiv = document.createElement('div'); // Создаем div для размещения текста
            textDiv.style.display = 'flex'; // Устанавливаем flex для центрирования текста
            textDiv.style.justifyContent = 'center'; // Центрирование по горизонтали
            textDiv.style.alignItems = 'center'; // Центрирование по вертикали
            textDiv.style.width = '35px'; // Ширина для центрирования текста
            textDiv.style.height = '35px'; // Высота для центрирования текста

            textDiv.appendChild(textNode); // Добавляем текстовый узел в div
            moodDataGrid.appendChild(textDiv); // Добавляем div с текстом в контейнер
        }

        // Добавляем элементы в контейнер
        for (let day = 1; day <= daysInMonth; day++) {
            if (monthMoods[day - 1] != "") {
                // Если день четный, добавляем изображение
                const img = document.createElement('img');
                img.src = '/assets/images/' + monthMoods[day - 1] + '.png'; // Укажите путь к вашему изображению
                img.style.width = '35px'; // Устанавливаем ширину изображения
                img.style.height = '35px'; // Устанавливаем высоту изображения
                moodDataGrid.appendChild(img); // Добавляем изображение в контейнер
            } else {
                // Если день нечетный, добавляем кружочек с номером
                const textNode = document.createTextNode(day); // Создаем текстовый узел с номером дня
                const textDiv = document.createElement('div'); // Создаем div для размещения текста
                textDiv.style.display = 'flex'; // Устанавливаем flex для центрирования текста
                textDiv.style.justifyContent = 'center'; // Центрирование по горизонтали
                textDiv.style.alignItems = 'center'; // Центрирование по вертикали
                textDiv.style.width = '35px'; // Ширина для центрирования текста
                textDiv.style.height = '35px'; // Высота для центрирования текста

                textDiv.appendChild(textNode); // Добавляем текстовый узел в div
                moodDataGrid.appendChild(textDiv); // Добавляем div с текстом в контейнер
            }
        }

        moodDataGrid.style.display = "grid";// Добавляем класс для плавного появления
        MoodsContainer.style.display = "none";// Добавляем класс для плавного появления
        setTimeout(function () {
            moodDataGrid.classList.add('visible');
        }, 50);

    }, time);
}

function showMoods() {
    isMoodsTrackerOpened = false;
    const moodTrackerButtonParagraph = document.querySelector('.moodTrackerButton').querySelector('p');
    const MoodsContainer = document.querySelector('.MoodsContainer');
    const moodDataGrid = document.querySelector('.moodDataGrid');
    moodDataGrid.classList.remove('visible');

    if (isDailyMoodSelected) {
        moodTrackerButtonParagraph.style.opacity = "0";
        setTimeout(function () {
            moodTrackerButtonParagraph.textContent = "Select your daily mood";
            moodTrackerButtonParagraph.style.opacity = "1";
        }, 500);
    }

    setTimeout(function () {
        moodDataGrid.style.display = "none";
        MoodsContainer.style.display = "block";
    }, 400);

    const buttons1 = document.querySelectorAll('#dataGrid1 .image-button'); // Получаем все кнопки
    let delay = 50; // Задержка в миллисекундах

    buttons1.forEach((button, index) => {
        setTimeout(() => {
            button.classList.add('show'); // Добавляем класс для отображения и анимации
        }, 425 + index * delay); // Увеличиваем задержку для каждого элемента
    });

    const buttons2 = document.querySelectorAll('#dataGrid2 .image-button'); // Получаем все кнопки

    for (let index = buttons2.length - 1; index >= 0; index--) {
        const button = buttons2[index];
        setTimeout(() => {
            button.classList.add('show'); // Добавляем класс для отображения и анимации
        }, 675 + (buttons2.length - 1 - index) * delay); // Увеличиваем задержку для каждого элемента
    }

    const buttons3 = document.querySelectorAll('#dataGrid3 .image-button'); // Получаем все кнопки

    buttons3.forEach((button, index) => {
        setTimeout(() => {
            button.classList.add('show'); // Добавляем класс для отображения и анимации
        }, 875 + index * delay); // Увеличиваем задержку для каждого элемента
    });
}

function WriterAdd() {
    const diseasesWriterInput = document.querySelector('.diseasesWriterInput');
    const diseasesWriterContainer = document.querySelector('.diseasesWriterContainer');
    const diseasesWriter = document.querySelector('.diseasesWriter');
    const diseasesWriterNext = document.querySelector('.diseasesWriterNext');
    const diseasesWriterParagraph = document.querySelector('.diseasesWriter').querySelector('p');

    if (currentStage == "diseaseName") {
        if (diseasesWriterInput.value.trim() !== '') {
            diseasesWriter.style.opacity = "0";

            setTimeout(() => {
                diseasesWriterNext.style.display = "block";
                diseasesWriterParagraph.textContent = "Enter a symptom:";
                diseasesWriterInput.value = '';
                diseasesWriter.style.opacity = "1";
            }, 650);

            let formData1 = new FormData();
            formData1.append("virusDiseaseName", diseasesWriterInput.value);
            fetch('/Main/AddVirusDisease', {
                method: 'POST',
                body: formData1
            });
            currentStage = "diseaseSymptoms";
        } else {
            alert("Please enter the name of the disease.");
        }

    }
    else if(currentStage == "diseaseSymptoms"){
        if (diseasesWriterInput.value.trim() !== '') {
            
            const newDiv = document.createElement('div');
            newDiv.className = 'symptom';
            newDiv.textContent = diseasesWriterInput.value;
            newDiv.setAttribute('b-3gxarn7yru', '');

            document.querySelector('.symptomsContainer').appendChild(newDiv);

            diseasesWriterInput.value = '';
        } else {
            alert("Please enter a symptom.");
        }
    }
}

function startDisease() {
    const diseasesWriterContainer = document.querySelector('.diseasesWriterContainer'); 
    const diseasesWriter = document.querySelector('.diseasesWriter'); 
    const startVirusDiseaseButtonParagraph = document.querySelector('.startVirusDiseaseButton').querySelector('p');

    diseasesWriterContainer.style.opacity = "1";
    diseasesWriterContainer.style.display = "block";
    startVirusDiseaseButtonParagraph.style.opacity = "0";

    setTimeout(() => {
        diseasesWriter.style.opacity = "1";
    }, 50);

    setTimeout(() => {
        startVirusDiseaseButtonParagraph.textContent = "End disease";
        startVirusDiseaseButtonParagraph.style.opacity = "1";
    }, 500);
}