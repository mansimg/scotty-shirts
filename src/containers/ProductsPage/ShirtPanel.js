import React from "react";
import { withRouter } from "react-router-dom";

const ShirtPanel = ({ shirt, state, history }) => {
  var numColors = Object.keys(getField(shirt, ["colors"], [])).length;
  const url = shirt.name.split(" ").join("");

  const updateShirt = () => {
    console.log(state.currShirt[0]);
    if (shirt.name !== state.currShirt[0].name) {
      state.imageSide[1]("front");
      state.imageColor[1]("white");
      state.quantity[1](1);
      state.size[1]("Size");
    }
    state.currShirt[1](shirt);
    history.push(`/details/${url}`);
  };

  return (
    <div className="shirt-panel">
      <img
        className="shirt-img"
        onClick={updateShirt}
        src={getField(shirt, ["colors", "white", "front"], shirt.default.front)}
        alt="Shirt"
      ></img>
      <h2 className="shirt-title">
        {getField(shirt, ["name"], "Name not found")}
      </h2>
      <p className="shirt-colors">
        {"Available in " + numColors + (numColors === 1 ? " color" : " colors")}
      </p>
      <div className="shirt-buttons">
        <button className="shirt-button" onClick={updateShirt}>
          See Page
        </button>
      </div>
    </div>
  );
};

let getField = (name, path, defaultValue) => {
  var item = name;
  for (var i = 0; i < path.length; i++) {
    item = item[path[i]];
    if (item === null || item === undefined) {
      return defaultValue;
    }
  }
  return item;
};

export default withRouter(ShirtPanel);
