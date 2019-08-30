/////////////////////////////////////////////////////////////////

/*
    // WIP -- ROTATION
    //check if this type is not known
    //and not because it has '2' color
    if (indexCode === -1 && !thisBrick.includes("2")) {
      indexCode = checkRotatedBrick(thisBrick, cityIOdataStruct.objects.codes);
    }
    */

export function checkRotatedBrick(thisBrick, codes) {
  //convert this brick  string to array
  thisBrick = Array.from(thisBrick);

  // console.log("-----------NEW BRICK-----------");

  //convert the array to 2 matrix of 4 arrays
  let arrBrick = [
    thisBrick.slice(0, 4),
    thisBrick.slice(4, 8),
    thisBrick.slice(8, 12),
    thisBrick.slice(12, 16)
  ];
  //rotate this matrix 90 deg CCW [left]
  // and convert back to string
  let brickCCW270 = rotMtrxCCW(arrBrick)
    .toString()
    .replace(/,/g, "");
  // console.log("270 ", brickCCW270);
  //check the brick aginst the codes array
  let indexCode = codes.indexOf(brickCCW270);
  //if brick is a type in codes
  if (indexCode !== -1) {
    //return it
    // console.log(indexCode);

    return indexCode;
    //if brick is not a type in codes
  } else {
    //rotate it again
    let brickCCW180 = rotMtrxCCW(rotMtrxCCW(arrBrick))
      .toString()
      .replace(/,/g, "");
    // console.log("180", brickCCW180);
    //check the brick aginst the codes array
    let indexCode = codes.indexOf(brickCCW180);
    if (indexCode !== -1) {
      //return it
      // console.log(indexCode);

      return indexCode;
      //if brick is not a type in codes
    } else {
      //rotate it again
      let brickCCW90 = rotMtrxCCW(rotMtrxCCW(rotMtrxCCW(arrBrick)))
        .toString()
        .replace(/,/g, "");
      // console.log("90", brickCCW90);
      //check the brick aginst the codes array
      let indexCode = codes.indexOf(brickCCW90);
      //
      if (indexCode !== -1) {
        //return it
        // console.log(indexCode);

        return indexCode;
        //conclude that this is not a type
      } else return -1;
    }
  }
}

// flip function
const flipMatrix = matrix =>
  matrix[0].map((column, index) => matrix.map(row => row[index]));
const rotMtrxCCW = matrix => flipMatrix(matrix).reverse();
