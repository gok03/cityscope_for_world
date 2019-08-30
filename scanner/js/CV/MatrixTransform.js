import "../Storage";
import { _ } from "core-js";
import { ColorPicker } from "./CV";
var PerspT = require("perspective-transform/dist/perspective-transform");
import { svgCircle, svgText, updateInfoDIV } from "../Modules";

///////////////////////////////////////////////////////////////////////////
// a function to make the initial generic array of
//evenly divided grid points before distorting & scanning

export function scanArrayMaker() {
  var cityIOdataStruct = Storage.cityIOdataStruct;
  //get the camera canvas
  var camCanvas = Storage.camCanvas;
  //amount of grid pixels from settings JSON
  var gridCols = cityIOdataStruct.header.spatial.ncols * 4;
  var gridRows = cityIOdataStruct.header.spatial.nrows * 4;

  //init the array
  var initialScannerGridArr = [];
  //get canvas ratio to divided by #-1 of points
  let ratX = camCanvas.width / (gridCols - 1);
  let ratY = camCanvas.height / (gridRows - 1);
  //outer two loops create the rows and cols of each brick
  for (let outCols = 0; outCols < camCanvas.height; outCols += ratY * 4) {
    for (let outRows = camCanvas.width; outRows > 0; outRows -= ratX * 4) {
      //inner loops create the 4x4 points of the brick itself
      for (let inCols = 0; inCols < ratY * 4; inCols += ratY) {
        for (let inRows = 0; inRows < ratX * 4; inRows += ratX) {
          //push the location into array
          initialScannerGridArr.push([outRows - inRows, outCols + inCols]);
        }
      }
    }
  }
  Storage.initialScannerGridArr = initialScannerGridArr;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//GLOBAL FOR NOW
let colorPicker = new ColorPicker();

//create the scanning transposed matrix
export function MatrixTransform(gridCorners) {
  //get canvas from Storage
  var camCanvas = Storage.camCanvas;
  // returns a new baseline grid of locations as Array
  let initialScannerGridArr = Storage.initialScannerGridArr;
  //matrix Grid Location Array
  var matrixGridLocArray = [];
  //set the reference points of the 4 edges of the canvas
  // to get 100% of the image/video in canvas
  //before distorting
  var srcCorners = [
    getPos(camCanvas)[0],
    getPos(camCanvas)[1],
    camCanvas.width,
    getPos(camCanvas)[1],
    getPos(camCanvas)[0],
    camCanvas.height,
    camCanvas.width,
    camCanvas.height
  ];
  //var for the distorted points
  let dstPt;
  // use perspT lib to calculate transform matrix
  //and store the results of the 4 points dist. in var perspT
  let perspTres;
  perspTres = PerspT(srcCorners, gridCorners);
  var svgPntsArray = [];
  var svgKeystone = document.querySelector("#svgKeystone");
  // clear SVG at start
  svgKeystone.innerHTML = "";
  //distort each dot in the matrix to locations and make cubes
  for (let i = 0; i < initialScannerGridArr.length; i++) {
    /*
    drawPnt(
      [initialScannerGridArr[i][0], initialScannerGridArr[i][1]],
      "green",
      i
    );
    */
    dstPt = perspTres.transform(
      initialScannerGridArr[i][0],
      initialScannerGridArr[i][1]
    );
    // Draw the grid pnt and put it in an array
    svgPntsArray.push(drawPnt(dstPt, "magenta", i));

    //push these locs to an array for scanning
    matrixGridLocArray.push([Math.floor(dstPt[0]), Math.floor(dstPt[1])]);
  }

  //save to Storage class
  Storage.svgPntsArray = svgPntsArray;
  //save points to Storage
  Storage.matrixGridLocArray = matrixGridLocArray;
  updateInfoDIV("Matrix Transformed 4 corners are at: " + gridCorners);

  //start picking colors
  colorPicker.cancel();
  colorPicker.start();
  //reset the base corners
  gridCorners = [];
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////

//method to get this div position
function getPos(divPos) {
  // yay readability
  for (
    var lx = 0, ly = 0;
    divPos != null;
    lx += divPos.offsetLeft,
      ly += divPos.offsetTop,
      divPos = divPos.offsetParent
  );
  return [lx, ly];
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////

export function drawPnt(dstPt, color, text) {
  //show points' text
  // svgKeystone.appendChild(svgText(dstPt, text, 6));

  //create visuals points on canvas for ref and add to array
  var thisPnt = svgKeystone.appendChild(
    svgCircle(dstPt, color, 1.5, 0.5, "#000000", 0.3)
  );
  return thisPnt;

  /*  
  // show text for each grid pnt
  svgKeystone.appendChild(svgText(dstPt, j, 8));
  //Save for basline grid draw
  let counter = 0;
  let counter_inner = 0;
  // draw points if needed
  let t = svgText([rows, cols], counter, 5);
  let c = svgCircle([rows, cols], "green", 10, 1, "green", 10);
  let c2 = svgCircle([rows + i, cols + j], "green", 10, 1, "green", 2);
  let t2 = svgText([rows + i, cols + j], counter_inner, 2);
  svgKeystone.appendChild(c2, t2);
  //
  counter_inner++;
  counter++;
  */
}
