import React from "react";

const ColorButton = ({ className, name, shirt, image, setImage, state }) => {
  const imageSide = state.imageSide[0];
  const setImageColor = state.imageColor[1];
  const changeImage = () => {
    const newImage = getField(
      shirt,
      ["colors", name, imageSide],
      shirt.default[imageSide]
    );
    setImage(newImage);
    setImageColor(name);
  };
  let getField = (name, path, defaultValue) => {
    var item = name;
    for (var i = 0; i < path.length; i++) {
      item = item[path[i]];
      if (item == null || item === undefined) {
        return defaultValue;
      }
    }
    return item;
  };
  return (
    <p
      className={className}
      onClick={changeImage}
      style={{ backgroundColor: name }}
    >
      {name}
    </p>
  );
};

export default ColorButton;
