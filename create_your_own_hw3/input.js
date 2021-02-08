// set state of program

var layerEnum = "svg";
var modeEnum = "modeLine";
var borderColorEnum = "blackOptionBorder";
var fillColorEnum = "greenOptionFill";
var selectedObjEnum = null;
var showShadowEnum = {};
var dragEnum = {};

// data type conversions

const bcEnum = {
  noneOptionBorder: "none",
  whiteOptionBorder: "white",
  grayOptionBorder: "gray",
  blackOptionBorder: "black",
  yellowOptionBorder: "yellow",
  redOptionBorder: "red",
  blueOptionBorder: "blue",
  greenOptionBorder: "green",
};

const fcEnum = {
  noneOptionFill: "none",
  whiteOptionFill: "white",
  grayOptionFill: "gray",
  blackOptionFill: "black",
  yellowOptionFill: "yellow",
  redOptionFill: "red",
  blueOptionFill: "blue",
  greenOptionFill: "green",
};

// create palette + children

var palette = document.getElementById("palette");
var layers = document.getElementById("layers");
var mode = document.getElementById("mode");
var modeButtons = [...document.getElementsByClassName("modeItemContainer")];
var borderColor = document.getElementById("borderColor");
var borderColorOptions = [
  ...document.getElementsByClassName("borderColorItemContainer"),
];
var borderWidthSlider = document.getElementById("borderWidthOption");
var borderWidthLabel = document.getElementById("sliderLabel");
var fillColor = document.getElementById("fillColor");
var fillColorOptions = [
  ...document.getElementsByClassName("fillColorItemContainer"),
];
var deleteButton = document.getElementById("deleteButton");
var deleteAllButton = document.getElementById("deleteAllButton");

// extract workarea, canvas and svg

var workarea = document.getElementById("workarea");
var canvas = document.getElementById("workarea-canvas");
var svg = document.getElementById("workarea-svg");

// set up default canvas and svg viewing

svg.style.display = "block";
canvas.style.display = "none";

// create filters for svg view (for selection)

const createFilter = () => {
  // create drop shadow filter
  var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  var filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
  filter.setAttributeNS(null, "id", "selectFilter");
  filter.setAttributeNS(null, "filterUnits", "userSpaceOnUse");

  // create drop shadow element
  var feDrop = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "feDropShadow"
  );
  feDrop.setAttributeNS(null, "dx", "0");
  feDrop.setAttributeNS(null, "dy", "0");
  feDrop.setAttributeNS(null, "stdDeviation", "3");
  feDrop.setAttributeNS(null, "flood-color", "black");

  // add feDrop to filter
  filter.appendChild(feDrop);

  // add filter to svg
  defs.appendChild(filter);
  svg.appendChild(defs);
};

createFilter();

// drop shadow callback function
var svgObjects = svg.childNodes;

const showShadow = (obj) => {
  return (event) => {
    svgObjects.forEach((o) => {
      // set other objects' filters to none
      if (o instanceof SVGElement) {
        o.setAttributeNS(null, "filter", "none");
      }
    });
    // set drop shadow of current object
    obj.setAttributeNS(null, "filter", "url(#selectFilter)");
    selectedObjEnum = obj;

    // update border width, border color and fill color of palette
    var objStyle = obj.getAttributeNS(null, "style").split(";");
    objStyle = objStyle.map((x) => x.split(":"));

    var bcOption = document.getElementById(`${objStyle[0][1]}OptionBorder`);
    bcOption.click();

    var bwSlider = document.getElementById("borderWidthOption");
    bwSlider.value = objStyle[1][1];
    borderWidthSlider.oninput();

    if (objStyle.length > 2) {
      var fcOption = document.getElementById(`${objStyle[2][1]}OptionFill`);
      fcOption.click();
    }

    if (event) {
      event.stopPropagation();
    }
  };
};

// disabled divs
var disabledDivs = Array.from(document.getElementsByClassName("disabledDiv"));
var stopProp = (event) => {
  event.stopImmediatePropagation();
};

// add document listeners to change workarea (layers)

document.addEventListener("click", (event) => {
  if (layerEnum === "canvas") {
    canvas.style.display = "block";
    svg.style.display = "none";
    disabledDivs.map((x) => {
      x.style.visibility = "hidden";
      x.removeEventListener("mousedown", stopProp);
    });
  } else if (layerEnum === "svg") {
    svg.style.display = "block";
    canvas.style.display = "none";
    disabledDivs.map((x) => {
      x.style.visibility = "hidden";
      x.removeEventListener("mousedown", stopProp);
    });
  } else if (layerEnum === "both") {
    svg.style.display = "initial";
    canvas.style.display = "initial";
    disabledDivs.map((x) => {
      x.style.visibility = "visible";
      x.addEventListener("mousedown", stopProp);
    });
  }
});

// perform drawing event on workarea based on layer

workarea.addEventListener("mousedown", (event) => {
  if (layerEnum === "svg") {
    if (modeEnum === "modeLine" && borderColorEnum !== "noneOptionBorder") {
      // create new svg line
      var newLine = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );

      // set attributes
      newLine.setAttributeNS(null, "id", `${event.clientX}${event.layerY}`);
      newLine.setAttributeNS(null, "x1", event.layerX);
      newLine.setAttributeNS(null, "y1", event.layerY);
      newLine.setAttributeNS(null, "x2", event.layerX);
      newLine.setAttributeNS(null, "y2", event.layerY);
      newLine.setAttributeNS(
        null,
        "style",
        `stroke:${bcEnum[borderColorEnum]};stroke-width:${borderWidthSlider.value}`
      );
      svg.appendChild(newLine);

      // moving mouse will create line
      const createLine = (event) => {
        newLine.setAttributeNS(null, "x2", event.layerX);
        newLine.setAttributeNS(null, "y2", event.layerY);
      };
      workarea.addEventListener("mousemove", createLine);

      // when moving is over
      const finalizeLine = (event) => {
        workarea.removeEventListener("mousemove", createLine);
        document.removeEventListener("keydown", abortLine);
        document.removeEventListener("mouseup", finalizeLine);
        var calcDistance = (newLn) => {
          var x1 = newLn.getAttributeNS(null, "x1");
          var y1 = newLn.getAttributeNS(null, "y1");
          var x2 = newLn.getAttributeNS(null, "x2");
          var y2 = newLn.getAttributeNS(null, "y2");
          return Math.sqrt(((x2 - x1) ^ 2) + ((y2 - y1) ^ 2));
        };
        if (calcDistance(newLine) < 5) {
          // throwing error - fix
          svg.removeChild(newLine);
        } else {
          selectedObjEnum = newLine;
          // new object should have shadow filter applied
          showShadow(newLine)();
        }
      };
      document.addEventListener("mouseup", finalizeLine);

      // aborting with esc
      const abortLine = (event) => {
        if (event.key === "Escape") {
          workarea.removeEventListener("mousemove", createLine);
          document.removeEventListener("mouseup", finalizeLine);
          svg.removeChild(newLine);
        }
      };
      document.addEventListener("keydown", abortLine);
    } else if (
      modeEnum === "modeSquare" &&
      (borderColorEnum !== "noneOptionBorder" ||
        fillColorEnum !== "noneOptionFill")
    ) {
      // create new svg rectangle
      var newRect = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );

      // save current x and y to calculate dims later
      var x = event.layerX;
      var y = event.layerY;

      newRect.setAttributeNS(null, "width", 0);
      newRect.setAttributeNS(null, "height", 0);
      newRect.setAttributeNS(null, "x", x);
      newRect.setAttributeNS(null, "y", y);
      newRect.setAttributeNS(
        null,
        "style",
        `stroke:${bcEnum[borderColorEnum]};stroke-width:${borderWidthSlider.value};fill:${fcEnum[fillColorEnum]}`
      );
      svg.appendChild(newRect);

      //moving mouse will change dimensions of rect
      const createRect = (event) => {
        newRect.setAttributeNS(null, "width", Math.abs(event.layerX - x));
        newRect.setAttributeNS(null, "height", Math.abs(event.layerY - y));
      };
      workarea.addEventListener("mousemove", createRect);

      // when moving is over
      const finalizeRect = (event) => {
        workarea.removeEventListener("mousemove", createRect);
        document.removeEventListener("keydown", abortRect);
        document.removeEventListener("mouseup", finalizeRect);
        var height = newRect.getAttributeNS(null, "height");
        var width = newRect.getAttributeNS(null, "width");
        if (width < 10 || height < 10) {
          svg.removeChild(newRect);
        } else {
          selectedObjEnum = newRect;
          // new object should have shadow filter applied
          showShadow(newRect)();
        }
      };
      document.addEventListener("mouseup", finalizeRect);

      // aborting with esc
      const abortRect = (event) => {
        if (event.key === "Escape") {
          workarea.removeEventListener("mousemove", createRect);
          document.removeEventListener("mouseup", finalizeRect);
          svg.removeChild(newRect);
        }
      };

      document.addEventListener("keydown", abortRect);
    } else if (
      modeEnum === "modeCircle" &&
      (borderColorEnum !== "noneOptionBorder" ||
        fillColorEnum !== "noneOptionFill")
    ) {
      // create new svg ellipse
      var newEllipse = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "ellipse"
      );

      // save current x and y to calculate dims later
      x = event.layerX;
      y = event.layerY;

      newEllipse.setAttributeNS(null, "cx", x);
      newEllipse.setAttributeNS(null, "cy", y);
      newEllipse.setAttributeNS(null, "rx", 0);
      newEllipse.setAttributeNS(null, "ry", 0);
      newEllipse.setAttributeNS(
        null,
        "style",
        `stroke:${bcEnum[borderColorEnum]};stroke-width:${borderWidthSlider.value};fill:${fcEnum[fillColorEnum]}`
      );
      svg.appendChild(newEllipse);

      //moving mouse will change dimensions of rect
      const createEllipse = (event) => {
        newEllipse.setAttributeNS(null, "cx", Math.abs((event.layerX + x) / 2));
        newEllipse.setAttributeNS(null, "cy", Math.abs((event.layerY + y) / 2));
        newEllipse.setAttributeNS(null, "rx", Math.abs((event.layerX - x) / 2));
        newEllipse.setAttributeNS(null, "ry", Math.abs((event.layerY - y) / 2));
      };
      workarea.addEventListener("mousemove", createEllipse);

      // when moving is over
      const finalizeEllipse = (event) => {
        workarea.removeEventListener("mousemove", createEllipse);
        document.removeEventListener("keydown", abortEllipse);
        document.removeEventListener("mouseup", finalizeEllipse);
        var rx = newEllipse.getAttributeNS(null, "rx");
        var ry = newEllipse.getAttributeNS(null, "ry");
        if (rx < 10 || ry < 10) {
          svg.removeChild(newEllipse);
        } else {
          selectedObjEnum = newEllipse;
          // new object should have shadow filter applied
          showShadow(newEllipse)();
        }
      };
      document.addEventListener("mouseup", finalizeEllipse);

      // aborting with esc
      const abortEllipse = (event) => {
        if (event.key === "Escape") {
          workarea.removeEventListener("mousemove", createEllipse);
          document.removeEventListener("mouseup", finalizeEllipse);
          document.removeEventListener("keydown", abortEllipse);
          svg.removeChild(newEllipse);
        }
      };

      document.addEventListener("keydown", abortEllipse);
    } else if (modeEnum === "modeCursor") {
      // should be able to drag objects, add listeners to events? during selection of cursor

      if (layerEnum === "svg" && modeEnum === "modeCursor") {
        svgObjects.forEach((o) => {
          // set other objects' filters to none
          if (o instanceof SVGElement) {
            o.setAttributeNS(null, "filter", "none");
          }
        });
        selectedObjEnum = null;
      }
    }
  } else if (layerEnum === "canvas") {
    // case on mode - shouldn't do anything in cursor mode

    // get context of current canvas
    var ctx = canvas.getContext("2d");

    // create temp canvas
    var tempCanvas = document.createElement("canvas");
    tempCanvas.width = 800;
    tempCanvas.height = 800;
    tempCanvas.style = "position: absolute; z-index: 100;";
    var tempCtx = tempCanvas.getContext("2d");

    // add to workarea
    workarea.appendChild(tempCanvas);

    // get current coordinates
    const x1 = event.layerX;
    const y1 = event.layerY;
    var x2 = 0;
    var y2 = 0;

    // set attributes from palette
    if (bcEnum[borderColorEnum] !== "none") {
      tempCtx.strokeStyle = bcEnum[borderColorEnum];
    }
    tempCtx.lineWidth = borderWidthSlider.value;
    if (fcEnum[fillColorEnum] !== "none") {
      tempCtx.fillStyle = fcEnum[fillColorEnum];
    }

    if (modeEnum === "modeLine" && bcEnum[borderColorEnum] !== "none") {
      // drawing lines using temp canvas
      var createLine = (event) => {
        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.beginPath();
        tempCtx.moveTo(x1, y1);
        tempCtx.lineTo(event.layerX, event.layerY);
        tempCtx.stroke();
        x2 = event.layerX;
        y2 = event.layerY;
      };

      // add mouse move event handler
      workarea.addEventListener("mousemove", createLine);

      // when drawing is finished
      var finalizeLine = (event) => {
        workarea.removeEventListener("mousemove", createLine);
        document.removeEventListener("mouseup", finalizeLine);
        document.removeEventListener("keydown", abortLine);

        if (Math.abs(x2 - x1) >= 5 || Math.abs(y2 - y1) >= 5)
          ctx.drawImage(tempCanvas, 0, 0);
        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        workarea.removeChild(tempCanvas);
      };

      document.addEventListener("mouseup", finalizeLine);

      var abortLine = (event) => {
        if (event.key === "Escape") {
          workarea.removeEventListener("mousemove", createLine);
          document.removeEventListener("mouseup", finalizeLine);
          document.removeEventListener("keydown", abortLine);
          tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
          workarea.removeChild(tempCanvas);
        }
      };

      document.addEventListener("keydown", abortLine);
    } else if (modeEnum === "modeSquare") {
      // drawing rectangles using temp canvas
      var width = 0;
      var height = 0;
      var createRect = (event) => {
        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        if (fcEnum[fillColorEnum] !== "none") {
          tempCtx.fillRect(x1, y1, event.layerX - x1, event.layerY - y1);
        }
        if (bcEnum[borderColorEnum] !== "none") {
          tempCtx.strokeRect(x1, y1, event.layerX - x1, event.layerY - y1);
        }
        width = event.layerX - x1;
        height = event.layerY - y1;
      };

      // add mouse move event handler
      workarea.addEventListener("mousemove", createRect);

      // when drawing is finished
      var finalizeRect = (event) => {
        workarea.removeEventListener("mousemove", createRect);
        document.removeEventListener("mouseup", finalizeRect);
        document.removeEventListener("keydown", abortRect);

        if (Math.abs(width) >= 10 && Math.abs(height) >= 10) {
          ctx.drawImage(tempCanvas, 0, 0);
        }
        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        workarea.removeChild(tempCanvas);
      };

      document.addEventListener("mouseup", finalizeRect);

      var abortRect = (event) => {
        if (event.key === "Escape") {
          workarea.removeEventListener("mousemove", createRect);
          document.removeEventListener("mouseup", finalizeRect);
          document.removeEventListener("keydown", abortRect);
          tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
          workarea.removeChild(tempCanvas);
        }
      };

      document.addEventListener("keydown", abortRect);
    } else if (modeEnum === "modeCircle") {
      // drawing ellipses using temp canvas
      width = 0;
      height = 0;
      var createEllipse = (event) => {
        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.beginPath();
        tempCtx.ellipse(
          (event.layerX + x1) / 2,
          (event.layerY + y1) / 2,
          Math.abs((event.layerX - x1) / 2),
          Math.abs((event.layerY - y1) / 2),
          0,
          0,
          2 * Math.PI
        );
        if (bcEnum[borderColorEnum] !== "none") {
          tempCtx.stroke();
        }
        if (fcEnum[fillColorEnum] !== "none") {
          tempCtx.fill();
        }
        width = Math.abs((event.layerX - x1) / 2);
        height = Math.abs((event.layerY - y1) / 2);
      };

      // add mouse move event handler
      workarea.addEventListener("mousemove", createEllipse);

      // when drawing is finished
      var finalizeEllipse = (event) => {
        workarea.removeEventListener("mousemove", createEllipse);
        document.removeEventListener("mouseup", finalizeEllipse);
        document.removeEventListener("keydown", abortEllipse);

        if (width >= 10 && height >= 10) {
          ctx.drawImage(tempCanvas, 0, 0);
        }
        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        workarea.removeChild(tempCanvas);
      };

      document.addEventListener("mouseup", finalizeEllipse);

      var abortEllipse = (event) => {
        if (event.key === "Escape") {
          workarea.removeEventListener("mousemove", createEllipse);
          document.removeEventListener("mouseup", finalizeEllipse);
          document.removeEventListener("keydown", abortEllipse);
          tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
          workarea.removeChild(tempCanvas);
        }
      };

      document.addEventListener("keydown", abortEllipse);
    } else if (modeEnum === "modeCursor") {
      var color = getComputedStyle(document.getElementById(fillColorEnum))
        .backgroundColor;
      floodFill(event, canvas, color);
    }
  }
  // } else if (layerEnum === 'both') {

  // }
});

// add listeners to the palette

// see if radio buttons have changed

layers.addEventListener("click", (event) => {
  // get value of radio button
  var buttons = document.getElementsByName("lay");
  let selectedValue;
  for (const button of buttons) {
    if (button.checked) {
      selectedValue = button.value;
      break;
    }
  }

  // change layer configuration
  layerEnum = selectedValue;
});

// see if mode has changed

modeButtons.map((modeButton) => {
  modeButton.addEventListener("click", (event) => {
    modeButtons.forEach((mb) => {
      mb.className = "modeItemContainer";
    });
    modeButton.className = "modeItemContainer selected";
    modeEnum = modeButton.childNodes[0].id || modeButton.childNodes[1].id;
    if (layerEnum === "svg") {
      // get all objects created from document
      svgObjects = svg.childNodes;

      // add/remove event listeners from each of the child nodes
      svgObjects.forEach((obj) => {
        // adding drag listener
        var drag = (obj) => {
          return (event) => {
            // case on type of object? to set location
            if (obj === selectedObjEnum) {
              if (obj.nodeName === "line") {
                // get current attributes
                var x1 = parseInt(obj.getAttributeNS(null, "x1"), 10);
                var x2 = parseInt(obj.getAttributeNS(null, "x2"), 10);
                var y1 = parseInt(obj.getAttributeNS(null, "y1"), 10);
                var y2 = parseInt(obj.getAttributeNS(null, "y2"), 10);

                var clickX = parseInt(event.layerX, 10);
                var clickY = parseInt(event.layerY, 10);

                // add mouse move handler
                const moveLine = (event) => {
                  var newClickX = event.layerX;
                  var newClickY = event.layerY;

                  obj.setAttributeNS(
                    null,
                    "x1",
                    x1 + (parseInt(newClickX, 10) - clickX)
                  );
                  obj.setAttributeNS(
                    null,
                    "y1",
                    y1 + (parseInt(newClickY, 10) - clickY)
                  );
                  obj.setAttributeNS(
                    null,
                    "x2",
                    x2 + (parseInt(newClickX, 10) - clickX)
                  );
                  obj.setAttributeNS(
                    null,
                    "y2",
                    y2 + (parseInt(newClickY, 10) - clickY)
                  );
                };

                workarea.addEventListener("mousemove", moveLine);

                // add mouse up handler
                const finalizeLine = (event) => {
                  workarea.removeEventListener("mousemove", moveLine);
                  document.removeEventListener("mouseup", finalizeLine);
                  document.removeEventListener("keydown", abortLine);
                };

                document.addEventListener("mouseup", finalizeLine);

                // add key down handler
                const abortLine = (event) => {
                  if (event.key === "Escape") {
                    workarea.removeEventListener("mousemove", moveLine);
                    document.removeEventListener("mouseup", finalizeLine);
                    document.removeEventListener("keydown", abortLine);

                    obj.setAttributeNS(null, "x1", x1);
                    obj.setAttributeNS(null, "y1", y1);
                    obj.setAttributeNS(null, "x2", x2);
                    obj.setAttributeNS(null, "y2", y2);
                  }
                };

                document.addEventListener("keydown", abortLine);

                event.stopPropagation();
              } else if (obj.nodeName === "rect") {
                // get current attributes
                var x = parseInt(obj.getAttributeNS(null, "x"), 10);
                var y = parseInt(obj.getAttributeNS(null, "y"), 10);
                // var width = parseInt(obj.getAttributeNS(null, "width"), 10);
                // var height = parseInt(obj.getAttributeNS(null, "height"), 10);

                clickX = parseInt(event.layerX, 10);
                clickY = parseInt(event.layerY, 10);

                // add mouse move handler
                const moveRect = (event) => {
                  var newClickX = event.layerX;
                  var newClickY = event.layerY;

                  obj.setAttributeNS(
                    null,
                    "x",
                    x + (parseInt(newClickX, 10) - clickX)
                  );
                  obj.setAttributeNS(
                    null,
                    "y",
                    y + (parseInt(newClickY, 10) - clickY)
                  );
                };

                workarea.addEventListener("mousemove", moveRect);

                // add mouse up handler
                const finalizeRect = (event) => {
                  workarea.removeEventListener("mousemove", moveRect);
                  document.removeEventListener("mouseup", finalizeRect);
                  document.removeEventListener("keydown", abortRect);
                };

                document.addEventListener("mouseup", finalizeRect);

                // add key down handler
                const abortRect = (event) => {
                  if (event.key === "Escape") {
                    workarea.removeEventListener("mousemove", moveRect);
                    document.removeEventListener("mouseup", finalizeRect);
                    document.removeEventListener("keydown", abortRect);

                    obj.setAttributeNS(null, "x", x);
                    obj.setAttributeNS(null, "y", y);
                  }
                };

                document.addEventListener("keydown", abortRect);

                event.stopPropagation();
              } else if (obj.nodeName === "ellipse") {
                // get current attributes
                var cx = parseInt(obj.getAttributeNS(null, "cx"), 10);
                var cy = parseInt(obj.getAttributeNS(null, "cy"), 10);
                // var rx = parseInt(obj.getAttributeNS(null, "rx"), 10);
                // var ry = parseInt(obj.getAttributeNS(null, "ry"), 10);

                clickX = parseInt(event.layerX, 10);
                clickY = parseInt(event.layerY, 10);

                // add mouse move handler
                const moveEllipse = (event) => {
                  var newClickX = event.layerX;
                  var newClickY = event.layerY;

                  obj.setAttributeNS(
                    null,
                    "cx",
                    cx + (parseInt(newClickX, 10) - clickX)
                  );
                  obj.setAttributeNS(
                    null,
                    "cy",
                    cy + (parseInt(newClickY, 10) - clickY)
                  );
                };

                workarea.addEventListener("mousemove", moveEllipse);

                // add mouse up handler
                const finalizeEllipse = (event) => {
                  workarea.removeEventListener("mousemove", moveEllipse);
                  document.removeEventListener("mouseup", finalizeEllipse);
                  document.removeEventListener("keydown", abortEllipse);
                };

                document.addEventListener("mouseup", finalizeEllipse);

                // add key down handler
                const abortEllipse = (event) => {
                  if (event.key === "Escape") {
                    workarea.removeEventListener("mousemove", moveEllipse);
                    document.removeEventListener("mouseup", finalizeEllipse);
                    document.removeEventListener("keydown", abortEllipse);

                    obj.setAttributeNS(null, "cx", cx);
                    obj.setAttributeNS(null, "cy", cy);
                  }
                };

                document.addEventListener("keydown", abortEllipse);

                event.stopPropagation();
              }
            }
            if (event) {
              event.stopPropagation();
            }
          };
        };
        if (obj instanceof SVGElement) {
          let dragObj;
          if (dragEnum[obj]) {
            dragObj = dragEnum[obj];
          } else {
            dragObj = drag(obj);
            dragEnum[obj.id || `1000000`] = dragObj;
          }
          // check if in cursor mode
          if (modeEnum === "modeCursor") {
            obj.addEventListener("mousedown", dragObj);
          } else {
            obj.removeEventListener("mousedown", dragObj);
            // dragEnum[obj] = null;
          }
        }
        // adding shadow listener
        if (obj instanceof SVGElement) {
          let showShadowObj;
          if (showShadowEnum[obj]) {
            showShadowObj = showShadowEnum[obj];
          } else {
            showShadowObj = showShadow(obj);
            showShadowEnum[obj.id || `1000000`] = showShadowObj;
          }
          // check if in cursor mode
          if (modeEnum === "modeCursor") {
            obj.addEventListener("click", showShadowObj);
          } else {
            obj.removeEventListener("click", showShadowObj);
          }
        }
      });
    }
  });
});

// check if border color has changed

borderColorOptions.map((borderColorOption) => {
  borderColorOption.addEventListener("click", (event) => {
    // check if border color is valid
    if (
      (borderColorOption.childNodes[0].id ||
        borderColorOption.childNodes[1].id) !== "noneOptionBorder" ||
      (fillColorEnum !== "noneOptionFill" &&
        ((modeEnum !== "modeLine" && modeEnum !== "modeCursor") ||
          (selectedObjEnum && selectedObjEnum.nodeName !== "line")))
    ) {
      borderColorOptions.forEach((bc) => {
        bc.className = "borderColorItemContainer";
      });
      borderColorOption.className = "borderColorItemContainer selected";
      borderColorEnum =
        borderColorOption.childNodes[0].id ||
        borderColorOption.childNodes[1].id;

      // change mode square and circle border color
      var square = document.getElementById("modeSquare");
      var circle = document.getElementById("modeCircle");

      square.style.borderColor = bcEnum[borderColorEnum];
      circle.style.borderColor = bcEnum[borderColorEnum];

      if (
        modeEnum === "modeCursor" &&
        layerEnum === "svg" &&
        selectedObjEnum !== null
      ) {
        // change the border color
        var objStyle = selectedObjEnum.getAttributeNS(null, "style").split(";");
        objStyle = objStyle.map((x) => x.split(":"));
        borderColor = bcEnum[borderColorEnum];
        var newStyle = `stroke:${borderColor};stroke-width:${objStyle[1][1]}`;

        if (objStyle.length > 2) {
          newStyle = `${newStyle};fill:${objStyle[2][1]}`;
        }

        selectedObjEnum.setAttributeNS(null, "style", newStyle);
      }
    }
  });
});

// border width range slider

borderWidthSlider.oninput = () => {
  borderWidthLabel.innerHTML = "Value: " + borderWidthSlider.value;
  if (
    modeEnum === "modeCursor" &&
    layerEnum === "svg" &&
    selectedObjEnum !== null
  ) {
    // change the border width
    var objStyle = selectedObjEnum.getAttributeNS(null, "style").split(";");
    objStyle = objStyle.map((x) => x.split(":"));
    var newStyle = `stroke:${objStyle[0][1]};stroke-width:${borderWidthSlider.value}`;

    if (objStyle.length > 2) {
      newStyle = `${newStyle};fill:${objStyle[2][1]}`;
    }

    selectedObjEnum.setAttributeNS(null, "style", newStyle);
  }
};

// check if fill color has changed

fillColorOptions.map((fillColorOption) => {
  fillColorOption.addEventListener("click", (event) => {
    if (
      (fillColorOption.childNodes[0].id || fillColorOption.childNodes[1].id) !==
        "noneOptionFill" ||
      borderColorEnum !== "noneOptionBorder"
    ) {
      fillColorOptions.forEach((bc) => {
        bc.className = "fillColorItemContainer";
      });
      fillColorOption.className = "fillColorItemContainer selected";
      fillColorEnum =
        fillColorOption.childNodes[0].id || fillColorOption.childNodes[1].id;

      // change mode square and circle border color
      var square = document.getElementById("modeSquare");
      var circle = document.getElementById("modeCircle");

      square.style.background = fcEnum[fillColorEnum];
      circle.style.background = fcEnum[fillColorEnum];

      if (
        modeEnum === "modeCursor" &&
        layerEnum === "svg" &&
        selectedObjEnum !== null
      ) {
        // change the fill color
        var objStyle = selectedObjEnum.getAttributeNS(null, "style").split(";");
        objStyle = objStyle.map((x) => x.split(":"));
        var newStyle = `stroke:${objStyle[0][1]};stroke-width:${objStyle[1][1]}`;

        if (objStyle.length > 2) {
          newStyle = `${newStyle};fill:${fcEnum[fillColorEnum]}`;
        }

        selectedObjEnum.setAttributeNS(null, "style", newStyle);
      }
    }
  });
});

// add listeners for delete buttons

deleteButton.addEventListener("click", (event) => {
  if (layerEnum === "svg" && selectedObjEnum !== null) {
    svg.removeChild(selectedObjEnum);
    selectedObjEnum = null;
  }
});

deleteAllButton.addEventListener("click", (event) => {
  // delete canvas stuff
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // delete svg stuff
  var nodes = Array.from(svg.childNodes);
  nodes.map((child) => {
    if (
      child.nodeName === "line" ||
      child.nodeName === "rect" ||
      child.nodeName === "ellipse"
    ) {
      svg.removeChild(child);
    }
  });
  selectedObjEnum = null;
});
