
const wrapper = document.querySelector('.wrapper'),
    inputPart = wrapper.querySelector('.input-part'),
    infotext = inputPart.querySelector('.info-txt'),
    inputField = inputPart.querySelector('input'),
    locationBtn = inputPart.querySelector('button'),

    weatherIcon = document.querySelector('.weather-part img'),
    rowBack = wrapper.querySelector('header i');

const APIkey = `ac43ef6c228f5f7450555830ce9fec70`;

let api;

inputField.addEventListener('keyup', e => {
    if (e.key === 'Enter' && inputField.value !== '') {
        requesAPI(inputField.value);
    };
});
locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuscces, onError);
    } else {
        alert('You Browser not Suport geolocation API');
    };
});
const onSuscces = (position) => {
    const { latitude, longitude } = position.coords;

    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${APIkey}`;

    fechData(api);
};

const onError = error => {
    infotext.textContent = error.message;
    infotext.classList.add('error')
};

const requesAPI = (city) => fechData(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIkey}`);

const fechData = async (api) => {
    infotext.textContent = 'Gettin weather Details..';
    infotext.classList.add('pending')
    try {
        const response = await fetch(api);
        if (response.ok) {
            const result = await response.json();

            const { name, sys: { country } } = result;
            const { description, id } = result.weather[0];
            const { feels_like, humidity, temp } = result.main;

            renderDetails(name, country, description, id, feels_like, humidity, temp);

        } else {
            if (response.status === 404) {
                infotext.classList.replace('pending', 'error')
                infotext.textContent = 'Nombre de cidudad invalido'
            }
        }
    } catch (err) {
        console.log(err);
    };
};

const renderDetails = (name, country, description, id, feels_like, humidity, temp) => {
    infotext.classList.remove('pending', 'error');
    wrapper.classList.add('active');



    wrapper.querySelector('.temp .numb').textContent = Math.floor(temp);
    wrapper.querySelector('.weather').textContent = description;
    wrapper.querySelector('.location span').textContent = `${name}, ${country}`;
    wrapper.querySelector('.temp .numb-2').textContent = Math.floor(feels_like);
    wrapper.querySelector('.humidity span').textContent = `${humidity} %`;

    if (id == 800) {
        weatherIcon.src = "icons/clear.svg";
    } else if (id >= 200 && id <= 232) {
        weatherIcon.src = "icon/storm.svg";
    } else if (id >= 600 && id <= 622) {
        weatherIcon.src = "icon/snow.svg";
    } else if (id >= 701 && id <= 781) {
        weatherIcon.src = "icon/haze.svg";
    } else if (id >= 801 && id <= 804) {
        weatherIcon.src = "icon/cloud.svg";
    } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
        weatherIcon.src = "icon/rain.svg";
    }
};

rowBack.addEventListener('click', () => {
    wrapper.classList.remove('active');
});