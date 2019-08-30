/*
/////////////////////////////////////////////////////////////////////////////////////////////////////////

{{ CityScopeJS }}
Copyright (C) {{ 2018 }}  {{ Ariel Noyman }}

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

/////////////////////////////////////////////////////////////////////////////////////////////////////////

CityScopeJS -- decoding 2d array of black and white LEGO bricks, parsing and sending to remote server.
"@context": "https://github.com/CityScope/", "@type": "Person", "address": {
"@type": "75 Amherst St, Cambridge, MA 02139", "addressLocality":
"Cambridge", "addressRegion": "MA",}, 
"jobTitle": "Research Scientist", "name": "Ariel Noyman",
"alumniOf": "MIT", "url": "http://arielnoyman.com", 
"http://twitter.com/relno",
https://github.com/RELNO]

///////////////////////////////////////////////////////////////////////////////////////////////////////
*/

import "babel-polyfill";
import {
  setupSVG,
  stats,
  loadImg,
  loadSettings,
  initSequence,
  setupWebcam,
  updateInfoDIV,
  makeInfoDIV,
  cityIOinit,
  cityIOstop
} from "./Modules";
import { datGUI } from "./UI/DATGUI";
import * as logo from "../media/logo.png";

//Import Storage class
import "./Storage";

async function init() {
  /* 
   let refreshInterval = 100000;
  //set refresh for page to cleanup
  setTimeout(function() {
    window.location.reload(1);
  }, refreshInterval);
  updateInfoDIV(
    "<--- restarting in " + refreshInterval / 1000 + " Seconds ---->"
  );
  */

  //create the info div
  makeInfoDIV();
  updateInfoDIV("Starting CityScopeJS applet...");
  //make the stats applet
  stats();
  //UI menu
  datGUI();
  //load CS logo
  loadImg(logo.default, 60, 60, "logo");
  //setup and start webcam
  setupWebcam();
  //make the UI
  setupSVG();

  // [WIP] POST to cityIO rate in MS
  var sendRate = 1000;
  //make sure to clear CityIO sending before
  cityIOstop();
  updateInfoDIV("starting cityIO");
  //start sending to cityIO
  cityIOinit(sendRate);

  //after that, check if cityIOdataStruct is already loaded before
  //so we can skip the JSON file selection UI
  if (loadSettings("CityScopeJS_cityIOdataStruct")) {
    Storage.cityIOdataStruct = loadSettings("CityScopeJS_cityIOdataStruct");
    // start app sequence
    initSequence();
  }

  Storage.old_pixel_Col_Array = [];
}

//start app after HTML load
window.onload = function() {
  init();
};
