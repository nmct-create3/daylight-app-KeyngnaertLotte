const rerunEveryMinute = 60 * 1000

// _ = helper functions
function _parseMillisecondsIntoReadableTime(timestamp) {
	//Get hours from milliseconds
	const date = new Date(timestamp * 1000);
	// Hours part from the timestamp
	const hours = '0' + date.getHours();
	// Minutes part from the timestamp
	const minutes = '0' + date.getMinutes();
	// Seconds part from the timestamp (gebruiken we nu niet)
	// const seconds = '0' + date.getSeconds();

	// Will display time in 10:30(:23) format
	return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}

function getCurrentTimeInMinutes(){
	const now = new Date
	const currentHour = (now.getHours()) * 60
	const currentMinutes = now.getMinutes()
	const currentTime = currentHour + currentMinutes
	return currentTime
}

function getCurrentTime(){
	const now = new Date
	const currentHour = now.getHours()
	const currentMinutes = now.getMinutes()
	var currentTime = `${currentHour}:${currentMinutes}`
	if (currentMinutes < 10){
		currentTime = `${currentHour}:0${currentMinutes}`
	}
	if (currentHour < 10){
		currentTime = `0${currentHour}:${currentMinutes}`
	}
	return currentTime
}

// 5 TODO: maak updateSun functie
let updateSun = function(){
	getAPI(50.8027841, 3.2097454);
}

// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
let placeSunAndStartMoving = (totalMinutes, sunrise) => {
	// In de functie moeten we eerst wat zaken ophalen en berekenen.
	// Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag.
	// Bepaal het aantal minuten dat de zon al op is.
	// Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.
	// We voegen ook de 'is-loaded' class toe aan de body-tag.
	// Vergeet niet om het resterende aantal minuten in te vullen.
	// Nu maken we een functie die de zon elke minuut zal updaten
	// Bekijk of de zon niet nog onder of reeds onder is
	// Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
	// PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.

	console.log(`totalmin en sunrise ${totalMinutes} ${sunrise}`)
	const currentTime = getCurrentTimeInMinutes()
	const sunUp = currentTime - getMinutes(sunrise)
	console.log(`aantal tijd zon op: ${sunUp}`)
	
	const left = totalMinutes - sunUp


	const procentLeft = 100 / totalMinutes * sunUp
	var procentBottom = 0
	if (left > (totalMinutes / 2)){
		procentBottom = 100 - ((100 / (totalMinutes / 2) * left) - 100)
		document.querySelector('.is-day').classList.remove('is-night')
	}
	if (left <= (totalMinutes / 2)){
		procentBottom = 100 / (totalMinutes / 2) * left
		document.querySelector('.is-day').classList.remove('is-night')
	}
	if (procentBottom < 0){
		procentBottom = 0
		document.querySelector('.is-day').classList.add('is-night')
	}

	console.log(procentLeft, procentBottom)
	const time = getCurrentTime()

	
	document.querySelector('body').classList.add('is-loaded');

	document.querySelector('.js-sun').style = `bottom: ${procentBottom}%; left: ${procentLeft}%`
	document.querySelector('.js-sun').setAttribute('data-time', time)
	document.querySelector('.js-time-left').innerHTML = `${left}`

	const loop = setInterval(function(){
		updateSun()
	}, rerunEveryMinute)

	
};

// 3 Met de data van de API kunnen we de app opvullen
let showResult = queryResponse => {
	console.log(queryResponse)
	// We gaan eerst een paar onderdelen opvullen
	const locationCity = queryResponse.city.name
	const locationCountry = queryResponse.city.country

	const sunrise = _parseMillisecondsIntoReadableTime(queryResponse.city.sunrise)
	const sunset = _parseMillisecondsIntoReadableTime(queryResponse.city.sunset)

	
	console.log(sunrise, sunset)

	// Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
	document.querySelector('.js-location').innerHTML = `${locationCity}, ${locationCountry}`

	// Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
	document.querySelector('.js-sunrise').innerHTML = `${sunrise}`
	document.querySelector('.js-sunset').innerHTML = `${sunset}`

	// Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
	// Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.
	const timeBetween = getMinutes(_parseMillisecondsIntoReadableTime(queryResponse.city.sunset)) - getMinutes(_parseMillisecondsIntoReadableTime(queryResponse.city.sunrise))
	const timeSunrise = _parseMillisecondsIntoReadableTime(queryResponse.city.sunrise)

	placeSunAndStartMoving(timeBetween, timeSunrise)
};

const getMinutes = function(time){
	const HtoM = (time.substring(0, time.indexOf(':'))) * 60
	const min = parseInt(time.substring(time.indexOf(':') + 1))
	const total = HtoM + min
	return total
}

const getData =  (endpoint) => {
	return  fetch(endpoint)
		.then((r) => r.json())
		.catch((e) => console.error(e))
}

const getEndpoint = function(lat, lon){
	return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=4699da861878b53fc921ab151b3fddf9&units=metric&lang=nl&cnt=1`
}


// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
let getAPI = async (lat, lon) => {
	const data = await getData(getEndpoint(lat, lon))
	//console.log(data)
	showResult(data)
	// Eerst bouwen we onze url op
	// Met de fetch API proberen we de data op te halen.
	// Als dat gelukt is, gaan we naar onze showResult functie.
};

document.addEventListener('DOMContentLoaded', function() {
	// 1 We will query the API with longitude and latitude.
	getAPI(50.8027841, 3.2097454);
});
