import * as d3 from "d3";
//console.log("d3 version: ", d3.version);
import { RadarChart } from "./radarChart";
import { RadarMath, radarStruct } from "../radarMath";

////////////////////////////////////////////////////////////////////////////////////
/**
 * radar updates upon cityIO new data
 * @param cityIOjson data from cityIO.
 */

export function radarUpdate(cityIOjson, radarChartObj, interval) {
  const radarMath = new RadarMath(cityIOjson);
  var radSt = radarStruct(radarMath);

  radarChartObj
    .data(radSt)
    .duration(interval)
    .update();
  radarChartObj.options({ legend: { display: false } });
}

//declare as global for both init and update
// let radarChartMethod;

export function radarInit() {
  var globalColors = ["#2bd14c", "#2bd1fc", "#FF39F3"];

  let radarDiv = document.createElement("div");
  radarDiv.id = "radarDiv";
  radarDiv.className = "radarDiv";
  document.body.appendChild(radarDiv);
  //
  var color = d3.scale.ordinal().range(globalColors);

  //size of radar
  let inHi = window.innerHeight;
  var radarChartOptions = {
    width: inHi,
    height: inHi,
    color: color
    //opacity: opacity
  };
  //call the radar function for init
  let radarChartObj = RadarChart();
  d3.select("#radarDiv").call(radarChartObj);
  //make empty radar without data for now
  radarChartObj.options(radarChartOptions).update();

  return radarChartObj;
}
