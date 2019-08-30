import "../Storage";

//color the visual grid base on cv analysis
export function renderGrid(state) {
  //check if we already have grid data
  if (state === true) {
    requestAnimationFrame(render);
  } else if (state === false) {
    stopRender();
  }

  function render() {
    var svgPntsArray = Storage.svgPntsArray;
    var pixelColArr = Storage.pixelColArr;
    var typesArray = Storage.typesArray;

    for (let i = 0; i < pixelColArr.length; i++) {
      let pixType = typesArray[Math.floor(i / 16)];
      if (pixType !== -1) {
        svgPntsArray[i].setAttribute("stroke", "#59d0ff");
        svgPntsArray[i].setAttribute("stroke-width", "1");
      } else {
        svgPntsArray[i].setAttribute("stroke", "");
        svgPntsArray[i].setAttribute("stroke-width", "0");
      }
      if (pixelColArr[i] === 2) {
        svgPntsArray[i].setAttribute("fill", "magenta");
        svgPntsArray[i].setAttribute("r", "2");
      } else if (pixelColArr[i] === 1) {
        svgPntsArray[i].setAttribute("fill", "black");
        svgPntsArray[i].setAttribute("r", "2");
      } else {
        svgPntsArray[i].setAttribute("fill", "white");
        svgPntsArray[i].setAttribute("r", "2");
      }
    }
    Storage.renderAnimFrame = requestAnimationFrame(render);
  }

  function stopRender() {
    //get Storage.renderAnimFrame  for current frame
    cancelAnimationFrame(Storage.renderAnimFrame);
    //get the array for pnts + pixel colors
    var svgPntsArray = Storage.svgPntsArray;
    var pixelColArr = Storage.pixelColArr;

    //delete all and clear visuals
    for (let i = 0; i < pixelColArr.length; i++) {
      svgPntsArray[i].setAttribute("stroke", "");
      svgPntsArray[i].setAttribute("stroke-width", "0");
      svgPntsArray[i].setAttribute("fill", "");
      svgPntsArray[i].setAttribute("r", "0");
    }
    return;
  }
}
