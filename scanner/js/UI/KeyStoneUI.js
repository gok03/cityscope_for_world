import "../Storage";
import {
  saveSettings,
  loadSettings,
  svgCircle,
  updateInfoDIV
} from "../Modules";
import { MatrixTransform } from "../CV/MatrixTransform";

//initial keystone using mouse
export function keystoneMouse() {
  var camCanvas = Storage.camCanvas;
  document.body.style.cursor = "crosshair";
  updateInfoDIV(
    "Key-stone in this order: TOP-LEFT [⬉] TOP-RIGHT [⬈] BOTTOM-LEFT  [⬋]  BOTTOM-RIGHT [⬊]"
  );
  //
  var svgKeystone = window.svgKeystone;
  //clear clicks array
  let clkArr = [];

  //collect 4 mouse clicks as corners of keystone
  document.addEventListener("click", mouseKeystone);

  // react to mouse events
  function mouseKeystone(e) {
    // only collect clicks that are in the canvas area
    if (e.x < camCanvas.width && e.y < camCanvas.height) {
      //pop. array of clicks
      clkArr.push(e.x, e.y);
      updateInfoDIV(
        "Mouse click " + clkArr.length / 2 + " at " + e.x + ", " + e.y
      );
      //show points with svg
      svgKeystone.appendChild(
        svgCircle([e.x, e.y], "none", 10, 0, "magenta", "1")
      );

      // when 2x4 clicks were added
      if (clkArr.length == 8) {
        //save these settings for next load
        saveSettings("CityScopeJS_keystone", clkArr);

        //call the matrix transform function
        MatrixTransform(loadSettings("CityScopeJS_keystone"));
        // and stop keystone mouse clicks
        document.removeEventListener("click", mouseKeystone);
        keystoneKeys();
        document.body.style.cursor = "auto";
      }
    }
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
export function keystoneKeys() {
  window.addEventListener("keydown", function(event) {
    const key = event.key;
    var keystone = loadSettings("CityScopeJS_keystone");
    keystoneUsingKeys(key, keystone);
  });

  let kyStArrPos = 0;
  //set the edit speed
  let velocity = 1;

  // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
  function keystoneUsingKeys(key, keystone) {
    switch (key) {
      case "=":
        velocity += 1;
        updateInfoDIV(
          "edit speed " + velocity.toString() + " pixels at the time"
        );
        break;

      case "-":
        if (velocity > 1) velocity -= 1;
        updateInfoDIV(
          "edit speed " + velocity.toString() + " pixels at the time"
        );
        break;

      case "1":
      case "2":
      case "3":
      case "4":
        //gets the x pos of each pair of pnts
        kyStArrPos = (key - 1) * 2;
        break;

      case "ArrowLeft":
        keystone[kyStArrPos] = keystone[kyStArrPos] - velocity;
        saveSettings("CityScopeJS_keystone", keystone);
        MatrixTransform(keystone);
        break;

      case "ArrowRight":
        keystone[kyStArrPos] = keystone[kyStArrPos] + velocity;
        saveSettings("CityScopeJS_keystone", keystone);
        MatrixTransform(keystone);
        break;

      case "ArrowUp":
        keystone[kyStArrPos + 1] = keystone[kyStArrPos + 1] - velocity;
        saveSettings("CityScopeJS_keystone", keystone);
        MatrixTransform(keystone);
        // Up pressed
        break;

      case "ArrowDown":
        // Down pressed
        keystone[kyStArrPos + 1] = keystone[kyStArrPos + 1] + velocity;
        saveSettings("CityScopeJS_keystone", keystone);
        MatrixTransform(keystone);
        break;
    }
  }
}
