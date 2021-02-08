import React, { Component } from "react";

import ControlPanel from "./containers/ControlPanel/ControlPanel";
import Workspace from "./containers/Workspace/Workspace";

import ControlContext from "./contexts/control-context";
import { genId, defaultValues } from "./shared/util";

import "./App.css";
import CreateCommandObject from "./shared/commandObjects/CreateCommandObject";
import ChangeBorderColorCommandObject from "./shared/commandObjects/ChangeBorderColorCommandObject";
import ChangeBorderWidthCommandObject from "./shared/commandObjects/ChangeBorderWidthCommandObject";
import ChangeFillColorCommandObject from "./shared/commandObjects/ChangeFillColorCommandObject";
import DeleteCommandObject from "./shared/commandObjects/DeleteCommandObject";
import MoveCommandObject from "./shared/commandObjects/MoveCommandObject";

import { get } from "lodash";

class CreateYourOwnPage extends Component {
  state = {
    // controls
    currMode: defaultValues.mode,
    currBorderColor: defaultValues.borderColor,
    currBorderWidth: defaultValues.borderWidth,
    currFillColor: defaultValues.fillColor,
    oldBorderWidth: undefined,
    oldLocation: undefined,

    // workspace
    shapes: [],
    shapesMap: {},
    selectedShapeId: undefined,

    // handling undo/redo
    commandList: [],
    currCommand: -1,
  };

  constructor() {
    super();

    /*
     * pass this undoHandler into command object constructors:
     *  e.g. let cmdObj = new ChangeFillColorCommandObject(this.undoHandler);
     */
    this.undoHandler = {
      registerExecution: this.registerExecution,
      // TODO: fill this up with whatever you need for the command objects
      selectedObj: null,
      objExecute: null,
      objUndo: null,
    };
  }

  /*
   * TODO:
   * add the commandObj to the commandList so
   * that is available for undoing.
   */
  registerExecution = (commandObject) => {
    let spliceAmount = this.state.currCommand + 1;
    let commandList = [...this.state.commandList];
    commandList.splice(spliceAmount);
    let currCommand = this.state.currCommand + 1;
    commandList.push(commandObject);
    this.setState({ commandList, currCommand });
  };

  /*
   * TODO:
   * actually call the undo method of the command at
   * the current position in the undo stack
   */
  undo = () => {
    console.log("undo");
    let commandList = [...this.state.commandList];
    console.log(commandList);
    let commandObj = commandList[this.state.currCommand];
    let currCommand = this.state.currCommand - 1;
    let prevObjId = get(commandList[currCommand], "objId", -1);
    this.setState({ currCommand, selectedShapeId: prevObjId }, () => {
      console.log(this.state.selectedShapeId);
    });
    // console.log(this.state.currCommand);
    commandObj.undo();
  };

  /*
   * TODO:
   * actually call the redo method of the command at
   * the current position in the undo stack. Note that this is
   * NOT the same command as would be affected by a doUndo()
   */
  redo = () => {
    console.log("redo");
    let commandList = [...this.state.commandList];
    // console.log(this.state.currCommand);
    let currCommand = this.state.currCommand + 1;
    let nextObjId =
      commandList[currCommand].objId ||
      commandList[this.state.currCommand].objId;
    this.setState({ currCommand, selectedShapeId: nextObjId }, () => {
      console.log(this.state.selectedShapeId);
    });
    // console.log(this.state.currCommand);
    let commandObj = commandList[currCommand];
    commandObj.redo();
  };

  // add the shapeId to the array, and the shape itself to the map
  addShape = (shapeData) => {
    // create command object for execution
    const addShapeCommand = (obj, id) => {
      let shapes = [...this.state.shapes];
      let shapesMap = { ...this.state.shapesMap };
      shapesMap[id] = {
        ...obj,
        id,
      };
      shapes.push(id);
      this.setState({ shapes, shapesMap, selectedShapeId: id }, () => {
        console.log(this.state.selectedShapeId);
      });
    };

    const addShapeUndo = (obj, id) => {
      obj.visible = false;
      let shapes = { ...this.state.shapes };
      let shapesMap = { ...this.state.shapesMap };
      // let id = this.state.selectedShapeId;
      shapesMap[id] = { ...obj, id };
      let selectedId = shapes[this.state.currCommand - 1] || undefined;
      this.setState({ shapesMap, selectedShapeId: selectedId }, () => {
        console.log(this.state);
      });
    };

    const addShapeRedo = (obj, id) => {
      obj.visible = true;
      let shapes = { ...this.state.shapes };
      let shapesMap = { ...this.state.shapesMap };
      // let id = shapes[this.state.currCommand + 1];
      shapesMap[id] = { ...obj, id };
      let selectedId = shapes[this.state.currCommand + 1] || undefined;
      this.setState({ shapesMap, selectedShapeId: selectedId });
    };

    this.undoHandler.objId = genId();
    this.undoHandler.selectedObj = shapeData;
    this.undoHandler.objExecute = addShapeCommand;
    this.undoHandler.objUndo = addShapeUndo;
    this.undoHandler.objRedo = addShapeRedo;
    let addShapeObj = new CreateCommandObject(this.undoHandler);
    if (addShapeObj.canExecute()) {
      addShapeObj.execute();
    }
  };

  // get the shape by its id, and update its properties
  updateShape = (shapeId, newData) => {
    let shapesMap = { ...this.state.shapesMap };
    let targetShape = shapesMap[shapeId];
    // console.log(targetShape);
    shapesMap[shapeId] = { ...targetShape, ...newData };
    this.setState({ shapesMap });
  };

  moveShapeInterim = (newData) => {
    // create command object for execution
    const moveShapeCommand = (obj, id) => {
      // console.log("HELLOO");
      // console.log(obj);
      if (!this.state.oldLocation) {
        this.setState({ oldLocation: obj });
      }
      if (this.state.selectedShapeId) {
        this.updateShape(id, obj);
      }
    };

    this.undoHandler.selectedObj = newData;
    this.undoHandler.objId = this.state.selectedShapeId;
    this.undoHandler.objExecute = moveShapeCommand;

    let moveShapeObj = new MoveCommandObject(this.undoHandler, false);
    if (moveShapeObj.canExecute()) {
      moveShapeObj.execute();
    }
  };

  moveShapeFinal = (newData) => {
    // create command object for execution
    const moveShapeCommand = (newData, id) => {
      if (this.state.selectedShapeId) {
        this.updateShape(id, newData);
      }
      this.setState({ oldLocation: undefined });
    };

    const moveShapeUndo = (obj, id, oldValue) => {
      // console.log(oldValue);
      // console.log(obj);
      if (this.state.selectedShapeId) {
        this.updateShape(id, oldValue);
      }
    };

    const moveShapeRedo = (newData, id) => {
      // console.log("MOVE REDDOOOOO");
      // console.log(newData);
      if (this.state.selectedShapeId) {
        this.updateShape(id, newData);
      }
    };

    console.log(newData);
    this.undoHandler.selectedObj = newData;
    this.undoHandler.objExecute = moveShapeCommand;
    this.undoHandler.objUndo = moveShapeUndo;
    this.undoHandler.objRedo = moveShapeRedo;
    this.undoHandler.objId = this.state.selectedShapeId;
    this.undoHandler.oldValue = this.state.oldLocation;

    let moveShapeObj = new MoveCommandObject(this.undoHandler);
    if (moveShapeObj.canExecute()) {
      moveShapeObj.execute();
    }
  };

  // deleting a shape sets its visibility to false, rather than removing it
  deleteSelectedShape = () => {
    // create command object for execution
    const deleteShapeCommand = (obj, id) => {
      let shapesMap = { ...this.state.shapesMap };
      obj.visible = false;
      shapesMap[id] = obj;
      this.setState({ shapesMap, selectedShapeId: undefined });
    };

    const deleteShapeUndo = (obj, id) => {
      let shapesMap = { ...this.state.shapesMap };
      obj.visible = true;
      shapesMap[id] = obj;
      this.setState({ shapesMap, selectedShapeId: id });
    };

    const deleteShapeRedo = (obj, id) => {
      let shapesMap = { ...this.state.shapesMap };
      obj.visible = false;
      shapesMap[id] = obj;
      this.setState({ shapesMap, selectedShapeId: undefined });
    };

    let shapesMap = { ...this.state.shapesMap };
    this.undoHandler.objId = this.state.selectedShapeId;
    this.undoHandler.selectedObj = shapesMap[this.state.selectedShapeId];
    this.undoHandler.objExecute = deleteShapeCommand;
    this.undoHandler.objUndo = deleteShapeUndo;
    this.undoHandler.objRedo = deleteShapeRedo;
    let deleteShapeObj = new DeleteCommandObject(this.undoHandler);
    if (deleteShapeObj.canExecute()) {
      deleteShapeObj.execute();
    }
  };

  changeCurrMode = (mode) => {
    if (mode === "line") {
      this.setState({
        currMode: mode,
        currBorderColor: defaultValues.borderColor,
      });
    } else {
      this.setState({ currMode: mode });
    }
  };

  changeCurrBorderColor = (borderColor) => {
    const changeBorderColorCommand = (objId, oldValue, newValue) => {
      const borderColor = newValue;
      this.setState({ currBorderColor: borderColor });
      if (objId) {
        this.updateShape(objId, { borderColor });
      }
    };

    const changeBorderColorUndo = (objId, oldValue, newValue) => {
      const borderColor = oldValue;
      this.setState({ currBorderColor: borderColor });
      if (objId) {
        this.updateShape(objId, { borderColor });
      }
    };

    const changeBorderColorRedo = (objId, oldValue, newValue) => {
      const borderColor = newValue;
      this.setState({ currBorderColor: borderColor });
      if (objId) {
        this.updateShape(objId, { borderColor });
      }
    };

    let shapesMap = { ...this.state.shapesMap };
    this.undoHandler.selectedObj = shapesMap[this.state.selectedShapeId];
    this.undoHandler.objId = this.state.selectedShapeId;
    this.undoHandler.objExecute = changeBorderColorCommand;
    this.undoHandler.objUndo = changeBorderColorUndo;
    this.undoHandler.objRedo = changeBorderColorRedo;
    this.undoHandler.oldValue = this.state.currBorderColor;
    this.undoHandler.newValue = borderColor;
    let borderColorObj = new ChangeBorderColorCommandObject(this.undoHandler);
    if (borderColorObj.canExecute()) {
      borderColorObj.execute();
    }
  };

  changeCurrBorderWidthMove = (borderWidth) => {
    // create command object for execution
    const changeBorderWidthCommand = (objId, oldValue, newValue) => {
      if (!this.state.oldBorderWidth) {
        this.setState({ oldBorderWidth: oldValue });
      }
      const borderWidth = newValue;
      this.setState({ currBorderWidth: borderWidth });
      if (objId) {
        this.updateShape(objId, { borderWidth });
      }
    };

    let shapesMap = { ...this.state.shapesMap };
    this.undoHandler.selectedObj = shapesMap[this.state.selectedShapeId];
    this.undoHandler.objId = this.state.selectedShapeId;
    this.undoHandler.objExecute = changeBorderWidthCommand;
    this.undoHandler.oldValue = this.state.currBorderWidth;
    this.undoHandler.newValue = borderWidth;

    // add event listener to border width
    let borderWidthObj = new ChangeBorderWidthCommandObject(
      this.undoHandler,
      false
    );
    if (borderWidthObj.canExecute()) {
      borderWidthObj.execute();
    }
  };

  changeCurrBorderWidthUndo = (borderWidth) => {
    // create command object for execution

    const changeBorderWidthCommand = (objId, oldValue, newValue) => {
      this.setState({ oldBorderWidth: undefined });
      const borderWidth = newValue;
      this.setState({ currBorderWidth: borderWidth });
      if (objId) {
        this.updateShape(objId, { borderWidth });
      }
    };

    const changeBorderWidthUndo = (objId, oldValue, newValue) => {
      this.setState({ oldBorderWidth: undefined });
      const borderWidth = oldValue;
      this.setState({ currBorderWidth: borderWidth });
      if (objId) {
        this.updateShape(objId, { borderWidth });
      }
    };

    const changeBorderWidthRedo = (objId, oldValue, newValue) => {
      const borderWidth = newValue;
      this.setState({ currBorderWidth: borderWidth });
      if (objId) {
        this.updateShape(objId, { borderWidth });
      }
    };

    let shapesMap = { ...this.state.shapesMap };
    this.undoHandler.selectedObj = shapesMap[this.state.selectedShapeId];
    this.undoHandler.objId = this.state.selectedShapeId;
    this.undoHandler.objExecute = changeBorderWidthCommand;
    this.undoHandler.objUndo = changeBorderWidthUndo;
    this.undoHandler.objRedo = changeBorderWidthRedo;
    this.undoHandler.oldValue = this.state.oldBorderWidth;
    this.undoHandler.newValue = borderWidth;
    let borderWidthObj = new ChangeBorderWidthCommandObject(this.undoHandler);
    if (borderWidthObj.canExecute()) {
      borderWidthObj.execute();
    }
  };

  changeCurrFillColor = (fillColor) => {
    const changeFillColorCommand = (objId, oldValue, newValue) => {
      const fillColor = newValue;
      this.setState({ currFillColor: fillColor });
      if (objId) {
        this.updateShape(objId, { fillColor });
      }
    };

    const changeFillColorUndo = (objId, oldValue, newValue) => {
      const fillColor = oldValue;
      this.setState({ currFillColor: fillColor });
      if (objId) {
        this.updateShape(objId, { fillColor });
      }
    };

    const changeFillColorRedo = (objId, oldValue, newValue) => {
      const fillColor = newValue;
      this.setState({ currFillColor: fillColor });
      if (objId) {
        this.updateShape(objId, { fillColor });
      }
    };

    let shapesMap = { ...this.state.shapesMap };
    this.undoHandler.selectedObj = shapesMap[this.state.selectedShapeId];
    this.undoHandler.objId = this.state.selectedShapeId;
    this.undoHandler.objExecute = changeFillColorCommand;
    this.undoHandler.objUndo = changeFillColorUndo;
    this.undoHandler.objRedo = changeFillColorRedo;
    this.undoHandler.oldValue = this.state.currFillColor;
    this.undoHandler.newValue = fillColor;
    let fillColorObj = new ChangeFillColorCommandObject(this.undoHandler);
    if (fillColorObj.canExecute()) {
      fillColorObj.execute();
    }
  };

  render() {
    const {
      currMode,
      currBorderColor,
      currBorderWidth,
      currFillColor,
      shapes,
      shapesMap,
      selectedShapeId,
    } = this.state;

    // update the context with the functions and values defined above and from state
    // and pass it to the structure below it (control panel and workspace)
    return (
      <React.Fragment>
        <ControlContext.Provider
          value={{
            currMode,
            changeCurrMode: this.changeCurrMode,
            currBorderColor,
            changeCurrBorderColor: this.changeCurrBorderColor,
            currBorderWidth,
            changeCurrBorderWidthMove: this.changeCurrBorderWidthMove,
            changeCurrBorderWidthUndo: this.changeCurrBorderWidthUndo,
            currFillColor,
            changeCurrFillColor: this.changeCurrFillColor,

            shapes,
            shapesMap,
            addShape: this.addShape,
            moveShapeInterim: this.moveShapeInterim,
            moveShapeFinal: this.moveShapeFinal,
            selectedShapeId,
            selectShape: (id) => {
              this.setState({ selectedShapeId: id });
              if (id) {
                const { borderColor, borderWidth, fillColor } = shapesMap[
                  shapes.filter((shapeId) => shapeId === id)[0]
                ];
                this.setState({
                  currBorderColor: borderColor,
                  currBorderWidth: borderWidth,
                  currFillColor: fillColor,
                });
              }
            },
            deleteSelectedShape: this.deleteSelectedShape,

            undo: this.undo,
            redo: this.redo,

            currCommand: this.state.currCommand,
            shapesLen: this.state.commandList.length,
          }}
        >
          <ControlPanel />
          <Workspace />
        </ControlContext.Provider>
      </React.Fragment>
    );
  }
}

export default CreateYourOwnPage;
