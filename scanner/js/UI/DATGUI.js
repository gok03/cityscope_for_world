import * as dat from "dat.gui";
import { onFileLoad, updateInfoDIV, cityIOinit, cityIOstop } from "../Modules";
import { renderGrid } from "./RenderGrid";
import "../Storage";

/**
 * makes datGUI interface
 * @param {void}
 * @return {void}
 */

var cityscope_server = "http://cityscope.gok03.com";

export function datGUI() {
  // dat.GUI
  var gui = new dat.GUI({ width: 300 });
  let parm = {
    global_boolean: true,
    getJson: function() {
      let fileClick = document.getElementById("my_file");
      fileClick.click();
      //do somthing with the file
      fileClick.onchange = function(e) {
        onFileLoad(e);
      };
    },
    sendRate: 1000,
    //test on cityIO
    fe: function() {
      window.open(cityscope_server, "_blank");
    },
    rawCityIO: function() {
      var cityIOdataStruct = Storage.cityIOdataStruct;

      window.open(
        cityscope_server+"/api/table/" +
          cityIOdataStruct.header.name,
        "_blank"
      );
    },
    reset: function() {
      //clear local memory of last key stone
      localStorage.clear();
      updateInfoDIV("clearing and reseting");
      location.reload(true);
    }
  };

  //upload settings
  gui.add(parm, "getJson").name("Start here: Load settings [JSON]");

  //or reset and restart
  gui.add(parm, "reset").name("Reset and clear Keystone");

  //toggle global_boolean on camera
  gui
    .add(parm, "global_boolean")
    .name("Toggle Grid Render")
    .onChange(function(state) {
      renderGrid(state);
    });

  //toggle global_boolean on camera
  gui
    .add(parm, "global_boolean")
    .name("Toggle Webcam Video")
    .onChange(function(state) {
      if (!state) {
        Storage.camCanvas.style.display = "none";
      } else {
        Storage.camCanvas.style.display = "block";
      }
    });

  //add folder
  var cityioFolder = gui.addFolder("cityIO");

  //cityio send rate
  cityioFolder
    .add(parm, "sendRate", 250, 2000)
    .step(250)
    .name("cityIO send [ms]")
    .onChange(function(result) {
      cityIOstop();
      cityIOinit(result);
    });

  //cityIO link
  cityioFolder.add(parm, "rawCityIO").name("View raw API");

  //cityIO link
  cityioFolder.add(parm, "fe").name("View on cityIO Dashboard");
}
