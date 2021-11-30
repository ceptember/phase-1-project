let zipcode = '10004'

let urlGeo = `https://geocoding-api.open-meteo.com/v1/search?name=${zipcode}`
let urlWSB = 'https://dashboard.nbshare.io/api/v1/apps/reddit'; 
let urlNews = 'https://inshortsapi.vercel.app/news?category=world';
let urlCrypto = 'https://api.coincap.io/v2/assets'

let lat = ""
let long = ""
let timezone =""
let currentWeather = ""

//COVID data
let usState = 'New%20Jersey' 
let covidURL = `https://disease.sh/v3/covid-19/nyt/states/${usState}?lastdays=8`
let newCases = [];  
let datesForCases = []; 

//for footer
let photoLinks = {
    rain: '<a href="https://unsplash.com/@maxwbender?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" target="_blank">Max Bender</a> on <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" target="_blank">Unsplash</a>',
    cloudy: '<a href="https://unsplash.com/@davehoefler?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" target="_blank">Dave Hoefler</a> on <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" target="_blank">Unsplash</a>',
    clear: '<a href="https://unsplash.com/@phd?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" target="_blank">Peter Hulce</a> on <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" target="_blank">Unsplash</a>',
    snow: '<a href="https://unsplash.com/@gloriacretu?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" target="_blank">Gloria Cretu</a> on <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" target="_blank">Unsplash</a>',
}

function handleNews(){
    fetch(urlNews)
    .then(response => response.json())
    .then(data => {            
        for (i = 0; i < 3; i++){
            let firstSentence = data.data[i].content.split(".")[0];
            let li = document.createElement('li');
            li.innerHTML = `${firstSentence}. <a href="${data.data[i].readMoreUrl}" target="_blank">Read More</a> `; 
            document.querySelector('#news .list').appendChild(li);
        } 
    })
}

function handleCrypto(){
    fetch(urlCrypto)
    .then(response => response.json())
    .then(data => {
                    
        for (item of data.data){
            if (item.symbol == 'BTC' || item.symbol == 'ETH'|| item.symbol == 'DOGE'){
            let li = document.createElement('li');
            let price = Number.parseFloat(item.priceUsd).toFixed(2);
            li.textContent = `${item.symbol}: ${price} USD`;
            document.querySelector('#crypto .list').appendChild(li);
            }
        } 
    })
}

//handleGeo is the first step in the location-based functions. 
//It then calls the callback defined in the Weather or Covid function
function handleGeo(callback){
    urlGeo = `https://geocoding-api.open-meteo.com/v1/search?name=${zipcode}`;
    fetch (urlGeo)
    .then(response => response.json())
    .then(data => {
        let city = data.results[0].name; 
        lat = Number.parseFloat(data.results[0].latitude).toFixed(2);
        long = Number.parseFloat(data.results[0].longitude).toFixed(2);
        timezone = data.results[0].timezone; 
        usState = data.results[0].admin1; 
        callback(); 
})
}

// lat and long in the API URL come from the handleGeo function that calls the weather callback 
function handleWeather(){
    function cb(){
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=${timezone}`)
            .then(resp => resp.json())
            .then(weatherData => {
                //get weather 
                let weathercodesNowTodayTomorrow = [weatherData.current_weather.weathercode, weatherData.daily.weathercode[0], weatherData.daily.weathercode[1]]
                let nowTodayTomorrow = []; 
                for (x of weathercodesNowTodayTomorrow){
                    if ([0, 1, 2].includes(x)){
                        nowTodayTomorrow.push('clear'); 
                    }
                    else if ([3, 45, 48].includes(x)){
                        nowTodayTomorrow.push('cloudy'); 
                    }
                    else if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(x)){
                        nowTodayTomorrow.push('rain'); 
                    }
                    else if ([71, 73, 75, 77, 85, 86].includes(x)){
                        nowTodayTomorrow.push('snow'); 
                    }
                }
                currentWeather = nowTodayTomorrow[0]; 
             
                document.querySelector('body').setAttribute("style",`background-image: url(./img/${currentWeather}.jpg)`)
                
                document.getElementById('photocredit').innerHTML = `Background photo by ${photoLinks[currentWeather]}`

                weatherholder.innerHTML = `
                Showing data for zip code ${zipcode} 
                <br>
                <br>Current Temperature is ${weatherData.current_weather.temperature}F
                <br> ${nowTodayTomorrow[0]} right now, and ${nowTodayTomorrow[1]} the rest of the day
                <br>
                <br> Today's high: ${weatherData.daily.temperature_2m_max[0]}F;
                 Today's low: ${weatherData.daily.temperature_2m_min[0]}F
                 <br>
                <br> Tomorrow's weather: ${nowTodayTomorrow[2]} ${weatherData.daily.temperature_2m_max[1]}F/${weatherData.daily.temperature_2m_min[1]}F`  

            })
        }
        handleGeo(cb);
    }

// US State in the API URL comes from the handleGeo function that calls the COVID callback     
function handleCovid(){
    function cb(){
        covidURL = `https://disease.sh/v3/covid-19/nyt/states/${usState}?lastdays=8`
        newCases = []; 
        datesForCases = []; 
        fetch(covidURL)
        .then(response => response.json())
        .then(data => {
            document.getElementById('covidText').textContent = `Total COVID cases for ${usState}: ${data[7].cases}`; 
            document.querySelector('#covid .list').innerHTML ="";
            
            let covidArray = []
            for (let item of data){
                covidArray.push(item.cases);
            }
           
            for (let i=1; i < covidArray.length; i++){
                newCases.push(covidArray[i] - covidArray[i-1]);
                datesForCases.push(data[i].date)
            }
           
            drawChart();    
        })
    }
    handleGeo(cb);
}

function changeZip(event){
    event.preventDefault(); 
    zipcode = document.getElementById('zipcode').value.replace( /[^0-9]/g , " "); 
    document.getElementById('zipcode').value = ""; 
    document.getElementById('locationtext').textContent = `Showing data for ${zipcode}. Enter a new zip code to change location.`
   handleWeather(); 
   handleCovid();
}

//When the DOM loads, call the functions for each section 
function handleData (){
    document.getElementById('locationtext').textContent = `Showing data for ${zipcode}. Enter a new zip code to change location.`
    handleCovid(); 
    handleNews(); 
    handleCrypto(); 
    handleWeather(); 
    loadToDo(); 
}

function addListItem(event){
    // Get the user-supplied text and prevent the page from refreshing 
    event.preventDefault(); 
    let itemText = document.querySelector('#newtodo').value.replace( /[^0-9a-zA-Z\s]/g , " ");
    document.querySelector('#newtodo').value = ""; 
    // Object to send to the server 
    let fetchObj = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
        body: JSON.stringify({item: itemText}) 
    }; 

    // Rendering the user-supplied text in the DOM before sending to the server
    // This way I can have a working demo of the frontend without a backend
    
    let li = document.createElement('li'); 
    let xButton = document.createElement("button")
    xButton.textContent = "X"
    xButton.addEventListener('click', (e) => { e.target.parentElement.remove()})
    li.textContent = itemText ;
    li.appendChild(xButton)
    document.querySelector('#todo ul').appendChild(li);
    
    fetch('http://localhost:3000/todo', fetchObj)
        .then(() => {
                // If the server is running, I want the items to have the automatically generated IDs, so I'm running loadToDo again 
                loadToDo();
        })
}

//Load To-Do list from the backend, if available  
function loadToDo(){

    fetch('http://localhost:3000/todo')
        .then(resp => resp.json())
        .then(data => {
             document.getElementById("offline").textContent = "";  //remove the "running in offline mode" message if the server call succeeds 
            document.querySelector('#todo ul').innerHTML = ""; 
            for (let x of data){            
            let li = document.createElement('li'); 
            li.innerHTML = ` ${x.item} <button id=${x.id}>X</button> `;
            document.querySelector('#todo ul').appendChild(li);
            document.getElementById(x.id).addEventListener('click', (e) => {
                e.target.parentElement.remove();
                fetch(`http://localhost:3000/todo/${x.id}`, {method: 'DELETE'})
            })
        }
        })
}

// DRAW THE SVG FOR THE COVID RATES CHART
function drawChart(){
    document.getElementById('chartdiv').innerHTML = ""; 

    let chartTestData = newCases; 
    let xValues = datesForCases.map( x => x.split("-")[1] + "/" + x.split("-")[2] ); 

    //set the dimensions
    let width= 230; 
    let height= 150;
    let margins= 35;
    let rightMargin = 10;

    let svg = d3.select('#chartdiv')
                .append('svg')
                .attr("width", width + margins + rightMargin)
                .attr("height", height + margins + margins)
                .attr("style", "border: 1px solid black")
                .attr("style", "background-color: white")

    // X Axis
    let xscale = d3.scaleBand()
                    .domain(xValues)
                    .range([0, width]);

    let x_axis = d3.axisBottom()
                    .scale(xscale)
                    
    svg.append("g")
        .attr("transform", `translate(${margins}, ${margins+height})`)
        .call(x_axis);

    // Y Axis
    let yscale = d3.scaleLinear()
                    .domain([0, Math.max(...chartTestData)])
                    .range([height, 0])
   
    let y_axis = d3.axisLeft()
                    .scale(yscale)

    svg.append("g")
        .attr("transform", `translate(${margins}, ${margins})`)
        .call(y_axis);

    //Draw bars 
    chartTestData.forEach( (element, index) => {
        //console.log(element + " -> " + (height - yscale(element))); //this is how you get 10%
        let g = svg.append("g")   
        let barWidth = 20; 
        g.append("rect")
    // .data(chartTestData)
        .attr("x", (index * (width/chartTestData.length) + (width/chartTestData.length)/2 - barWidth/2) )  
        .attr("y", ( yscale(element) )  ) //top of bar 
        .attr("height",  height - yscale(element)) 
        .attr("width", barWidth)
        .attr("stroke",  "#B3C79D")
        .attr("fill",  "#D1D59F")
        .attr("transform", `translate(${margins}, ${margins})`)

        g.append("text")
        .attr("x", (index * (width/chartTestData.length) + (width/chartTestData.length)/2 - barWidth/2) ) 
        .attr("y", ( yscale(element) )  )
        .attr("fill", "#5C5B81")
       // .attr()
        .text(element)
        .attr("transform", `translate(${margins}, ${margins})`)
    })

}

document.addEventListener('DOMContentLoaded', handleData); 
document.getElementById('changelocation').addEventListener('submit', changeZip)
document.getElementById('todoform').addEventListener('submit', addListItem)
//There is also a 'click' handler added when each to-do item is created


