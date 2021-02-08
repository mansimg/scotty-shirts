import React from "react";

const SideButton = ({ className, name, shirt, image, setImage, state }) => {
  const imageColor = state.imageColor[0];
  const setImageSide = state.imageSide[1];
  const changeImage = () => {
    const newImage = getField(
      shirt,
      ["colors", imageColor, name],
      shirt.default[name]
    );
    setImage(newImage);
    setImageSide(name);
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
    <p className={className} onClick={changeImage}>
      {name}
    </p>
  );
};

export default SideButton;
