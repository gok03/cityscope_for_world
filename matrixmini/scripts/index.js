//fixes Uncaught ReferenceError: regeneratorRuntime is not defined
import "babel-polyfill";
import { info } from "./RADAR/ui";
import { radarInit, radarUpdate } from "./RADAR/radarSetup";
import * as cityIOdemo from "./cityio_demo.json";

var cityscope_server = "http://cityscope.gok03.com";

// global vars for fun
let tableName = "test";

let cityIOtableURL =
  cityscope_server+"/api/table/" + tableName.toString();

if (window.location.search) {
  console.log(window.location.search);
  cityIOtableURL =
    cityscope_server+"/api/table/" +
    window.location.search.substr(1);
}
console.log(cityIOtableURL);

//update interval
let interval = 2000;

async function init() {
  info();
  //init the radar
  let radarChartObj = radarInit();
  //send a bare-bone radar to update function
  cityIOupdater(radarChartObj);
}

////////////////////////////////////////////////////////////////////

/**
 * updates the radar on interval
 * @param initalCityIOdata the results of the init call to cityIO.
 */

function cityIOupdater(radarChartObj) {
  let cityIOdata;
  //loop cityIO update recursively
  setInterval(updateCityIO, interval);
  //update grid if cityIO new data arrives
  async function updateCityIO() {
    //get the data through promise
    cityIOdata = await getCityIO(cityIOtableURL);

    // update to radar
    radarUpdate(cityIOdata, radarChartObj, interval);
  }
}

////////////////////////////////////////////////////////////////////
/**
 * get cityIO method [uses ES6 polyfill]
 * @param cityIOtableURL cityIO API endpoint URL
 */

export function getCityIO(cityIOtableURL) {
  // return cityIOdemo;
  // console.log("trying to fetch " + cityIOtableURL);
  return fetch(cityIOtableURL)
    .then(function(response) {
      return response.json();
    })
    .then(function(cityIOdata) {
      // console.log("got cityIO table at " + cityIOdata.meta.timestamp);
      return cityIOdata;
    });
}

////////////////////////////////////////////////////////////////////

//start the app
init();
