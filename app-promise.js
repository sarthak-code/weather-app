const yargs = require('yargs');
const axios = require('axios');

const argv = yargs
.option({
	a:{
		demand:true,
		alias:"address",
		describe:"Address of the place where weather is to be found"
	}
})
.help()
.alias('help','h')
.argv;

var encodedaddress = encodeURIComponent(argv.address);
var geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedaddress}`;

axios.get(geocodeURL).then((response)=>{
	if(response.data.status === "ZERO_RESULTS"){
		throw new Error("Unable to find the address") 
	}

	var lat = response.data.results[0].geometry.location.lat;
	var lng = response.data.results[0].geometry.location.lng;
	var weatherURL = `https://api.darksky.net/forecast/88fb9204025adc2c95c8c21d99a5d65a/${lat},${lng}`;
	console.log(response.data.results[0].formatted_address);

	return axios.get(weatherURL);
}).then((response)=>{
	var temp = response.data.currently.temperature;
	var appTemp = response.data.currently.apparentTemperature;

	console.log(`Its currently ${temp} ,and it feels like ${appTemp}`)
}).catch((e)=>{
	if(e.code === "ENOTFOUND"){
		console.log("Unable to connect to API server");
	}
	else{
		console.log(e.message);
	}
});




