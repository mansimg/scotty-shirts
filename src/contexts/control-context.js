import { createContext } from "react";

// create a context with default values
const controlContext = createContext({
  currMode: "",
  changeCurrMode: () => {},
  currBorderColor: "",
  changeCurrBorderColor: () => {},
  currBorderWidth: 1,
  changeCurrBorderWidthMove: () => {},
  changeCurrBorderWidthUndo: () => {},
  currFillColor: "",
  changeCurrFillColor: () => {},

  shapes: [],
  shapesMap: {},
  addShape: () => {},
  moveShapeInterim: () => {},
  moveShapeFinal: () => {},
  selectedShapeId: "", // a string or undefined
  selectShape: () => {},
  deleteSelectedShape: () => {},

  undo: () => {},
  redo: () => {},

  currCommand: -1,
  shapesLen: 0,
});

export default controlContext;
