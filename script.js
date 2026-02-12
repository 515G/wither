const API_KEY = "6b7edc82798b727dce5282c19e9298a6";

const btn = document.getElementById("btn");
btn.addEventListener("click", getWeather);

async function getWeather(){
    const cityInput = document.getElementById("city").value.trim();
    const error = document.getElementById("error");
    const card = document.getElementById("card");

    error.textContent = "";
    card.style.display = "none";

    if(!cityInput){
        error.textContent = "اكتب اسم المدينة";
        return;
    }

    // ترميز الاسم العربي
    const city = encodeURIComponent(cityInput);

    try{
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ar`
        );

        const data = await res.json();

        if(data.cod !== 200){
            error.textContent = "المدينة غير موجودة";
            return;
        }

        document.getElementById("cityName").textContent =
            data.name + " - " + data.sys.country;

        document.getElementById("temp").textContent =
            Math.round(data.main.temp) + "°C";

        document.getElementById("desc").textContent =
            data.weather[0].description;

        document.getElementById("wind").textContent =
            data.wind.speed + " م/ث";

        document.getElementById("humidity").textContent =
            data.main.humidity + "%";

        card.style.display = "block";

    }catch{
        error.textContent = "مشكلة اتصال بالإنترنت";
    }
}
