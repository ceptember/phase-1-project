MY DASHBOARD is a Single Page Application written in HTML, CSS, and JavaScript, which asynchronously accesses and displays data from several public APIs. Its purpose is to organize all the information the user would want on one webpage page for them to glance at and digest when they start up their computer for the day. It was built as an individual project for Flatiron School’s Software Engineering program. 

The data sources are as follows:
https://open-meteo.com/en/docs/geocoding-api Geocoding
https://docs.coincap.io/ Crypto Rates 
https://github.com/cyberboysumanjay/Inshorts-News-API News 
https://open-meteo.com/en/docs Weather
https://disease.sh COVID Rates

The geolocation API returns the latitude, longitude, and state from a user-supplied U.S. zip code. MY DASHBOARD then passes this geographic data to the weather and COVID APIs to provide the user with their local information. 

The center portion of the screen is a to-do list, where the user can add and delete their own text. When used with a local development server, the app is fully functional and the data persists to a mock API. When used without this, the interactivity is still functional, and the DOM correctly updates when the user submits a new item, but it will not persist.  

The HTTP requests are sent to the APIs via the JavaScript’s fetch() method, which sends an HTTP ‘GET’ request  to the API’s URL and returns a body of JSON data. Fetch() is also used in the to-do list feature of the page, with the ‘POST’ and ‘DELETE’ methods that add and remove items from the list. 

The page uses Bootstrap’s CSS classes to reorganize the layout on screens smaller than 768px wide (such as phones). At that size, the boxes displaying data are stacked vertically in a single column as opposed to the three columns seen on larger screens. 

It also uses the JavaScript library D3 to make a bar chart that displays the COVID rates. MY DASHBOARD fetches the total COVID cases from the API, then calculates the number of new cases per day, and displays the number of new cases for each of the last seven days on a bar chart. 

For simplicity, this app takes the groups the 28 possible weather codes returned by the weather API into four broad categories (clear, cloudy, rain, and snow). 

In summary, this page uses five public API, plus one custom API for managing the to-do list. The four event listeners fetch the required data when the page loads, when the user submits the zip code or to-do list form, and when the user clicks the delete button on a list item. Text submitted via the forms is sanitized using a regular expression to remove non-alphanumeric characters. Fetch() is used several times to communicate with API servers, mostly to ‘GET’ data but also to ‘POST’ and ‘DELETE’ list items. The to-do list persists data on a local development machine using a mock server; however, the front-end is still functional without this. Finally, after each fetch() the DOM is updated to show the data and/or change the image without refreshing the page.  
