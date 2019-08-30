import { updateInfoDIV } from "../Modules";

// HOW TO RUN?
if (cityIOdataStruct.objects.sliders) {
  SliderPicker([100, 100, 200, 200], cityIOdataStruct.objects.sliders);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
let pts = [400, 500, 600, 200];
// SliderPicker(pts, 5);
updateInfoDIV(cityIOdataStruct);

function SliderPicker(sliderPts, numScanPts) {
  let sliderPntsArr = [];
  let sliderColArr = [];
  let sliderPtsSvgHolder = [];
  let sliderLen;
  let accumLen = 0;
  updateInfoDIV("Starting slider scanner");

  //get the segment len
  sliderLen = divideSliderVector(sliderPts);

  for (let i = 0; i <= numScanPts; i++) {
    let thisPt = ptOnVector(
      sliderPts[0],
      sliderPts[1],
      sliderPts[2],
      sliderPts[3],
      accumLen
    );
    sliderPntsArr.push(thisPt);

    let vizPt = svgCircle(thisPt, "rgba(1, 1, 1, 0)", 5, 1, "black", 1);
    sliderPtsSvgHolder.push(vizPt);
    svgKeystone.appendChild(vizPt);
    //add to len
    accumLen = sliderLen * i;
  }

  //returns a point on slider vector
  function ptOnVector(x1, y1, x2, y2, len) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    var theta = Math.atan2(dy, dx);
    var xp = len * Math.cos(theta);
    var yp = len * Math.sin(theta);
    return [xp + x1, yp + y1];
  }

  //find length of slider and divide by #pts
  function divideSliderVector(sliderPts) {
    var a = sliderPts[0] - sliderPts[2];
    var b = sliderPts[1] - sliderPts[3];
    var sliderLen = Math.sqrt(a * a + b * b) / numScanPts;
    return sliderLen;
  }

  /////////////

  sliderScanRecursive();
  // inside recursive function
  function sliderScanRecursive() {
    sliderColArr = [];

    for (let i = 1; i < numScanPts; i++) {
      var pixData = vidCanvas2dContext.getImageData(
        sliderPntsArr[i][0],
        sliderPntsArr[i][1],
        1,
        1
      ).data;

      sliderPtsSvgHolder[i].attributes[2].value =
        "rgb(" + pixData[0] + "," + pixData[1] + "," + pixData[2] + ")";

      sliderColArr.push([
        //the RGB of this pixel
        pixData[0],
        pixData[1],
        pixData[2]
      ]);
    }

    //recursively call this method every frame
    requestAnimationFrame(function() {
      sliderScanRecursive();
    });
  }
}
