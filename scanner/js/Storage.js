// https://www.sitepoint.com/javascript-design-patterns-singleton/
//https://gist.github.com/dmnsgn/4a6ad76de1b5928f13f68f406c70bb09

class Storage {
  constructor() {
    this._camCanvas = null;
    this._typesArray = [];
    this._pixelColArr = [];
    this._cityIOdataStruct = "";
    this._svgPntsArray = [];
    this._renderAnimFrame = 0;
    this._matrixGridLocArray = [];
    this._initialScannerGridArr = [];
    this._console = "";
    this._cellGap = 0;
  }

  //web cam canvas
  get camCanvas() {
    return this._camCanvas;
  }
  set camCanvas(value) {
    this._camCanvas = value;
  }

  //types Array
  get typesArray() {
    return this._typesArray;
  }
  set typesArray(value) {
    this._typesArray = value;
  }

  //pixel Color Arr
  get pixelColArr() {
    return this._pixelColArr;
  }
  set pixelColArr(value) {
    this._pixelColArr = value;
  }

  //old pixel Color array for comparison
  get old_pixel_Col_Array() {
    return this._old_pixel_Col_Array;
  }
  set old_pixel_Col_Array(value) {
    this._old_pixel_Col_Array = value;
  }

  //cityIO data Struct
  get cityIOdataStruct() {
    return this._cityIOdataStruct;
  }
  set cityIOdataStruct(value) {
    this._cityIOdataStruct = value;
  }

  //SVG points Array
  get svgPntsArray() {
    return this._svgPntsArray;
  }
  set svgPntsArray(value) {
    this._svgPntsArray = value;
  }

  //Grid Render Animation Frame
  get renderAnimFrame() {
    return this._renderAnimFrame;
  }
  set renderAnimFrame(value) {
    this._renderAnimFrame = value;
  }

  // matrix Grid Location Array
  get matrixGridLocArray() {
    return this._matrixGridLocArray;
  }
  set matrixGridLocArray(value) {
    this._matrixGridLocArray = value;
  }

  // initial Grid Location Array
  get initialScannerGridArr() {
    return this._initialScannerGridArr;
  }
  set initialScannerGridArr(value) {
    this._initialScannerGridArr = value;
  }

  // console text
  get console() {
    return this._console;
  }
  set console(value) {
    this._console += value;
  }

  // matrix Grid Location Array
  get cellGap() {
    return this._cellGap;
  }
  set cellGap(value) {
    this._cellGap = value;
  }
}

export default new Storage();
