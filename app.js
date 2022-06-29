const express = require("express");
const app = express();
const https = require("https");
const bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
  res.sendFile(`${__dirname}/index.html`)
});

app.post("/", function(req, res){

  const query = req.body.cityName;
  const units = "metric";
  const apiKey = "405fba29edc92c132cd2af80b399b3f8";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${query}&units=${units}&appid=${apiKey}`;

  https.get(url, function(response){
    console.log(response.statusCode);

    response.on("data", function(data){
      const weatherData = JSON.parse(data);
      const description = weatherData.list[0].weather[0].description;
      const temp = weatherData.list[0].main.temp;

      res.write(`<h1>The temperature in ${query} is ${temp}C</h1>`)
      res.write(`<p>The weather is ${description}</p>`)

      const icon = weatherData.list[0].weather[0].icon;
      const imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
      res.write(`<img src=${imageURL}>`)
      res.send();
    })
  });

})



app.listen(3000, function() {
  console.log("server running on port 3000");
});
