let tg = window.Telegram.WebApp;
let isInputOpen = false;
let isCalmingStart = false;
let breathingInterval;
let timeoutIds = []; // Массив для хранения идентификаторов таймеров
let monthMoods = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
let isDailyMoodSelected = false;
let isMoodsTrackerOpened = false;
let currentStage = "diseaseName";
let counter;
let currentIndex = 0;



let bloodAnaliseParameters = [];
let urineAnaliseParameters = [];


class Drug {
    constructor(drugName, drugTimes) {
        this.drugName = drugName; // Имя лекарства
        this.drugTimes = drugTimes; // Времена приема
    }
}

class Symtom {
    constructor(symptomName, symptomSeverities) {
        this.symptomName = symptomName; //Тяжесть
        this.symptomSeverities = symptomSeverities; //Дата
    }
}

class SymptomSeverity {
    constructor(severity, date) {
        this.severity = severity; //Тяжесть
        this.date = date; //Дата
    }
}

class Disease {
    constructor(diseaseName, symptoms, therapies, drugs, bloodAnalises, urineAnalises) {
        this.diseaseName = diseaseName;
        this.symptoms = symptoms;
        this.therapies = therapies;
        this.drugs = drugs; 
        this.bloodAnalises = bloodAnalises;
        this.urineAnalises = urineAnalises;
    }
}

class Analise {
    constructor(analiseParameters) {
        this.analiseParameters = analiseParameters.slice();
        this.data = getCurrentDate();
    }
}

class Weight {
    constructor(weight, data) {
        this.weight = weight;
        this.data = data;
    }
}

class Height {
    constructor(height, data) {
        this.height = height;
        this.data = data;
    }
}

class Step {
    constructor(steps, day) {
        this.steps = steps;
        this.day = day;
    }
}

let virusDisease = new Disease("", [], [], []);
let chronicDiseases = [];
let mentalDiseases = [];
let userWeights = [];
let userHeights = [];

function getCurrentDate() {
    const today = new Date();

    // Извлекаем день, месяц и год
    const day = String(today.getDate()).padStart(2, '0'); // Делаем день двухзначным
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
    const year = today.getFullYear(); // Получаем полный год

    // Форматируем дату в нужный вид
    return `${day}.${month}.${year}`;
}

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


let startX;

// Добавляем обработчик события прокрутки
window.addEventListener('scroll', checkVisibility);

function uploadSleepTime(newSleepTime) {
    const bedTimeInput = document.querySelector('.bedTimeInput');
    let formattedTime = newSleepTime.replace('.', ':');
    bedTimeInput.value = formattedTime;

    if (newSleepTime != "0") {
        let bedTimeCheckBox = document.querySelector(".bedTimeCheckBox");
        bedTimeCheckBox.checked = true;
        bedTimeInput.classList.add("active");
    }
}

function sleepTimeLostFocus() {
    const bedTimeInput = document.querySelector('.bedTimeInput');

    let sleepTimeFormData = new FormData();
    sleepTimeFormData.append("newSleepTime", bedTimeInput.value);

    fetch('/Main/USleepTime', {
        method: 'POST',
        body: sleepTimeFormData
    })
}

document.addEventListener('DOMContentLoaded', () => {
    const stepsInput = document.querySelector('.steps');
    const newWeightInput = document.querySelector('.newWeightInput');
    const newHeightInput = document.querySelector('.newHeightInput');
    const bedTimeInput = document.querySelector('.bedTimeInput');
    const diseasesWriterInput = document.querySelector('.diseasesWriterInput');
    const entityInputs = document.getElementsByClassName('entityInput');

    tg.expand();

    tg.MainButton.show();
    tg.MainButton.text = "mipmap";
    tg.MainButton.onClick(() => {
        if (isInputOpen) {
            stepsInput.blur();
            newWeightInput.blur();
            newHeightInput.blur();
            diseasesWriterInput.blur();

            for (let i = 0; i < entityInputs.length; i++) {
                entityInputs[i].blur();
            }

            tg.MainButton.text = "mipmap";
            isInputOpen = false;
        }
        else {
            sendMessage(tg.initDataUnsafe.user.id, bedTimeInput.value);
        }
    });

    tg.ready();
    userName = "m1pmap";//tg.initDataUnsafe.user.username;

    let formData = new FormData();
    formData.append("userName", userName); //wedl_666 k0tegg Saeredf

    fetch('/Main/AddUser', {
            method: 'POST',
            body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Болезни пользователя не найдены.');
        }
        return response.json(); // Преобразуем ответ в JSON
    })
    .then(data => {
        if (data.virusDisease.diseaseName != "") {
            virusDisease = new Disease(data.virusDisease.diseaseName, data.virusDisease.symptoms, data.virusDisease.therapies, data.virusDisease.drugs, data.virusDisease.urineAnalises);
        }    

        data.chronicDiseases.forEach(cd => {
            chronicDiseases.push(new Disease(cd.diseaseName, cd.symptoms, cd.therapies, cd.drugs, cd.bloodAnalises, cd.urineAnalises));
        });

        data.mentalDiseases.forEach(md => {
            mentalDiseases.push(new Disease(md.diseaseName, md.symptoms, md.therapies, md.drugs, md.bloodAnalises, md.urineAnalises));
        });

        let mentalEmotions = data.mentalEmotions;
        mentalEmotions.forEach(me => {
            monthMoods[me.dayNum] = me.emotion;
        });

        data.userWeight.forEach(uw => {
            userWeights.push(new Weight(uw.weight, uw.data));
        })

        data.userHeight.forEach(uh => {
            userHeights.push(new Height(uh.height, uh.data));
        })

        uploadWeight();
        uploadHeight();


        
        uploadSleepTime(data.userSleepTime);
        uploadStepsActivity(data.userSteps);

        diseaseUpload("virus");
        diseaseUpload("chronic");
        diseaseUpload("mental");
        alert("Данные загружены.");
    })
    .catch(error => {
        alert(error);
        console.error('Error:', error);
    });

    document.querySelector('.addNewWeightButton').addEventListener('click', () => {
        document.querySelector('.addNewWeightButton').classList.add('active');
    });

    document.querySelector('.bedTimeCheckBox').addEventListener('click', function () {
        bedTimeInput.classList.toggle('active');
        if (!bedTimeInput.classList.contains('active')) {
            if (bedTimeInput.value != "") {
                let sleepTimeFormData = new FormData();
                sleepTimeFormData.append("newSleepTime", "0");

                fetch('/Main/USleepTime', {
                    method: 'POST',
                    body: sleepTimeFormData
                })
                setTimeout(function () {
                    bedTimeInput.value = undefined;
                }, 500);
            }
        } 
    });

    stepsInput.addEventListener('input', function () {
        if (adjustWidth(stepsInput, 5) == 1) {
            const chart = Chart.getChart('myChart');
            index = getCurrentDayIndex() - 1;
            updateData(chart, stepsInput.value, index);

            let stepsFormData = new FormData();
            stepsFormData.append("updateStep", stepsInput.value);

            fetch('/Main/USteps', {
                method: 'POST',
                body: stepsFormData
            })

            const steps = stepsInput.value;
            const distantion = steps * 1.15 / 1000;
            document.querySelector('.distantion').textContent = "~" + distantion.toFixed(3) + "км пройдено";

            const calories = steps * 0.04;
            document.querySelector('.calories').textContent = "~" + calories.toFixed(0) + "ккал сожжено";

            changeStepsAdvicies();
        }
    });

    document.querySelector('.addWeight').addEventListener('click', function () {
        const chart = Chart.getChart('weightChart');
        addHW(chart, newWeightInput);
        document.querySelector('.weightText').innerText = newWeightInput.value;

        let weightFormData = new FormData();

        if (userWeights.length != 0) {
            if (userWeights[userWeights.length - 1].data != getCurrentDate()) {
                userWeights.push(new Weight(newWeightInput.value, getCurrentDate()))
                weightFormData.append("weight", newWeightInput.value);
            }
            else {
                weightFormData.append("updateWeight", newWeightInput.value);
                userWeights[userWeights.length - 1].weight = newWeightInput.value;
            }
        }
        else {
            userWeights.push(new Weight(newWeightInput.value, getCurrentDate()))
            weightFormData.append("weight", newWeightInput.value);
        }
        
        

        fetch('/Main/CUWeight', {
            method: 'POST',
            body: weightFormData
        })

        changeWHAdvicies();
    });
    document.querySelector('.addHeight').addEventListener('click', function () {
        const chart = Chart.getChart('heightChart');
        addHW(chart, newHeightInput);
        document.querySelector('.heightText').innerText = newHeightInput.value;

        let heightFormData = new FormData();

        if (userHeights.length != 0) {
            if (userHeights[userHeights.length - 1].data != getCurrentDate()) {
                userHeights.push(new Weight(newHeightInput.value))
                heightFormData.append("height", newHeightInput.value);
            }
            else {
                heightFormData.append("updateHeight", newHeightInput.value);
                userHeights[userHeights.length - 1].weight = newHeightInput.value;
            }
        }
        else {
            userHeights.push(new Weight(newHeightInput.value))
            heightFormData.append("height", newHeightInput.value);
        }



        fetch('/Main/CUHeight', {
            method: 'POST',
            body: heightFormData
        })

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
        changeHealthPageName("Вирусные заболевания");
        setTimeout(function () {
            openViralDiseasesPage();
        }, 750);


    });

    chronicDiseasesButton.addEventListener('click', () => {
        hideAllHealthButtons(chronicDiseasesButton, viralDiseasesButton, mentalDiseasesButton, otherButton);
        changeHealthPageName("Хронические болезни");
        setTimeout(function () {
            openChronicDiseasesPage();
        }, 750);
    });

    mentalDiseasesButton.addEventListener('click', () => {
        hideAllHealthButtons(mentalDiseasesButton, chronicDiseasesButton, viralDiseasesButton, otherButton);
        changeHealthPageName("Психологические болезни");
        setTimeout(function () {
            openMentalDiseasesPage();
        }, 750);
    });

    otherButton.addEventListener('click', () => {
        hideAllHealthButtons(otherButton, mentalDiseasesButton, viralDiseasesButton, chronicDiseasesButton);
        changeHealthPageName("Другое");

        setTimeout(function () {
            openOtherDiseasesPage();
        }, 750);
    });


    adjustWidth(stepsInput, 5);
    adjustWidth(newWeightInput, 3);
    adjustWidth(newHeightInput, 3);

    changeStepsAdvicies();
    changeWHAdvicies();

    let prevBtn = document.getElementById('prevBtn');
    let nextBtn = document.getElementById('nextBtn');

    nextBtn.addEventListener('click', () => {
        currentIndex++;
        updateSlidePosition("virus");
    });

    prevBtn.addEventListener('click', () => {
        currentIndex--;
        updateSlidePosition("virus");
    });  

    prevBtn = document.getElementById('chronicPrevBtn');
    nextBtn = document.getElementById('chronicNextBtn');

    nextBtn.addEventListener('click', () => {
        currentIndex++;
        updateSlidePosition("chronic");
    });

    prevBtn.addEventListener('click', () => {
        currentIndex--;
        updateSlidePosition("chronic");
    });

    prevBtn = document.getElementById('mentalPrevBtn');
    nextBtn = document.getElementById('mentalNextBtn');

    nextBtn.addEventListener('click', () => {
        currentIndex++;
        updateSlidePosition("mental");
    });

    prevBtn.addEventListener('click', () => {
        currentIndex--;
        updateSlidePosition("mental");
    });
});

function uploadWeight() {
    if (userWeights.length != 0) {
        userWeights.forEach(uw => {
            const chart = Chart.getChart('weightChart');
            addData(chart, uw.data, uw.weight);
        })

        let weightText = document.querySelector('.weightText');
        weightText.textContent = userWeights[userWeights.length - 1].weight;
    }
}

function uploadHeight() {
    if (userHeights.length != 0) {
        userHeights.forEach(uh => {
            const chart = Chart.getChart('heightChart');
            addData(chart, uh.data, uh.height);
        })

        let heightText = document.querySelector('.heightText');
        heightText.textContent = userHeights[userHeights.length - 1].height;
    }
}

function uploadStepsActivity(steps) {
    const stepsInput = document.querySelector('.steps');
    const chart = Chart.getChart('myChart');

    steps.forEach(s => {
        updateData(chart, s.steps, s.day);
    })
    index = getCurrentDayIndex() - 1;

    value = steps[getCurrentDayIndex() - 1].steps;
    stepsInput.value = Number(value);
    adjustWidth(stepsInput, 5);
}

function updateSlidePosition(diseaseType) {
    let slidesContainer;
    if (diseaseType == "virus") {
        slidesContainer = document.getElementById('virusSlidesContainer');
    } else if (diseaseType == "chronic") {
        slidesContainer = document.getElementById('chronicSlidesContainer');
    } else if (diseaseType == "mental") {
        slidesContainer = document.getElementById('mentalSlidesContainer');
    }
    const totalSlides = slidesContainer.children.length; // Общее количество слайдов
    currentIndex = (currentIndex + totalSlides) % totalSlides; // Обеспечиваем цикличность
    const offset = -currentIndex * 100; // Вычисляем смещение
    slidesContainer.style.transform = `translateX(${offset}%)`; // Применяем смещение
}

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
        stepsAdviciesText.textContent = "На этой неделе у вас слишком мало шагов(" + totalSum + "). Вам нужно чаще выходить на улицу.";
    }
    else {
        if (totalSum <= 40000) {
            stepsIndicator.style.backgroundColor = "rgba(255, 207, 64, 0.75)";
            stepsAdviciesText.textContent = "На этой неделе у вас хорошее количество шагов(" + totalSum + "). Но этого недостаточно, чтобы сохранять ваше здоровье.";
        }
        else {
            stepsIndicator.style.backgroundColor = "rgba(100, 134, 83, 0.75)";
            stepsAdviciesText.textContent = "Так держать. У вас достаточно шагов на этой неделе(" + totalSum + ")."
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
        WHAdviciesText.textContent = "У вас недостаточный вес, если судить по слишком низкому ИМТ(" + BMI + "). Вам следует увеличить количество потребляемых калорий, чаще питаться и начать заниматься физической активностью.";
        WHIndicator.style.backgroundColor = "rgba(190,75,75,0.75)";
    }
    else {
        if (BMI < 25) {
            WHAdviciesText.textContent = "Ваш вес полностью соответствует вашему росту в соответствии с ИМТ(" + BMI + ") и вам не о чем беспокоиться.";
            WHIndicator.style.backgroundColor = "rgba(100, 134, 83, 0.75)";
        }
        else {
            if (BMI < 30) {
                WHAdviciesText.textContent = "У вас избыточный вес в соответствии с ИМТ(" + BMI + "). Вам следует сбалансировать свой рацион, чаще есть небольшими порциями, начать заниматься физической активностью и стараться меньше подвергаться стрессу.";
                WHIndicator.style.backgroundColor = "rgba(255, 207, 64, 0.75)";
            }
            else {
                WHAdviciesText.textContent = "Судя по ИМТ, вы страдаете ожирением(" + BMI + "). Вам следует сбалансировать свой рацион, чаще есть небольшими порциями, начать заниматься физической активностью и стараться меньше подвергаться стрессу.";
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
        delay = closeViralDiseasesPage();
    }
    else if (diseaseType == "chronic") {
        delay = closeChronicDiseasesPage();
    }
    else if (diseaseType == "mental") {
        delay = closeMentalDiseasesPage();
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

    viralDiseases.style.display = "block";
    virusButtonsContainer.style.opacity = "1";
    setTimeout(function () {
        virusBackButton.style.opacity = "1";
    }, 50);
    setTimeout(function () {
        startVirusDiseaseButton.style.opacity = "1";
    }, 150);
}

function closeViralDiseasesPage() {
    const viralDiseases = document.querySelector('.viralDiseases');

    setTimeout(function () {
        changeHealthPageName("Здоровье");
    }, 50);
    setTimeout(function () {
        viralDiseases.style.display = "none";
    }, 150);

    return 150;
}

function openChronicDiseasesPage() {
    const chronicDiseases = document.querySelector('.chronicDiseases');
    const chronicButtonsContainer = document.querySelector('.chronicButtonsContainer');

    chronicDiseases.style.display = "block";
    chronicButtonsContainer.style.opacity = "1";
}

function closeChronicDiseasesPage() {
    const chronicDiseases = document.querySelector('.chronicDiseases');

    setTimeout(function () {
        changeHealthPageName("Здоровье");
    }, 50);
    setTimeout(function () {
        chronicDiseases.style.display = "none";
    }, 150);

    return 150;
}

function openMentalDiseasesPage() {
    const mentalDiseases = document.querySelector('.mentalDiseases');
    const mentalButtonsContainer = document.querySelector('.mentalButtonsContainer');
    const moodDataGrid = document.querySelector('.moodDataGrid');
    const MoodsContainer = document.querySelector('.MoodsContainer');

    mentalDiseases.style.display = "block";
    mentalButtonsContainer.style.opacity = "1";

    if (isDailyMoodSelected) {
        moodDataGrid.style.display = "none";
        MoodsContainer.style.display = "block";
        moodDataGrid.classList.remove('visible');
        createMoodTracker(null);
    }
    else {
        showMoods();
    }
}

function closeMentalDiseasesPage() {
    if (isCalmingStart) {
        endCalming();
    }
    const mentalDiseases = document.querySelector('.mentalDiseases');
    const moodDataGrid = document.querySelector('.moodDataGrid');
    let time = 0;
    if (isMoodsTrackerOpened) {
        moodDataGrid.classList.remove('visible');
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
        changeHealthPageName("Здоровье");
    }, time - 500);
    setTimeout(function () {
        mentalDiseases.style.display = "none";
    }, time - 350);

    return time - 300;
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

    setTimeout(function () {
        changeHealthPageName("Здоровье");
    }, 150);
    setTimeout(function () {
        otherDiseases.style.display = "none";
    }, 250);

    return 350;
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
        paragraph.textContent = "Старт";
        paragraph.style.opacity = 1;
    }, 500));

    timeoutIds.push(setTimeout(function () {
        calmingInstructor.style.opacity = "1";
    }, 1000));

    timeoutIds.push(setTimeout(function () {
        calmingInstructor.style.opacity = 0;
    }, 3000));

    timeoutIds.push(setTimeout(function () {
        calmingInstructor.textContent = "Сосредоточьтесь на своем дыхании";
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
        paragraph.textContent = "Стоп"; // Устанавливаем текст на кнопке
        paragraph.style.opacity = 1;
        calmingInstructor.style.opacity = "0";
    }, 500);

    setTimeout(function () {
        paragraph.style.opacity = 0;
    }, 1000);

    setTimeout(function () {
        paragraph.style.opacity = 1;
        paragraph.textContent = "Дыхание"
        calmingButton.style.backgroundColor = "rgba(96, 96, 96,0.5)";
        calmingButton.style.width = "calc(100% - 20px)";
        calmingButton.style.height = "45px";
        calmingButton.style.marginTop = "10px";
        calmingButton.style.marginBottom = "0px";
        calmingButton.style.borderRadius = "12px";
        calmingInstructor.style.height = "0";
        calmingInstructor.textContent = "Расслабьтесь и устройтесь поудобнее";
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
    paragraph.textContent = "Вдох";

    timeoutIds.push(setTimeout(function () {
        calmingButton.style.width = "75px";
        calmingButton.style.height = "75px";

        // Устанавливаем текст на кнопке для выдоха
        paragraph.textContent = "Выдох";
    }, 3500));

    breathingInterval = setTimeout(breathe, 7000); // Запускаем следующий цикл дыхания
}

function createMoodTracker(smile) {
    isMoodsTrackerOpened = true;
    const moodTrackerButtonParagraph = document.querySelector('.moodTrackerButton').querySelector('p');
    const MoodsContainer = document.querySelector('.MoodsContainer');

    if (smile != null) {
        setTimeout(function () {
            moodTrackerButtonParagraph.style.opacity = "0";
            setTimeout(function () {
                moodTrackerButtonParagraph.textContent = "Изменить настроение";
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
            let mentalEmotionFormData = new FormData();

            if (monthMoods[day - 1] != "") {
                mentalEmotionFormData.append("updateMentalEmotion", smile);
            }
            else {
                mentalEmotionFormData.append("mentalEmotion", smile);
            }
            // Отправка данных на сервер
            fetch('/Main/CUMentalEmotion', {
                method: 'POST',
                body: mentalEmotionFormData
            })

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
            moodTrackerButtonParagraph.textContent = "Настроение сегодня";
            moodTrackerButtonParagraph.style.opacity = "1";
        }, 500);
    }

    setTimeout(function () {
        moodDataGrid.style.display = "none";
        MoodsContainer.style.display = "block";
    }, 0);

    const buttons1 = document.querySelectorAll('#dataGrid1 .image-button'); // Получаем все кнопки
    let delay = 0; // Задержка в миллисекундах

    buttons1.forEach((button, index) => {
        setTimeout(() => {
            button.classList.add('show'); // Добавляем класс для отображения и анимации
        }, 0 + index * delay); // Увеличиваем задержку для каждого элемента
    });

    const buttons2 = document.querySelectorAll('#dataGrid2 .image-button'); // Получаем все кнопки

    for (let index = buttons2.length - 1; index >= 0; index--) {
        const button = buttons2[index];
        setTimeout(() => {
            button.classList.add('show'); // Добавляем класс для отображения и анимации
        }, 0 + (buttons2.length - 1 - index) * delay); // Увеличиваем задержку для каждого элемента
    }

    const buttons3 = document.querySelectorAll('#dataGrid3 .image-button'); // Получаем все кнопки

    buttons3.forEach((button, index) => {
        setTimeout(() => {
            button.classList.add('show'); // Добавляем класс для отображения и анимации
        }, 0 + index * delay); // Увеличиваем задержку для каждого элемента
    });
}

function WriterAdd(diseaseType) {
    let diseasesWriterInput;
    let diseasesWriter;
    let diseasesWriterNext;
    let diseasesWriterParagraph;
    let symptomsContainer;
    let drugsContainer;

    if (diseaseType == "virus") {
        diseasesWriterInput = document.querySelector('.diseasesWriterInput');
        diseasesWriter = document.querySelector('.diseasesWriter');
        diseasesWriterNext = document.querySelector('.diseasesWriterNext');
        diseasesWriterParagraph = diseasesWriter.querySelector('p');
        symptomsContainer = document.querySelector('.symptomsContainer');
        drugsContainer = document.querySelector('.drugsContainer');
    }
    else if (diseaseType == "chronic") {
        diseasesWriterInput = document.getElementById('chronicDiseasesWriterInput');
        diseasesWriter = document.getElementById('chronicDiseasesWriter');
        diseasesWriterNext = document.getElementById('chronicDiseasesWriterNext');
        diseasesWriterParagraph = diseasesWriter.querySelector('p');
        symptomsContainer = document.getElementById('chronicSymptomsContainer');
        drugsContainer = document.getElementById('chronicDrugsContainer')
    }
    else if (diseaseType == "mental") {
        diseasesWriterInput = document.getElementById('mentalDiseasesWriterInput');
        diseasesWriter = document.getElementById('mentalDiseasesWriter');
        diseasesWriterNext = document.getElementById('mentalDiseasesWriterNext');
        diseasesWriterParagraph = diseasesWriter.querySelector('p');
        symptomsContainer = document.getElementById('mentalSymptomsContainer');
        drugsContainer = document.getElementById('mentalDrugsContainer')
    }
    

    if (currentStage == "diseaseName") {
        if (diseasesWriterInput.value.trim() !== '') {
            if (diseaseType == "virus") {
                virusDisease.diseaseName = diseasesWriterInput.value;
            } else if (diseaseType == "chronic") {
                if (chronicDiseases.some(disease => disease.diseaseName == diseasesWriterInput.value)) {
                    alert("Хроническая болезнь под таким именем уже существует.");
                    return;
                }
                chronicDiseases.push(new Disease(diseasesWriterInput.value, [], [], []));
            } else if (diseaseType == "mental") {
                if (mentalDiseases.some(disease => disease.diseaseName == diseasesWriterInput.value)) {
                    alert("Психологическая болезнь под таким именем уже существует.");
                    return;
                }
                mentalDiseases.push(new Disease(diseasesWriterInput.value, [], [], []));
            }
            diseasesWriter.style.opacity = "0";

            setTimeout(() => {
                diseasesWriterNext.style.display = "block";
                diseasesWriterParagraph.textContent = "Введите симптом:";
                diseasesWriterInput.value = '';
                diseasesWriter.style.opacity = "1";
            }, 650);

            currentStage = "diseaseSymptoms";
        } else {
            alert("Пожалуйста, введите название заболевания.");
        }

    }
    else if (currentStage == "diseaseSymptoms") {
        if (diseasesWriterInput.value.trim() !== '') {
            const symptomSeverities = [];
            symptomSeverities.push(new SymptomSeverity("0", getCurrentDate()));
            if (diseaseType == "virus") {
                if (virusDisease.symptoms.some(s => s.symptomName == diseasesWriterInput.value)) {
                    alert("Симптом с таким именем уже существует.");
                    return;
                }
                virusDisease.symptoms.push(new Symtom(diseasesWriterInput.value, symptomSeverities));
            } else if (diseaseType == "chronic") {
                if (chronicDiseases[chronicDiseases.length - 1].symptoms.some(s => s.symptomName == diseasesWriterInput.value)) {
                    alert("Симптом с таким именем уже существует.");
                    return;
                }
                chronicDiseases[chronicDiseases.length - 1].symptoms.push(new Symtom(diseasesWriterInput.value, symptomSeverities));
            } else if (diseaseType == "mental") {
                if (mentalDiseases[mentalDiseases.length - 1].symptoms.some(s => s.symptomName == diseasesWriterInput.value)) {
                    alert("Симптом с таким именем уже существует.");
                    return;
                }
                mentalDiseases[mentalDiseases.length - 1].symptoms.push(new Symtom(diseasesWriterInput.value, symptomSeverities));
            }

            symptomsContainer.style.display = "block";
            symptomsContainer.style.opacity = "1";
            const newDiv = document.createElement('div');
            newDiv.className = 'symptom';
            newDiv.textContent = diseasesWriterInput.value;
            newDiv.setAttribute('b-3gxarn7yru', '');

            symptomsContainer.appendChild(newDiv);

            
            diseasesWriterInput.value = '';

        } else {
            alert("Пожалуйста, укажите симптом.");
        }
    }
    else if (currentStage == "drugs") {
        if (diseasesWriterInput.value.trim() !== '') {
            if (diseaseType == "virus") {
                if (virusDisease.drugs.some(s => s.drugName == diseasesWriterInput.value)) {
                    alert("Лекарство с таким именем уже существует.");
                    return;
                }
                virusDisease.drugs.push(new Drug(diseasesWriterInput.value, ["05:08"]));
            } else if (diseaseType == "chronic") {
                if (chronicDiseases[chronicDiseases.length - 1].drugs.some(s => s.drugName == diseasesWriterInput.value)) {
                    alert("Лекарство с таким именем уже существует.");
                    return;
                }
                chronicDiseases[chronicDiseases.length - 1].drugs.push(new Drug(diseasesWriterInput.value, ["05:08"]));
            } else if (diseaseType == "mental") {
                if (mentalDiseases[mentalDiseases.length - 1].drugs.some(s => s.drugName == diseasesWriterInput.value)) {
                    alert("Лекарство с таким именем уже существует.");
                    return;
                }
                mentalDiseases[mentalDiseases.length - 1].drugs.push(new Drug(diseasesWriterInput.value, ["05:08"]));
            }
            const newDiv = document.createElement('div');
            newDiv.className = 'symptom';
            newDiv.textContent = diseasesWriterInput.value;
            newDiv.setAttribute('b-3gxarn7yru', '');

            drugsContainer.appendChild(newDiv);

            diseasesWriterInput.value = '';

        } else {
            alert("Пожалуйста, введите лекарство.");
        }
    }
}   


function WriterNext(diseaseType) {
    let symptomsSeverityContainer;
    let therapiesContainer;
    let drugsContainer;
    let diseasesWriter;
    let symptomsContainer
    let startVirusDiseaseButtonParagraph;

    let disease;
    if (diseaseType == 'virus') {
        symptomsSeverityContainer = document.querySelector('.symptomsSeverityContainer');
        therapiesContainer = document.querySelector('.therapiesContainer');
        drugsContainer = document.querySelector('.drugsContainer');
        diseasesWriter = document.querySelector('.diseasesWriter');
        symptomsContainer = document.querySelector('.symptomsContainer');
        startVirusDiseaseButtonParagraph = document.querySelector('.startVirusDiseaseButton').querySelector('p');

        disease = virusDisease;
    } else if (diseaseType == 'chronic') {
        symptomsSeverityContainer = document.getElementById('chronicSymptomsSeverityContainer');
        therapiesContainer = document.getElementById('chronicTherapiesContainer');
        drugsContainer = document.getElementById('chronicDrugsContainer');
        diseasesWriter = document.getElementById('chronicDiseasesWriter');
        symptomsContainer = document.getElementById('chronicSymptomsContainer');
        startVirusDiseaseButtonParagraph = document.querySelector('.addChronicDiseaseButton').querySelector('p');
        disease = chronicDiseases[chronicDiseases.length - 1];
    } else if (diseaseType == "mental") {
        symptomsSeverityContainer = document.getElementById('mentalSymptomsSeverityContainer');
        therapiesContainer = document.getElementById('mentalTherapiesContainer');
        drugsContainer = document.getElementById('mentalDrugsContainer');
        diseasesWriter = document.getElementById('mentalDiseasesWriter');
        symptomsContainer = document.getElementById('mentalSymptomsContainer');
        startVirusDiseaseButtonParagraph = document.querySelector('.addMentalDiseaseButton').querySelector('p');
        disease = mentalDiseases[mentalDiseases.length - 1];
    }
    
    if (currentStage == "diseaseSymptoms") {
        if (disease.symptoms.length > 0) {
            //symptomSeverities = new Array(virusDisease.symptoms.length);
            counter = disease.symptoms.length;


            let i = 0;
            for (let i = 0; i < disease.symptoms.length; i++) {
                // Создаем элемент для симптома
                const symptomDiv = document.createElement('div');
                symptomDiv.className = 'symptom';
                symptomDiv.textContent = disease.symptoms[i].symptomName;
                symptomDiv.setAttribute('b-3gxarn7yru', '');

                // Создаем контейнер для типов тяжести
                const severityTypesContainer = document.createElement('div');
                severityTypesContainer.className = 'severityTypesContainer';
                severityTypesContainer.setAttribute('b-3gxarn7yru', '');

                // Создаем кнопки для тяжести
                const severities = ['Easy', 'Mid', 'Hard'];
                severities.forEach(severity => {
                    const button = document.createElement('button');
                    button.className = `severity ${severity}Severity`;
                    button.setAttribute('b-3gxarn7yru', '');
                    if (severity == "Easy") {
                        button.textContent = "Легко";
                    } else if (severity == "Mid") {
                        button.textContent = "Средне";
                    } else {
                        button.textContent = "Сильно";
                    }

                    button.onclick = () => {
                        counter--;
                        disease.symptoms[i].symptomSeverities[0].severity = severity;
                        severityTypesContainer.style.opacity = "0";
                        symptomDiv.style.opacity = "0";

                        setTimeout(() => {
                            severityTypesContainer.style.height = "0";
                            severityTypesContainer.style.margin = "0";
                            symptomDiv.style.height = "0";
                            symptomDiv.style.margin = "0";
                        }, 250);

                        setTimeout(() => {
                            severityTypesContainer.style.display = "none";
                            symptomDiv.style.display = "none";
                        }, 750);

                        if (counter == 0) {
                            WriterNext(diseaseType);
                        }
                    };

                    severityTypesContainer.appendChild(button);
                });

                // Добавляем элементы в контейнер
                symptomsSeverityContainer.appendChild(symptomDiv);
                symptomsSeverityContainer.appendChild(severityTypesContainer);
            }

            symptomsContainer.style.opacity = "0";
            diseasesWriter.style.opacity = "0";

            setTimeout(() => {
                diseasesWriter.style.display = "none";
                symptomsContainer.style.display = "none";
                symptomsSeverityContainer.style.display = "block";

                setTimeout(() => {
                    symptomsSeverityContainer.style.opacity = "1";
                }, 100);
            }, 550);

            currentStage = "symptomsSeverity";
        }
        else {
            alert("Для начала добавьте симптом.");
        }
    }
    else if (currentStage == "symptomsSeverity") {

        symptomsSeverityContainer.style.opacity = "0";

        setTimeout(() => {
            symptomsSeverityContainer.style.display = "none";
            therapiesContainer.style.display = "block";
            setTimeout(() => {
                therapiesContainer.style.opacity = "1";
            }, 50);
        }, 550);

        currentStage = "drugs";
    }
    else if (currentStage == "therapies") {
        const diseasesWriterParagraph = diseasesWriter.querySelector('p');

        therapiesContainer.style.opacity = "0";

        setTimeout(() => {
            therapiesContainer.style.display = "none";
            diseasesWriter.style.display = "block"
            diseasesWriterParagraph.textContent = "Укажите ваши лекарства:";
            drugsContainer.style.display = "block";

            setTimeout(() => {
                diseasesWriter.style.opacity = "1";
                drugsContainer.style.opacity = "1";
            }, 50);
        }, 550);

        currentStage = "drugs";
    }
    else if (currentStage == "drugs") {
        if (!isEndButtonChanged) {
            if (disease.drugs.length == 0 ) {
                alert("Для начала добавьте лекарство.");
                return;
            }
        }
        
        startVirusDiseaseButtonParagraph.style.opacity = "0";
        drugsContainer.style.opacity = "0";
        therapiesContainer.style.opacity = "0";
        diseasesWriter.style.opacity = "0";

        setTimeout(() => {
            startVirusDiseaseButtonParagraph.textContent = "Начать";
            startVirusDiseaseButtonParagraph.style.opacity = "1";
        }, 500);

        setTimeout(() => {
            drugsContainer.style.display = "none";
            therapiesContainer.style.display = "none";
            diseasesWriter.style.display = "none";
        }, 650);

        currentStage = "diseaseName";

        let formData = new FormData();

        if (diseaseType == 'virus') {
            formData.append("diseaseType", "Virus");
            diseaseUpload("virus");
        } else if (diseaseType == 'chronic') {
            formData.append("diseaseType", "Chronic");
            diseaseUpload("chronic");
        } else if (diseaseType == 'mental') {
            formData.append("diseaseType", "Mental");
            diseaseUpload("mental");
        }
        formData.append("diseaseName", disease.diseaseName);
        formData.append("symptoms", JSON.stringify(disease.symptoms.map(symptom => symptom.symptomName)));
        formData.append("symptomSeverities", JSON.stringify(disease.symptoms.flatMap(symptom => symptom.symptomSeverities.map(severity => severity.severity))));
        formData.append("therapies", JSON.stringify(disease.therapies));
        formData.append("drugs", JSON.stringify(disease.drugs.map(drug => drug.drugName)));
        // Отправка данных на сервер
        fetch('/Main/AddDisease', {
            method: 'POST',
            body: formData
        })

        isDiseaseStart = false;
    }
}

let isDiseaseStart = false;
function startDisease(diseaseType) {
    let diseasesWriterContainer;
    let diseasesWriter;
    let diseasesWriterNext;
    let startVirusDiseaseButtonParagraph;
    let diseasesWriterParagraph;
    let currentDisease;
    let myDiseasesButton;

    if (diseaseType == "virus") {
        diseasesWriterContainer = document.querySelector('.diseasesWriterContainer');
        diseasesWriter = document.querySelector('.diseasesWriter');
        diseasesWriterNext = document.querySelector('.diseasesWriterNext');
        startVirusDiseaseButtonParagraph = document.querySelector('.startVirusDiseaseButton').querySelector('p');
        diseasesWriterParagraph = diseasesWriter.querySelector('p');
        currentDisease = document.querySelector('.currentDisease');
    } else if (diseaseType == 'chronic') {
        diseasesWriterContainer = document.getElementById('chronicDiseasesWriterContainer');
        diseasesWriter = document.getElementById('chronicDiseasesWriter');
        diseasesWriterNext = document.getElementById('chronicDiseasesWriterNext');
        startVirusDiseaseButtonParagraph = document.querySelector('.addChronicDiseaseButton').querySelector('p');
        diseasesWriterParagraph = diseasesWriter.querySelector('p');
        currentDisease = document.getElementById('currentChronicDisease');

        myDiseasesButton = document.getElementById('myChronicDiseases');
        myDiseasesButton.style.opacity = "0";

    } else if (diseaseType == 'mental') {
        diseasesWriterContainer = document.getElementById('mentalDiseasesWriterContainer');
        diseasesWriter = document.getElementById('mentalDiseasesWriter');
        diseasesWriterNext = document.getElementById('mentalDiseasesWriterNext');
        startVirusDiseaseButtonParagraph = document.querySelector('.addMentalDiseaseButton').querySelector('p');
        diseasesWriterParagraph = diseasesWriter.querySelector('p');
        currentDisease = document.getElementById('currentMentalDisease');
        myDiseasesContainer = document.getElementById('myMentalDiseases');
    }

    if (isDiseaseStart == false) {
        isDiseaseStart = true;
        currentDisease.style.opacity = "0";
        startVirusDiseaseButtonParagraph.style.opacity = "0";

        setTimeout(() => {
            currentDisease.style.display = "none";
            diseasesWriterContainer.style.opacity = "1";
            diseasesWriterContainer.style.display = "block";
            diseasesWriter.style.display = "block";
            diseasesWriterNext.style.display = "none";
            startVirusDiseaseButtonParagraph.style.opacity = "0";
            diseasesWriterParagraph.textContent = "Введите название заболевания:";
            startVirusDiseaseButtonParagraph.textContent = "Закончить";
            startVirusDiseaseButtonParagraph.style.opacity = "1";

            setTimeout(() => {
                diseasesWriter.style.opacity = "1";
            }, 50);
        }, 550);

        diseaseRestart(diseaseType);
    }
    else {
        isDiseaseStart = false;
        diseasesWriterContainer.style.opacity = "0";
        startVirusDiseaseButtonParagraph.style.opacity = "0";

        setTimeout(() => {
            startVirusDiseaseButtonParagraph.textContent = "Начать";
            startVirusDiseaseButtonParagraph.style.opacity = "1";

            diseasesWriterContainer.style.display = "none";
            currentDisease.style.display = "block";
            diseasesWriter.style.opacity = "0";
            diseasesWriter.style.display = "none";
            
            setTimeout(() => {
                currentDisease.style.opacity = "1";
                if (diseaseType == "chronic") {
                    myDiseasesButton.style.opacity = "1";
                }
            }, 50);
        }, 500);

    }
}

let isEndButtonChanged = true;

function addRemoveTherapy(therapyName, button, diseaseType)
{
    let endButton
    let targetTherapyName;
    let disease;
    if (diseaseType == 'virus') {
        endButton = document.querySelector('.endButton');
        targetTherapyName = "Противовирусные";
        disease = virusDisease;
    } else if (diseaseType == 'chronic') {
        endButton = document.getElementById('chronicEndButton');
        targetTherapyName = "Фармакология";
        disease = chronicDiseases[chronicDiseases.length - 1];
    }
    else if (diseaseType == "mental") {
        endButton = document.getElementById('mentalEndButton');
        targetTherapyName = "Фармакология";
        disease = mentalDiseases[mentalDiseases.length - 1];
    }

    let therapyIndex = disease.therapies.indexOf(therapyName);
    if (therapyIndex == -1) {
        disease.therapies.push(therapyName);
        button.style.backgroundColor = "rgba(100, 134, 83, 0.7)";
    }
    else {
        disease.therapies.splice(therapyIndex, 1);
        button.style.backgroundColor = "rgba(96, 96, 96, 0.5)";
    }

    if (therapyName == targetTherapyName) {
        endButton.style.opacity = "0";

        setTimeout(() => {
            if (isEndButtonChanged) {
                endButton.textContent = "Продолжить";
                currentStage = "therapies";
                isEndButtonChanged = false;
            }
            else {
                endButton.textContent = "Закончить";
                currentStage = "drugs";
                isEndButtonChanged = true;
            }
            endButton.style.opacity = "1";
        }, 500);
    }
}

function diseaseRestart(diseaseType) {
    let endButton;
    let symptomsContainer
    let drugsContainer

    if (diseaseType == "virus") {
        virusDisease.symptoms.length = 0;
        virusDisease.therapies.length = 0;
        virusDisease.drugs.length = 0;

        endButton = document.querySelector('.endButton');
        symptomsContainer = document.querySelector(".symptomsContainer");
        drugsContainer = document.querySelector(".drugsContainer");

    } else if (diseaseType == "chronic") {
        endButton = document.getElementById('chronicEndButton');
        symptomsContainer = document.getElementById("chronicSymptomsContainer");
        drugsContainer = document.getElementById("chronicDrugsContainer");
    } else if (diseaseType == "mental") {
        endButton = document.getElementById('mentalEndButton');
        symptomsContainer = document.getElementById("mentalSymptomsContainer");
        drugsContainer = document.getElementById("mentalDrugsContainer");
    }
    
    isEndButtonChanged = true;
    const therapiesButtons = document.querySelectorAll('.therapy');
    therapiesButtons.forEach(therapy => {
        therapy.style.backgroundColor = "rgba(96, 96, 96, 0.5)";
    });

    endButton.textContent = "Закончить";
    symptomsContainer.innerHTML = "";
    drugsContainer.innerHTML = "";
    currentStage = "diseaseName";
}

function diseaseUpload(diseaseType) {
    let virusDiseaseName;
    let symptomsSlide;
    let therapiesSlide;
    let drugsSlide;
    let currentDisease;
    let disease;

    if (diseaseType == "virus") {
        if (virusDisease.diseaseName == "") {
            return;
        }
        virusDiseaseName = document.querySelector('.virusDiseaseName');
        symptomsSlide = document.querySelector('.symptomsSlide');
        therapiesSlide = document.querySelector('.therapiesSlide');
        drugsSlide = document.querySelector('.drugsSlide');
        currentDisease = document.querySelector('.currentDisease');
        disease = virusDisease;

    } else if (diseaseType == "chronic") {
        virusDiseaseName = document.querySelector('.chronicDiseaseName');
        symptomsSlide = document.querySelector('.chronicSymptomsSlide');
        therapiesSlide = document.querySelector('.chronicTherapiesSlide');
        drugsSlide = document.querySelector('.chronicDrugsSlide');
        currentDisease = document.getElementById('currentChronicDisease');
        disease = chronicDiseases[chronicDiseases.length - 1];

        let myDiseasesContainer = document.getElementById('myChronicDiseases');
        myDiseasesContainer.style.display = "block";

        setTimeout(() => {
            myDiseasesContainer.style.opacity = "1";
        }, 50);
    } else if (diseaseType == "mental") {
        virusDiseaseName = document.querySelector('.mentalDiseaseName');
        symptomsSlide = document.querySelector('.mentalSymptomsSlide');
        therapiesSlide = document.querySelector('.mentalTherapiesSlide');
        drugsSlide = document.querySelector('.mentalDrugsSlide');
        currentDisease = document.getElementById('currentMentalDisease');
        disease = mentalDiseases[mentalDiseases.length - 1];
    }

    if (disease == undefined) {
        return;
    }

    symptomsSlide.innerHTML = "";
    therapiesSlide.innerHTML = "";
    drugsSlide.innerHTML = "";
    virusDiseaseName.textContent = disease.diseaseName;

    const symptomParagraph = document.createElement('p');
    symptomParagraph.textContent = 'Симптомы:';
    symptomParagraph.style.marginTop = "12px";
    symptomsSlide.appendChild(symptomParagraph);

    for (let i = 0; i < disease.symptoms.length; i++) {
        // Создаем элементы симптомов
        const symptomDiv = document.createElement('div');
        symptomDiv.className = 'entity';
        symptomDiv.textContent = disease.symptoms[i].symptomName;
        symptomDiv.setAttribute('b-3gxarn7yru', '');
        symptomDiv.style.cursor = "pointer";

        if (disease.symptoms[i].symptomSeverities[disease.symptoms[i].symptomSeverities.length - 1].severity == "Easy") {
            symptomDiv.style.backgroundColor = "rgba(100,134,83,0.7)";
        }
        else if (disease.symptoms[i].symptomSeverities[disease.symptoms[i].symptomSeverities.length - 1].severity == "Mid") {
            symptomDiv.style.backgroundColor = "rgba(255, 207, 64, 0.7)";
        }
        else if (disease.symptoms[i].symptomSeverities[disease.symptoms[i].symptomSeverities.length - 1].severity == "Hard") {
            symptomDiv.style.backgroundColor = "rgba(190,75,75,0.7)";
        }
        // Добавляем элементы в контейнер
        symptomsSlide.appendChild(symptomDiv);
        symptomDiv.addEventListener('click', function () {
            symptomClick(symptomDiv, diseaseType);
        });
    }
    const newSymptomButton = document.createElement('button');
    newSymptomButton.classList.add('entity');
    newSymptomButton.classList.add('new');
    newSymptomButton.setAttribute('b-3gxarn7yru', '');
    newSymptomButton.textContent = "Добавить";

    newSymptomButton.onclick = () => {
        newSymptomButtonClick(diseaseType);
    }

    symptomsSlide.appendChild(newSymptomButton);

    const therapyParagraph = document.createElement('p');
    therapyParagraph.textContent = 'Терапии:';
    therapyParagraph.style.marginTop = "12px";
    therapiesSlide.appendChild(therapyParagraph);

    for (let i = 0; i < disease.therapies.length; i++) {
        // Создаем элементы симптомов
        const therapyDiv = document.createElement('div');
        therapyDiv.className = 'entity';
        therapyDiv.textContent = disease.therapies[i];
        therapyDiv.setAttribute('b-3gxarn7yru', '');

        // Добавляем элементы в контейнер
        therapiesSlide.appendChild(therapyDiv);
    }

    const newTherapyButton = document.createElement('button');
    newTherapyButton.classList.add('entity');
    newTherapyButton.classList.add('new');
    newTherapyButton.setAttribute('b-3gxarn7yru', '');
    newTherapyButton.textContent = "Добавить";

    newTherapyButton.onclick = () => {
        const newTherapy = document.createElement('div');
        newTherapy.classList.add('entity');

        const input = document.createElement('input');
        input.type = 'text'; // Устанавливаем тип input
        input.placeholder = 'Новая терапия'; // Устанавливаем текст
        input.classList.add('entityInput');
        input.addEventListener('focus', function () {
            inputClick()
        });
        input.addEventListener('blur', function () {
            therapyName = input.value;
            if (therapyName != "") {
                if (disease.therapies.some(t => t == therapyName)) {
                    alert("Метод лечения с таким именем уже существует.")
                    return;
                }
                input.remove();
                newTherapy.textContent = therapyName;

                let newTherapyFormData = new FormData();
                newTherapyFormData.append("TherapyName", therapyName);
                newTherapyFormData.append("diseaseType", diseaseType);
                if (diseaseType == "chronic" || diseaseType == "mental") {
                    newTherapyFormData.append("diseaseName", disease.diseaseName);
                }
                // Отправка данных на сервер
                fetch('/Main/AddTherapy', {
                    method: 'POST',
                    body: newTherapyFormData
                })
            }
        });
        input.setAttribute('b-3gxarn7yru', '');

        newTherapy.setAttribute('b-3gxarn7yru', '');
        const lastTherapy = therapiesSlide.lastElementChild;
        therapiesSlide.insertBefore(newTherapy, lastTherapy);
        newTherapy.appendChild(input);
    }

    therapiesSlide.appendChild(newTherapyButton);

    const drugParagraph = document.createElement('p');
    drugParagraph.textContent = 'Лекарства:';
    drugParagraph.style.marginTop = "12px";
    drugsSlide.appendChild(drugParagraph);

    for (let i = 0; i < disease.drugs.length; i++) {
        // Создаем элементы симптомов
        const drugDiv = document.createElement('div');
        drugDiv.className = 'entity';
        drugDiv.textContent = disease.drugs[i].drugName;
        drugDiv.setAttribute('b-3gxarn7yru', '');
        drugDiv.style.cursor = "pointer";

        // Добавляем элементы в контейнер
        drugsSlide.appendChild(drugDiv);
        drugDiv.addEventListener('click', function () {
            drugTimeClicked(drugDiv, diseaseType);
        });
    }

    const newDrugButton = document.createElement('button');
    newDrugButton.classList.add('entity');
    newDrugButton.classList.add('new');
    newDrugButton.setAttribute('b-3gxarn7yru', '');
    newDrugButton.textContent = "Добавить";

    newDrugButton.onclick = () => {
        const newDrug = document.createElement('div');
        newDrug.classList.add('entity');
        newDrug.style.cursor = "pointer";

        const input = document.createElement('input');
        input.type = 'text'; // Устанавливаем тип input
        input.placeholder = 'Новое лекарство'; // Устанавливаем текст
        input.classList.add('entityInput');
        input.addEventListener('focus', function () {
            inputClick();
        });
        input.addEventListener('blur', function () {
            drugName = input.value;
            if (input.value != "") {
                if (disease.drugs.some(d => d.drugName == drugName)) {
                    alert("Лекарство с таким именем уже существует.")
                    return;
                }
                input.remove();
                newDrug.textContent = drugName;
                disease.drugs.push(new Drug(drugName, ["05:08"]));

                let newDrugFormData = new FormData();
                newDrugFormData.append("DrugName", drugName);
                newDrugFormData.append("diseaseType", diseaseType);
                if (diseaseType == "chronic" || diseaseType == "mental") {
                    newDrugFormData.append("diseaseName", disease.diseaseName);
                }

                // Отправка данных на сервер
                fetch('/Main/Drug', {
                    method: 'POST',
                    body: newDrugFormData
                })
            }
        });
        input.setAttribute('b-3gxarn7yru', '');

        newDrug.setAttribute('b-3gxarn7yru', '');

        const lastDrug = drugsSlide.lastElementChild;
        drugsSlide.insertBefore(newDrug, lastDrug);
        newDrug.appendChild(input);
        newDrug.addEventListener('click', function () {
            drugTimeClicked(newDrug, diseaseType);
        });
    }

    drugsSlide.appendChild(newDrugButton);

    currentDisease.style.display = "block";

    setTimeout(() => {
        currentDisease.style.opacity = "1";
    }, 700);

    uploadAnalises(diseaseType);
}

function newSymptomButtonClick(diseaseType) {
    let symptomsSlide;
    let newSymptom;
    let disease;
    if (diseaseType == "virus") {
        symptomsSlide = document.querySelector('.symptomsSlide');
        disease = virusDisease;
    } else if (diseaseType == "chronic") {
        symptomsSlide = document.querySelector('.chronicSymptomsSlide');
        disease = chronicDiseases[chronicDiseases.length - 1];
    } else if (diseaseType == "mental") {
        symptomsSlide = document.querySelector('.mentalSymptomsSlide');
        disease = mentalDiseases[mentalDiseases.length - 1];
    }

    newSymptom = document.createElement('div');
    newSymptom.classList.add('entity');
    newSymptom.style.cursor = "pointer";

    const input = document.createElement('input');
    input.type = 'text'; // Устанавливаем тип input
    input.placeholder = 'Новый симптом'; // Устанавливаем текст
    input.classList.add('entityInput');
    input.addEventListener('focus', function () {
        inputClick();
    });
    input.setAttribute('b-3gxarn7yru', '');

    newSymptom.setAttribute('b-3gxarn7yru', '');
    const indexToInsert = symptomsSlide.children.length - 1;
    const referenceElement = symptomsSlide.children[indexToInsert];
    symptomsSlide.insertBefore(newSymptom, referenceElement);

    newSymptom.addEventListener('click', function () {
        symptomClick(newSymptom, diseaseType);
    });

    newSymptom.appendChild(input);

    //Контейнер для типов тяжести
    const severityTypesContainer = document.createElement('div');
    severityTypesContainer.className = 'severityTypesContainer';
    severityTypesContainer.setAttribute('b-3gxarn7yru', '');

    const severities = ['Easy', 'Mid', 'Hard'];
    severities.forEach(severity => {
        const button = document.createElement('button');
        button.className = `severity ${severity}Severity`;
        button.setAttribute('b-3gxarn7yru', '');
        if (severity == "Easy") {
            button.textContent = "Легко";
        } else if (severity == "Mid") {
            button.textContent = "Средне";
        } else {
            button.textContent = "Сильно";
        }

        button.onclick = () => {
            let symptomName = input.value;
            if (symptomName == "" || disease.symptoms.some(s => s.symptomName == symptomName)) {
                alert("Симптом с таким именем уже существует.")
                return;
            }
            const container = button.parentNode;

            const symptomSeverities = [];
            symptomSeverities.push(new SymptomSeverity("0", getCurrentDate()));
            let symptom = new Symtom(symptomName, symptomSeverities)
            disease.symptoms.push(symptom);
            
            severityTypesContainer.style.opacity = "0";
            input.style.opacity = "0";

            setTimeout(() => {
                severityTypesContainer.style.height = "0";
                severityTypesContainer.style.margin = "0";
                if (severity == "Easy") {
                    newSymptom.style.background = "rgba(100,134,83,0.7)";
                    symptom.symptomSeverities[0].severity = severity;
                }
                else if (severity == "Mid") {
                    newSymptom.style.background = "rgba(255, 207, 64, 0.7)";
                    symptom.symptomSeverities[0].severity = severity;
                }
                else {
                    newSymptom.style.background = "rgba(190,75,75,0.7)";
                    symptom.symptomSeverities[0].severity = severity;
                }
            }, 250);

            setTimeout(() => {
                container.remove();
                input.remove();
                newSymptom.textContent = symptomName;
            }, 650);

            let newSymptomFormData = new FormData();

            if (diseaseType == "chronic" || diseaseType == "mental") {
                newSymptomFormData.append("diseaseName", disease.diseaseName);
            }
            newSymptomFormData.append("diseaseType", diseaseType);
            newSymptomFormData.append("symptomName", symptomName);
            newSymptomFormData.append("newSymptomSeverity", severity);

            // Отправка данных на сервер
            fetch('/Main/AddSymptom', {
                method: 'POST',
                body: newSymptomFormData
            })
        };

        severityTypesContainer.appendChild(button);
    });

    symptomsSlide.insertBefore(severityTypesContainer, referenceElement);
}

let currentSymptomName = "";

function symptomClick(newSymptom, diseaseType) {
    if (newSymptom.textContent == "") {
        return;
    }
    let disease;
    if (diseaseType == "virus") {
        disease = virusDisease;
    } else if (diseaseType == "chronic") {
        disease = chronicDiseases[chronicDiseases.length - 1];
    } else if (diseaseType == "mental") {
        disease = mentalDiseases[mentalDiseases.length - 1];
    }
    let element = document.querySelector('.container');
    if (element != undefined) {
        element.remove();
        if (newSymptom.textContent == currentSymptomName) {
            return;
        }
    }

    const severityColors = {
        "Easy": 'rgba(100,134,83,0.7)',
        "Mid": 'rgba(255, 207, 64, 0.7)',
        "Hard": 'rgba(190,75,75,0.7)'
    };

    const container = document.createElement('div');
    container.className = 'container';
    container.setAttribute('b-3gxarn7yru', '');
    // Находим индекс элемента
    const index = Array.from(newSymptom.parentNode.children).indexOf(newSymptom) - 1;

    let currentSymptom = disease.symptoms[index];

    currentSymptomName = newSymptom.textContent;
    const severityTypesContainer = document.createElement('div');
    severityTypesContainer.className = 'severityTypesContainer';
    severityTypesContainer.setAttribute('b-3gxarn7yru', '');

    const severities = ['Easy', 'Mid', 'Hard'];
    severities.forEach(severity => {
        const button = document.createElement('button');
        button.className = `severity ${severity}Severity`;
        button.setAttribute('b-3gxarn7yru', '');
        if (severity == "Easy") {
            button.textContent = "Легко";
        } else if (severity == "Mid") {
            button.textContent = "Средне";
        } else {
            button.textContent = "Сильно";
        }

        button.onclick = () => {
            if (severity == "Easy") {
                newSymptom.style.background = "rgba(100,134,83,0.7)";
            }
            else if (severity == "Mid") {
                newSymptom.style.background = "rgba(255, 207, 64, 0.7)";
            }
            else {
                newSymptom.style.background = "rgba(190,75,75,0.7)";
            }

            let lastSeverity = currentSymptom.symptomSeverities[currentSymptom.symptomSeverities.length - 1];

            if (lastSeverity.severity != severity) {
                const chart = Chart.getChart('symptomChart');

                let symptomSeverityFormData = new FormData();
                symptomSeverityFormData.append("symptomName", currentSymptom.symptomName);
                symptomSeverityFormData.append("diseaseType", diseaseType);

                if (diseaseType == "chronic" || diseaseType == "mental") {
                    symptomSeverityFormData.append("diseaseName", disease.diseaseName);
                }

                if (lastSeverity.date == getCurrentDate()) {
                    symptomSeverityFormData.append("symptomSeverity", lastSeverity.severity);
                    symptomSeverityFormData.append("updateSymptomSeverity", severity);
                    lastSeverity.severity = severity;

                    chart.data.datasets[0].pointBackgroundColor[currentSymptom.symptomSeverities.length - 1] = severityColors[severity];
                    updateData(chart, ["Easy", "Mid", "Hard"].indexOf(severity), currentSymptom.symptomSeverities.length - 1);
                }
                else {
                    symptomSeverityFormData.append("symptomSeverity", severity);
                    let symptomSeverity = new SymptomSeverity(severity, getCurrentDate());
                    currentSymptom.symptomSeverities.push(symptomSeverity);

                    addData(chart, symptomSeverity.date, ["Easy", "Mid", "Hard"].indexOf(severity));
                    chart.data.datasets[0].pointBackgroundColor.push(severityColors[severity]);
                    chart.update();
                }

                // Отправка данных на сервер
                fetch('/Main/CUSymptomSeverities', {
                    method: 'POST',
                    body: symptomSeverityFormData
                })
            }

        };
        severityTypesContainer.appendChild(button);
    });
    container.appendChild(severityTypesContainer);

    //График
    const symptomStatisticContainer = document.createElement('div');
    symptomStatisticContainer.className = 'symptomStatisticContainer';
    symptomStatisticContainer.setAttribute('b-3gxarn7yru', '');
    // Создаем элемент canvas
    const canvas = document.createElement('canvas');
    canvas.setAttribute('b-3gxarn7yru', '');
    canvas.id = 'symptomChart'; // Устанавливаем id для canvas

    // Добавляем canvas в контейнер
    symptomStatisticContainer.appendChild(canvas);

    container.appendChild(symptomStatisticContainer);
    const parent = newSymptom.parentNode;
    parent.insertBefore(container, newSymptom.nextSibling);

    // Получаем даты и тяжести из текущего симптома
    const labels = currentSymptom.symptomSeverities.map(severity => severity.date);
    const dataPoints = currentSymptom.symptomSeverities.map(severity => {
        return {
            y: ["Easy", "Mid", "Hard"].indexOf(severity.severity), // Преобразуем текст в числовое значение
            color: severityColors[severity.severity] // Получаем цвет для тяжести
        };
    });

    // Инициализируем график после добавления canvas в DOM
    const ctx = canvas.getContext('2d');

    const symptomChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels, // Даты по оси X
            datasets: [{
                data: dataPoints.map(point => point.y), // Числовые значения по оси Y
                borderWidth: 1,
                borderColor: 'rgba(96, 96, 96, 0.5)',
                fill: false, // Не заполняем область под графиком
                pointBackgroundColor: dataPoints.map(point => point.color), // Устанавливаем цвета точек
                pointRadius: 4
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // Включаем отображение легенды
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return ["Легко", "Средне", "Сильно"][value]; // Возвращаем текстовые значения для оси Y
                        }
                    }
                },
                x: {
                    display: true // Отображаем подписи оси X
                }
            }
        }
    });
}

let currentDrugTime = "";
let oldDrugTime = "";

function drugTimeClicked(drugDiv, diseaseType) {
    let disease;
    if (diseaseType == "virus") {
        disease = virusDisease;
    } else if (diseaseType == 'chronic') {
        disease = chronicDiseases[chronicDiseases.length - 1];
    } else if (diseaseType == 'mental') {
        disease = mentalDiseases[mentalDiseases.length - 1];
    }
    if (drugDiv.textContent != "") {
        let element = document.querySelector('.drugTimeContainer');
        if (element != undefined) {
            element.remove();
            if (drugDiv.textContent == currentDrugTime) {
                return;
            }
        }
        const drugTimeContainer = document.createElement('div');
        drugTimeContainer.className = 'drugTimeContainer';

        const newParagraph = document.createElement('p');
        newParagraph.setAttribute('b-3gxarn7yru', '');
        newParagraph.textContent = 'Укажите время приёма лекарства:';
        newParagraph.style.margin = "0";
        newParagraph.style.marginBottom = "-10px";
        drugTimeContainer.appendChild(newParagraph);

        let currentDrug = disease.drugs.find(item => item.drugName == drugDiv.textContent);

        for (let i = 0; i < currentDrug.drugTimes.length; i++) {
            const drugTimeInputContainer = document.createElement('div');
            drugTimeInputContainer.className = 'drugTimeInputContainer';
            drugTimeInputContainer.setAttribute('b-3gxarn7yru', '');
            drugTimeContainer.appendChild(drugTimeInputContainer);

            // Создаем элемент с input типа time
            const entityDiv = document.createElement('div');
            entityDiv.setAttribute('b-3gxarn7yru', '');
            entityDiv.className = 'entity drugTime';

            const input = document.createElement('input');
            input.setAttribute('b-3gxarn7yru', '');
            input.type = 'time';
            input.className = 'drugTimeInput';
            input.value = currentDrug.drugTimes[i];

            const removeButton = document.createElement('button');
            removeButton.setAttribute('b-3gxarn7yru', '');
            removeButton.className = 'entity remove';
            removeButton.textContent = 'X';

            input.addEventListener('click', function () {
                oldDrugTime = input.value;

            });
            input.addEventListener('change', function () {
                const index = currentDrug.drugTimes.findIndex(drugTime => drugTime == oldDrugTime);
                currentDrug.drugTimes[index] = input.value;

                let updateDrugTimeFormData = new FormData();
                updateDrugTimeFormData.append("drugName", drugDiv.textContent);
                updateDrugTimeFormData.append("drugTime", oldDrugTime);
                updateDrugTimeFormData.append("updateDrugTime", input.value);
                updateDrugTimeFormData.append("diseaseType", diseaseType);

                if (diseaseType == "chronic" || diseaseType == "mental") {
                    updateDrugTimeFormData.append("diseaseName", disease.diseaseName);
                }

                fetch('/Main/CUDDrugTime', {
                    method: 'POST',
                    body: updateDrugTimeFormData
                })
            });
            entityDiv.appendChild(input);

            drugTimeInputContainer.appendChild(entityDiv);
            drugTimeInputContainer.appendChild(removeButton);
            removeButton.addEventListener('click', function () {
                const index = currentDrug.drugTimes.findIndex(drugTime => drugTime == input.value);
                if (index !== -1) {
                    currentDrug.drugTimes.splice(index, 1);
                }

                let removeDrugTimeFormData = new FormData();
                removeDrugTimeFormData.append("drugName", drugDiv.textContent);
                removeDrugTimeFormData.append("drugTime", input.value);
                removeDrugTimeFormData.append("diseaseType", diseaseType);

                if (diseaseType == "chronic" || diseaseType == "mental") {
                    removeDrugTimeFormData.append("diseaseName", disease.diseaseName);
                }

                fetch('/Main/CUDDrugTime', {
                    method: 'POST',
                    body: removeDrugTimeFormData
                })
                drugTimeInputContainer.remove();
            });
        }

        const drugTimeButtonsContainer = document.createElement('div');
        drugTimeButtonsContainer.className = 'drugTimeButtonsContainer';
        drugTimeButtonsContainer.setAttribute('b-3gxarn7yru', '');
        drugTimeContainer.appendChild(drugTimeButtonsContainer);


        // Создаем кнопку "Дополнить"
        const addButton = document.createElement('button');
        addButton.setAttribute('b-3gxarn7yru', '');
        addButton.className = 'entity add';
        addButton.textContent = 'Дополнить';

        // Добавляем кнопки в контейнер
        drugTimeButtonsContainer.appendChild(addButton);
        addButton.addEventListener('click', function () {
            if (currentDrug.drugTimes.indexOf("05:08") == -1) {
                const drugTimeInputContainer = document.createElement('div');
                drugTimeInputContainer.className = 'drugTimeInputContainer';
                drugTimeInputContainer.setAttribute('b-3gxarn7yru', '');

                const newDrugTime = document.createElement('div');
                newDrugTime.setAttribute('b-3gxarn7yru', '');
                newDrugTime.className = 'entity drugTime';

                const input = document.createElement('input');
                input.setAttribute('b-3gxarn7yru', '');
                input.type = 'time';
                input.className = 'drugTimeInput';
                input.value = '05:08'; // Значение по умолчанию

                input.addEventListener('click', function () {
                    oldDrugTime = input.value;

                });
                input.addEventListener('change', function () {
                    const index = currentDrug.drugTimes.findIndex(drugTime => drugTime == oldDrugTime);
                    currentDrug.drugTimes[index] = input.value;

                    let updateDrugTimeFormData = new FormData();
                    updateDrugTimeFormData.append("drugName", drugDiv.textContent);
                    updateDrugTimeFormData.append("drugTime", oldDrugTime);
                    updateDrugTimeFormData.append("updateDrugTime", input.value);
                    updateDrugTimeFormData.append("diseaseType", diseaseType);

                    if (diseaseType == "chronic" || diseaseType == "mental") {
                        updateDrugTimeFormData.append("diseaseName", disease.diseaseName);
                    }

                    fetch('/Main/CUDDrugTime', {
                        method: 'POST',
                        body: updateDrugTimeFormData
                    })
                });

                newDrugTime.appendChild(input);

                const removeButton = document.createElement('button');
                removeButton.setAttribute('b-3gxarn7yru', '');
                removeButton.className = 'entity remove';
                removeButton.textContent = 'X';

                drugTimeInputContainer.appendChild(newDrugTime);
                drugTimeInputContainer.appendChild(removeButton);

                drugTimeButtonsContainer.insertAdjacentElement('beforebegin', drugTimeInputContainer);

                removeButton.addEventListener('click', function () {
                    let removeDrugTimeFormData = new FormData();
                    removeDrugTimeFormData.append("drugName", drugDiv.textContent);
                    removeDrugTimeFormData.append("drugTime", input.value);
                    removeDrugTimeFormData.append("diseaseType", diseaseType);

                    if (diseaseType == "chronic" || diseaseType == "mental" ) {
                        removeDrugTimeFormData.append("diseaseName", disease.diseaseName);
                    }
                    const index = currentDrug.drugTimes.findIndex(drugTime => drugTime == input.value);
                    if (index !== -1) {
                        currentDrug.drugTimes.splice(index, 1);
                    }

                    fetch('/Main/CUDDrugTime', {
                        method: 'POST',
                        body: removeDrugTimeFormData
                    })
                    drugTimeInputContainer.remove();
                });

                let newDrugTimeFormData = new FormData();
                newDrugTimeFormData.append("drugName", drugDiv.textContent);
                newDrugTimeFormData.append("drugTime", input.value);
                newDrugTimeFormData.append("diseaseType", diseaseType);
                if (diseaseType == "chronic" || diseaseType == "mental") {
                    newDrugTimeFormData.append("diseaseName", disease.diseaseName);
                }
                currentDrug.drugTimes.push("05:08");


                // Отправка данных на сервер
                fetch('/Main/CUDDrugTime', {
                    method: 'POST',
                    body: newDrugTimeFormData
                })
            }
            else {
                alert("Невозможно добавить такое же время. Обновите уже существующее.");
            }
        });

        const saveButton = document.createElement('button');
        saveButton.className = 'entity ok'; // Добавляем классы
        saveButton.setAttribute('b-3gxarn7yru', '');
        saveButton.textContent = 'ОК'; // Устанавливаем текст кнопки

        saveButton.addEventListener('click', function () {
            document.querySelector('.drugTimeContainer').remove();
        });

        drugTimeButtonsContainer.appendChild(saveButton);

        // Добавляем новый контейнер в основной контейнер на странице
        drugDiv.insertAdjacentElement('afterend', drugTimeContainer);
        currentDrugTime = drugDiv.textContent;
    }
}

let isMyChronicDiseasesOpen = false; 
let isMyMentalDiseasesOpen = false; 
function showMyDiseases(diseaseType) {
    let diseases;
    let myDiseasesContainer;
    if (diseaseType == "chronic") {
        diseases = chronicDiseases;
        myDiseasesContainer = document.getElementById('myChronicDiseasesContainer');
        if (isMyChronicDiseasesOpen) {
            myDiseasesContainer.innerHTML = "";
            isMyChronicDiseasesOpen = false;
            myDiseasesContainer.style.marginBottom = "0";
            return;
        } else {
            isMyChronicDiseasesOpen = true;
        }
    } else if (diseaseType == "mental") {
        diseases = mentalDiseases;
        myDiseasesContainer = document.getElementById('myMentalDiseasesContainer');
        if (isMyMentalDiseasesOpen) {
            myDiseasesContainer.innerHTML = "";
            isMyMentalDiseasesOpen = false;
            myDiseasesContainer.style.marginBottom = "0";
            return;
        }
        else {
            isMyMentalDiseasesOpen = true;
        }
    }

    myDiseasesContainer.style.marginBottom = "40px";

    diseases.forEach(d => {
        const symptomDiv = document.createElement('div');
        symptomDiv.className = 'entity';
        symptomDiv.textContent = d.diseaseName;
        symptomDiv.setAttribute('b-3gxarn7yru', '');
        symptomDiv.style.cursor = "pointer";

        symptomDiv.onclick = () => {
            elementIndex = diseases.indexOf(d);
            swapWithLastElement(diseases, elementIndex);
            if (diseaseType == "chronic") {
                diseaseRestart("chronic");
                diseaseUpload("chronic");
            }
            else {
                diseaseRestart("mental");
                diseaseUpload("mental");
            }
        };


        myDiseasesContainer.appendChild(symptomDiv);
    });
}

function swapWithLastElement(arr, index) {
    if (index < 0 || index >= arr.length) {
        return;
    }

    if (arr.length <= 1) {
        return;
    }

    const lastIndex = arr.length - 1;

    [arr[index], arr[lastIndex]] = [arr[lastIndex], arr[index]];
}

function showAnaliseTypes(diseaseType) {
    let myAnaliseContainer;
    if (diseaseType == "virus") {
        myAnaliseContainer = document.getElementById('myVirusAnaliseContainer')
    } else if (diseaseType == "chronic") {
        myAnaliseContainer = document.getElementById('myChronicAnaliseContainer')
    } else if (diseaseType == "mental") {
        myAnaliseContainer = document.getElementById('myMentalAnaliseContainer')
    }

    myAnaliseContainer.innerHTML = "";

    let analiseTypes = ["Анализ крови", "Анализ мочи"];
    analiseTypes.forEach(at => {
        const analiseType = document.createElement('button');
        analiseType.classList.add('entity');
        analiseType.setAttribute('b-3gxarn7yru', '');
        analiseType.textContent = at;
        analiseType.onclick = () => {
            if (at == "Анализ крови") {
                startBloodAnalise(myAnaliseContainer, diseaseType);
            } else if (at == "Анализ мочи") {
                startUrineAnalise(myAnaliseContainer, diseaseType);
            }
        }

        myAnaliseContainer.appendChild(analiseType);
    });
}

let currentAnaliseAddStage = "start";

function startBloodAnalise(myAnaliseContainer, diseaseType) {
    myAnaliseContainer.innerHTML = "";
    myAnaliseContainer.appendChild(createAnaliseWriter("Эритроциты(RBC):", myAnaliseContainer, "blood", diseaseType));
}

function startUrineAnalise(myAnaliseContainer, diseaseType) {
    myAnaliseContainer.innerHTML = "";
    myAnaliseContainer.appendChild(createAnaliseWriter("Кислотность среды(ph):", myAnaliseContainer, "urine", diseaseType));
}

function createAnaliseWriter(paragraphText, myAnaliseContainer, analiseType, diseaseType) {
    const analiseWriterDiv = document.createElement('div');
    analiseWriterDiv.setAttribute('b-3gxarn7yru', '');
    analiseWriterDiv.className = 'analiseWriter';

    // Create the paragraph element
    const paragraph = document.createElement('p');
    paragraph.setAttribute('b-3gxarn7yru', '');
    paragraph.textContent = paragraphText;

    // Create the buttons container div
    const buttonsDiv = document.createElement('div');
    buttonsDiv.setAttribute('b-3gxarn7yru', '');
    buttonsDiv.className = 'analiseWriterButtons';

    // Create the input element
    const input = document.createElement('input');
    input.setAttribute('b-3gxarn7yru', '');
    input.className = 'diseasesWriterInput';
    input.type = 'text';
    input.setAttribute('onfocus', 'inputClick()');

    // Create the button element
    const button = document.createElement('button');
    button.setAttribute('b-3gxarn7yru', '');
    button.className = 'analiseWriterNext';
    button.style.marginBottom = "10px";
    button.style.height = "40px";
    button.textContent = 'ОК';
    button.onclick = () => {
        if (analiseType == "blood") {
            bloodAnaliseWriterNext(myAnaliseContainer, diseaseType);
        } else if(analiseType == "urine"){
            urineAnaliseWriterNext(myAnaliseContainer, diseaseType);
        }
    }

    // Append elements to the buttons container
    buttonsDiv.appendChild(input);
    buttonsDiv.appendChild(button);

    // Append paragraph and buttons container to the main div
    analiseWriterDiv.appendChild(paragraph);
    analiseWriterDiv.appendChild(buttonsDiv);

    return analiseWriterDiv;
}

function bloodAnaliseWriterNext(myAnaliseContainer, diseaseType) {
    let disease;
    if (diseaseType == "virus") {
        disease = virusDisease;
    } else if (diseaseType == "chronic") {
        disease = chronicDiseases[chronicDiseases.length - 1];
    } else if (diseaseType == "mental") {
        disease = mentalDiseases[mentalDiseases.length - 1];
    }

    let input = myAnaliseContainer.querySelector('input');
    if (input.value == "") {
        alert("Для начала введите значение параметра.");
        return;
    }
    bloodAnaliseParameters.push(parseFloat(input.value, 10));
    if (currentAnaliseAddStage == "start") {
        currentAnaliseAddStage = "HGB";
        myAnaliseContainer.innerHTML = "";
        myAnaliseContainer.appendChild(createAnaliseWriter("Гемоглобин(HGB):", myAnaliseContainer, "blood", diseaseType));
    } else if (currentAnaliseAddStage == "HGB") {
        currentAnaliseAddStage = "WBC";
        myAnaliseContainer.innerHTML = "";
        myAnaliseContainer.appendChild(createAnaliseWriter("Лейкоциты(WBC):", myAnaliseContainer, "blood", diseaseType));
    } else if (currentAnaliseAddStage == "WBC") {
        currentAnaliseAddStage = "ЦП";
        myAnaliseContainer.innerHTML = "";
        myAnaliseContainer.appendChild(createAnaliseWriter("Цветовой показатель(ЦП):", myAnaliseContainer, "blood", diseaseType));
    } else if (currentAnaliseAddStage == "ЦП") {
        currentAnaliseAddStage = "HCT";
        myAnaliseContainer.innerHTML = "";
        myAnaliseContainer.appendChild(createAnaliseWriter("Гематокрит(HCT):", myAnaliseContainer, "blood", diseaseType));
    } else if (currentAnaliseAddStage == "HCT") {
        currentAnaliseAddStage = "RET";
        myAnaliseContainer.innerHTML = "";
        myAnaliseContainer.appendChild(createAnaliseWriter("Ретикулоциты(RET):", myAnaliseContainer, "blood", diseaseType));
    } else if (currentAnaliseAddStage == "RET") {
        currentAnaliseAddStage = "PLT";
        myAnaliseContainer.innerHTML = "";
        myAnaliseContainer.appendChild(createAnaliseWriter("Тромбоциты(PLT):", myAnaliseContainer, "blood", diseaseType));
    } else if (currentAnaliseAddStage == "PLT") {
        currentAnaliseAddStage = "ESR";
        myAnaliseContainer.innerHTML = "";
        myAnaliseContainer.appendChild(createAnaliseWriter("Скорость оседания эритроцитов(ESR):", myAnaliseContainer, "blood", diseaseType));
    } else if (currentAnaliseAddStage == "ESR") {
        currentAnaliseAddStage = "start";
        myAnaliseContainer.innerHTML = "";

        let newBloodAnalise  = new FormData();
        newBloodAnalise.append("diseaseType", diseaseType);

        if (diseaseType == "chronic" || diseaseType == "mental") {
            newBloodAnalise.append("diseaseName", disease.diseaseName);
        }        

        if (disease.bloodAnalises.length == 0) {
            disease.bloodAnalises.push(new Analise(bloodAnaliseParameters));
            newBloodAnalise.append("bloodAnaliseParameters", JSON.stringify(bloodAnaliseParameters));

        } else {
            if (disease.bloodAnalises[disease.bloodAnalises.length - 1].data == getCurrentDate()) {
                disease.bloodAnalises[disease.bloodAnalises.length - 1] = new Analise(bloodAnaliseParameters);
                newBloodAnalise.append("updatebloodAnaliseParameters", JSON.stringify(bloodAnaliseParameters));
            } else {
                disease.bloodAnalises.push(new Analise(bloodAnaliseParameters));
                newBloodAnalise.append("bloodAnaliseParameters", JSON.stringify(bloodAnaliseParameters));
            }
        }

        fetch('/Main/CUBloodAnalise', {
            method: 'POST',
            body: newBloodAnalise
        })

        bloodAnaliseParameters.length = 0;

        uploadAnalises(diseaseType);
    }
}

function urineAnaliseWriterNext(myAnaliseContainer, diseaseType) {
    let disease;
    if (diseaseType == "virus") {
        disease = virusDisease;
    } else if (diseaseType == "chronic") {
        disease = chronicDiseases[chronicDiseases.length - 1];
    } else if (diseaseType == "mental") {
        disease = mentalDiseases[mentalDiseases.length - 1];
    }

    let input = myAnaliseContainer.querySelector('input');
    if (input.value == "") {
        alert("Для начала введите значение параметра.");
        return;
    }
    urineAnaliseParameters.push(parseFloat(input.value, 10));
    if (currentAnaliseAddStage == "start") {
        currentAnaliseAddStage = "ОП";
        myAnaliseContainer.innerHTML = "";
        myAnaliseContainer.appendChild(createAnaliseWriter("Относительная плотность:", myAnaliseContainer, "urine", diseaseType));
    } else if (currentAnaliseAddStage == "ОП") {
        currentAnaliseAddStage = "PRO";
        myAnaliseContainer.innerHTML = "";
        myAnaliseContainer.appendChild(createAnaliseWriter("Белок(PRO):", myAnaliseContainer, "urine", diseaseType));
    } else if (currentAnaliseAddStage == "PRO") {
        currentAnaliseAddStage = "GLU";
        myAnaliseContainer.innerHTML = "";
        myAnaliseContainer.appendChild(createAnaliseWriter("Глюкоза(GLU):", myAnaliseContainer, "urine", diseaseType));
    } else if (currentAnaliseAddStage == "GLU") {
        currentAnaliseAddStage = "BIL";
        myAnaliseContainer.innerHTML = "";
        myAnaliseContainer.appendChild(createAnaliseWriter("Билирубин(BIL):", myAnaliseContainer, "urine", diseaseType));
    } else if (currentAnaliseAddStage == "BIL") {
        currentAnaliseAddStage = "UBG";
        myAnaliseContainer.innerHTML = "";
        myAnaliseContainer.appendChild(createAnaliseWriter("Уробилиноген(UBG):", myAnaliseContainer, "urine", diseaseType));
    } else if (currentAnaliseAddStage == "UBG") {
        currentAnaliseAddStage = "KET";
        myAnaliseContainer.innerHTML = "";
        myAnaliseContainer.appendChild(createAnaliseWriter("Кетоновые тела(KET):", myAnaliseContainer, "urine", diseaseType));
    } else if (currentAnaliseAddStage == "KET") {
        currentAnaliseAddStage = "GEM";
        myAnaliseContainer.innerHTML = "";
        myAnaliseContainer.appendChild(createAnaliseWriter("Гемоглобин:", myAnaliseContainer, "urine", diseaseType));
    } else if (currentAnaliseAddStage == "GEM") {
        currentAnaliseAddStage = "ER";
        myAnaliseContainer.innerHTML = "";
        myAnaliseContainer.appendChild(createAnaliseWriter("Эритроциты:", myAnaliseContainer, "urine", diseaseType));
    } else if (currentAnaliseAddStage == "ER") {
        currentAnaliseAddStage = "LE";
        myAnaliseContainer.innerHTML = "";
        myAnaliseContainer.appendChild(createAnaliseWriter("Лейкоциты:", myAnaliseContainer, "urine", diseaseType));
    } else if (currentAnaliseAddStage == "LE") {
        currentAnaliseAddStage = "EC";
        myAnaliseContainer.innerHTML = "";
        myAnaliseContainer.appendChild(createAnaliseWriter("Эпителиальные клетки:", myAnaliseContainer, "urine", diseaseType));
    } else if (currentAnaliseAddStage == "EC") {
        currentAnaliseAddStage = "BACT";
        myAnaliseContainer.innerHTML = "";
        myAnaliseContainer.appendChild(createAnaliseWriter("Бактерии:", myAnaliseContainer, "urine", diseaseType));
    } else if (currentAnaliseAddStage == "BACT") {
        currentAnaliseAddStage = "start";

        let newUrineAnalise = new FormData();
        newUrineAnalise.append("diseaseType", diseaseType);

        if (diseaseType == "chronic" || diseaseType == "mental") {
            newUrineAnalise.append("diseaseName", disease.diseaseName);
        }  

        if (disease.urineAnalises.length == 0) {
            disease.urineAnalises.push(new Analise(urineAnaliseParameters));
            newUrineAnalise.append("urineAnaliseParameters", JSON.stringify(urineAnaliseParameters));
        } else {
            if (disease.urineAnalises[disease.urineAnalises.length - 1].data == getCurrentDate()) {
                disease.urineAnalises[disease.urineAnalises.length - 1] = new Analise(urineAnaliseParameters);
                newUrineAnalise.append("updateUrineAnaliseParameters", JSON.stringify(urineAnaliseParameters));
            } else {
                disease.urineAnalises.push(new Analise(urineAnaliseParameters));
                newUrineAnalise.append("urineAnaliseParameters", JSON.stringify(urineAnaliseParameters));
            }
        }

        fetch('/Main/CUUrineAnalise', {
            method: 'POST',
            body: newUrineAnalise
        })

        urineAnaliseParameters.length = 0;

        uploadAnalises(diseaseType);
    }
}

let currentAnalise;
let bloodAnaliseLabels = ["Эритроциты: ", "Гемоглобин: ", "Лейкоциты: ", "Цветовой показатель: ", "Гематокрит ", "Ретикулоциты: ", "Тромбоциты: ", "Скорость оседания эритроцитов: "];
let bloodAnaliseNorm = [[4.4, 5], [130, 160], [4, 9], [0.8, 1], [39, 49], [0.2, 1.2], [180, 320], [1, 10]];

currentAnaliseParameter = "";
function bloodAnaliseClick(analise, button) {
    let element = document.querySelector('.analiseContainer');
    if (element != undefined) {
        element.remove();
        if (currentAnalise == analise) {
            return;
        }
    }

    const containerDiv = document.createElement('div');
    containerDiv.classList.add('analiseContainer');

    insertAfter(containerDiv, button);

    currentAnalise = analise;
    for (let i = 0; i < bloodAnaliseLabels.length; i++) {
        const selectedAnaliseDiv = document.createElement('div');
        selectedAnaliseDiv.classList.add('entity');
        selectedAnaliseDiv.style.marginLeft = "30px";
        selectedAnaliseDiv.style.width = "calc(100% - 60px)";
        selectedAnaliseDiv.style.height = "auto";
        selectedAnaliseDiv.style.minHeight = "45px";
        if (analise.analiseParameters[i] < bloodAnaliseNorm[i][0] || analise.analiseParameters[i] > bloodAnaliseNorm[i][1]) {
            selectedAnaliseDiv.style.background = "rgba(190,75,75,0.75)";
        }
        selectedAnaliseDiv.textContent = bloodAnaliseLabels[i] + analise.analiseParameters[i];
        selectedAnaliseDiv.setAttribute('b-3gxarn7yru', '');
        containerDiv.appendChild(selectedAnaliseDiv);

        selectedAnaliseDiv.addEventListener('click', () => {
            let element = document.querySelector('.analiseNorm');
            if (element != undefined) {
                element.remove();
                if (currentAnaliseParameter == selectedAnaliseDiv.textContent) {
                    return;
                }
            }
            currentAnaliseParameter = selectedAnaliseDiv.textContent;
            const selectedAnaliseNorm = document.createElement('div');
            selectedAnaliseNorm.classList.add('entity');
            selectedAnaliseNorm.classList.add('analiseNorm');
            selectedAnaliseNorm.setAttribute('b-3gxarn7yru', '');
            selectedAnaliseNorm.style.marginLeft = "40px";
            selectedAnaliseNorm.textContent = "Норма: от " + bloodAnaliseNorm[i][0] + " до " + bloodAnaliseNorm[i][1];
            selectedAnaliseNorm.style.width = "calc(100% - 80px)";
            insertAfter(selectedAnaliseNorm, selectedAnaliseDiv);
        });
    }
}
let urineAnaliseLabels = ["Кислотность среды: ", "Относительная плотность: ", "Белок: ", "Глюкоза: ", "Билирубин ", "Уробилиноген: ", "Кетоновые тела: ", "Гемоглобин: ", "Эритроциты: ", "Лейкоциты: ", "Эпителиальные клетки: ", "Бактерии: "];
let urineAnaliseNorm = [[5, 7], [1.01, 1.025], [0, 0.033], [0, 1], [0, 8.5], [0, 34], [0, 0.5], [0, 0], [0, 2], [0, 5], [3, 5], [0,0]];
function urineAnaliseClick(analise, button) {
    let element = document.querySelector('.analiseContainer');
    if (element != undefined) {
        element.remove();
        if (currentAnalise == analise) {
            return;
        }
    }

    const containerDiv = document.createElement('div');
    containerDiv.classList.add('analiseContainer');

    insertAfter(containerDiv, button);

    currentAnalise = analise;
    for (let i = 0; i < urineAnaliseLabels.length; i++) {
        const selectedAnaliseDiv = document.createElement('div');
        selectedAnaliseDiv.classList.add('entity');
        selectedAnaliseDiv.style.marginLeft = "30px";
        selectedAnaliseDiv.style.width = "calc(100% - 60px)";
        selectedAnaliseDiv.style.height = "auto";
        selectedAnaliseDiv.style.minHeight = "45px";
        if (analise.analiseParameters[i] < urineAnaliseNorm[i][0] || analise.analiseParameters[i] > urineAnaliseNorm[i][1]) {
            selectedAnaliseDiv.style.background = "rgba(190,75,75,0.75)";
        }
        selectedAnaliseDiv.textContent = urineAnaliseLabels[i] + analise.analiseParameters[i];
        selectedAnaliseDiv.setAttribute('b-3gxarn7yru', '');
        containerDiv.appendChild(selectedAnaliseDiv);

        selectedAnaliseDiv.addEventListener('click', () => {
            let element = document.querySelector('.analiseNorm');
            if (element != undefined) {
                element.remove();
                if (currentAnaliseParameter == selectedAnaliseDiv.textContent) {
                    return;
                }
            }
            currentAnaliseParameter = selectedAnaliseDiv.textContent;
            const selectedAnaliseNorm = document.createElement('div');
            selectedAnaliseNorm.classList.add('entity');
            selectedAnaliseNorm.classList.add('analiseNorm');
            selectedAnaliseNorm.setAttribute('b-3gxarn7yru', '');
            selectedAnaliseNorm.style.marginLeft = "40px";
            if (urineAnaliseNorm[i][0] == 0 && urineAnaliseNorm[i][1] == 0) {
                selectedAnaliseNorm.textContent = "В норме отсутствует";
            } else if (urineAnaliseNorm[i][0] == 0) {
                selectedAnaliseNorm.textContent = "Норма: до " + urineAnaliseNorm[i][1];
            } else {
                selectedAnaliseNorm.textContent = "Норма: от " + urineAnaliseNorm[i][0] + " до " + urineAnaliseNorm[i][1];
            }
            selectedAnaliseNorm.style.width = "calc(100% - 80px)";
            insertAfter(selectedAnaliseNorm, selectedAnaliseDiv);
        });
    }
}

function uploadAnalises(diseaseType) {
    let myAnaliseContainer;
    let bloodAnalises;
    let urineAnalises;
    if (diseaseType == "virus") {
        myAnaliseContainer = document.getElementById('myVirusAnaliseContainer');
        bloodAnalises = virusDisease.bloodAnalises;
        urineAnalises = virusDisease.urineAnalises;
    } else if (diseaseType == "chronic") {
        myAnaliseContainer = document.getElementById('myChronicAnaliseContainer');
        bloodAnalises = chronicDiseases[chronicDiseases.length - 1].bloodAnalises;
        urineAnalises = chronicDiseases[chronicDiseases.length - 1].urineAnalises;
    } else if (diseaseType == "mental") {
        myAnaliseContainer = document.getElementById('myMentalAnaliseContainer');
        bloodAnalises = mentalDiseases[mentalDiseases.length - 1].bloodAnalises;
        urineAnalises = mentalDiseases[mentalDiseases.length - 1].urineAnalises;
    }

    myAnaliseContainer.innerHTML = "";
    if (Array.isArray(bloodAnalises)) {
        bloodAnalises.forEach(ba => {
            const bloodAnalise = document.createElement('button');
            bloodAnalise.classList.add('entity');
            bloodAnalise.setAttribute('b-3gxarn7yru', '');
            bloodAnalise.style.height = "auto";
            bloodAnalise.style.minHeight = "45px";
            bloodAnalise.textContent = "Анализ крови от " + ba.data;
            myAnaliseContainer.appendChild(bloodAnalise);

            bloodAnalise.addEventListener('click', () => {
                bloodAnaliseClick(ba, bloodAnalise);
            });
        });
    }
    
    if (Array.isArray(urineAnalises)) {
        urineAnalises.forEach(ua => {
            const urineAnalise = document.createElement('button');
            urineAnalise.classList.add('entity');
            urineAnalise.setAttribute('b-3gxarn7yru', '');
            urineAnalise.style.height = "auto";
            urineAnalise.style.minHeight = "45px";
            urineAnalise.textContent = "Анализ мочи от " + ua.data;
            myAnaliseContainer.appendChild(urineAnalise);

            urineAnalise.addEventListener('click', () => {
                urineAnaliseClick(ua, urineAnalise);
            });
        });
    }

    const newAnaliseButton = document.createElement('button');
    newAnaliseButton.classList.add('entity');
    newAnaliseButton.classList.add('new');
    newAnaliseButton.setAttribute('b-3gxarn7yru', '');
    newAnaliseButton.textContent = "Добавить";
    newAnaliseButton.onclick = () => {
        showAnaliseTypes(diseaseType);
    }
    myAnaliseContainer.appendChild(newAnaliseButton);
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}