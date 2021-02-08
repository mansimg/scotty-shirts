import React, { useState } from "react";

import firebase from "../../firebase/index.js";

import blankShirt from "../../assets/images/shirt-base.png";

const ShoppingCartItem = ({ history, state, shirt }) => {
  const url = shirt.shirt.name.split(" ").join("");
  const [shirtQuantity, setShirtQuantity] = useState(shirt.quantity);
  const [visibility, setVisibility] = useState(true);
  const generatePic = (img) => {
    if (img) {
      return (
        <img
          src={img}
          className="picture-image"
          alt="selectedImg"
          onClick={() => {
            history.push("/create_from_picture");
          }}
        ></img>
      );
    }
  };
  const generateShirt = (img) => {
    return (
      <div className="picture-shirt-page">
        <img
          src={blankShirt}
          alt="Shirt base"
          className="picture-shirt"
          onClick={() => {
            history.push("/create_from_picture");
          }}
        ></img>
        {generatePic(img)}
      </div>
    );
  };
  const generateImg = () => {
    if (!shirt.isCustom) {
      return (
        <img
          className={"cart-item-img"}
          src={getField(
            shirt.shirt,
            ["colors", shirt.color, "front"],
            getField(
              shirt.shirt,
              ["colors", "white", "front"],
              shirt.shirt["default"]["front"]
            )
          )}
          onClick={() => {
            state.imageSide[1](shirt.side);
            state.imageColor[1](shirt.color);
            state.quantity[1](shirt.quantity);
            state.size[1](shirt.size);
            history.push(`/details/${url}`);
          }}
          alt={shirt.shirt["name"]}
        ></img>
      );
    } else {
      console.log(shirt);
      return generateShirt(shirt.img);
    }
  };
  if (!visibility) {
    return;
  }
  return (
    <div>
      <hr className="cart-item-hr"></hr>
      <h2 className="cart-item-header">{shirt.shirt["name"]}</h2>
      <div className="cart-item-body">
        <div className="cart-item-body-left">{generateImg()}</div>
        <div className="cart-item-body-right">
          <div className="cart-item-quantity-container">
            <p className="quantity-label">Quantity: </p>
            <div className="custom-select" style={{ width: "200px" }}>
              <select
                className="quantity-dropdown"
                onChange={(e) => {
                  // update database
                  var shirtRef = firebase
                    .firestore()
                    .collection("ShoppingCartItems")
                    .doc(shirt.id);

                  // set quantity
                  shirtRef.update({
                    quantity: e.target.value,
                  });

                  // is this still necessary?
                  state.numberOfItems[1](
                    parseInt(state.numberOfItems[0]) +
                      (parseInt(e.target.value) - shirtQuantity)
                  );
                  setShirtQuantity(e.target.value);
                  let new_array = state.items[0].map((element) =>
                    element.id === shirt.id
                      ? { ...element, quantity: e.target.value }
                      : element
                  );

                  state.items[1](new_array);
                }}
                value={shirtQuantity}
              >
                {Array.from(Array(20), (x, i) => i + 1).map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="cart-item-color-container">
            <p className="color-label">Color:</p>
            <p className="color-label-value">{shirt.color}</p>
          </div>
          <div className="cart-item-size-container">
            <p className="size-label">Size:</p>
            <p className="size-label-value">{shirt.size}</p>
          </div>
          <div className="cart-item-price-container">
            <p className="price-label">Price (each):</p>
            <p className="price-label-value">{shirt.shirt["price"]}</p>
          </div>
          <div className="cart-item-remove-container">
            <p
              className="remove-label"
              onClick={() => {
                firebase
                  .firestore()
                  .collection("ShoppingCartItems")
                  .doc(shirt.id)
                  .delete()
                  .then(function () {
                    console.log("Document successfully deleted!");
                  });
                state.numberOfItems[1](
                  parseInt(state.numberOfItems[0]) + -shirtQuantity
                );
                setShirtQuantity(0);
                let new_array = state.items[0]
                  .map((element) =>
                    element.id === shirt.id ? undefined : element
                  )
                  .filter((elem) => {
                    return elem !== undefined;
                  });

                state.items[1](new_array);
                setVisibility(false);
              }}
            >
              Remove
            </p>
          </div>
        </div>
      </div>
    </div>
  );
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

export default ShoppingCartItem;
