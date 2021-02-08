import React, { useState } from "react";
import ColorButton from "./ColorButton.js";
import SideButton from "./SideButton.js";

import firebase from "../../firebase/index.js";

const DetailsPage = ({ state, history }) => {
  const currShirt = state.currShirt[0];
  console.log(state.imageColor[0]);
  console.log(state.imageSide[0]);
  const [shirtImage, setShirtImage] = useState(
    getField(
      currShirt,
      ["colors", state.imageColor[0], state.imageSide[0]],
      currShirt.default.front
    )
  );

  console.log(state);

  const sizes = [
    "Size",
    "Women’s XS",
    "Women’s S",
    "Women’s M",
    "Women’s L",
    "Women’s XL",
    "Women’s 2XL",
    "Men’s XS",
    "Men’s S",
    "Men’s M",
    "Men’s L",
    "Men’s XL",
    "Men’s 2XL",
  ];

  return (
    <div id="shirt-box" className="shirt-box">
      <h1 className="page-head">
        {getField(currShirt, ["name"], "Name not found")}
      </h1>
      <div className="page-body-details">
        <img
          className="shirt-img-details"
          src={shirtImage}
          key="front"
          alt="Shirt"
        ></img>
        <div>
          <h1 className="shirt-text-details">
            {getField(currShirt, ["price"], "Out of stock")}
          </h1>
          <h3 className="shirt-text-details">
            {getField(currShirt, ["description"], "Description not found")}
          </h3>
          <div>
            <div className="side-container">
              <p className="side-label">Side: </p>
              <SideButton
                className="front-button"
                name="front"
                shirt={currShirt}
                image={shirtImage}
                setImage={setShirtImage}
                state={state}
                history={history}
              />
              <SideButton
                className="back-button"
                name="back"
                shirt={currShirt}
                image={shirtImage}
                setImage={setShirtImage}
                state={state}
                history={history}
              />
            </div>
            <div className="color-container">
              <p className="color-label">Color: </p>
              {Object.keys(getField(currShirt, ["colors"], [])).map((color) => (
                <ColorButton
                  key={color}
                  className={`button-color`}
                  name={`${color}`}
                  shirt={currShirt}
                  image={shirtImage}
                  setImage={setShirtImage}
                  state={state}
                  history={history}
                />
              ))}
            </div>
            <div className="quantity-container">
              <p className="quantity-label">Quantity: </p>
              <div className="custom-select" style={{ width: "200px" }}>
                <select
                  className="quantity-dropdown"
                  onChange={(e) => {
                    state.quantity[1](e.target.value);
                  }}
                  value={state.quantity[0]}
                >
                  {Array.from(Array(20), (x, i) => i + 1).map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="size-container">
              <p className="size-label">Size: </p>
              <select
                className="size-dropdown"
                onChange={(e) => {
                  state.size[1](e.target.value);
                }}
                value={state.size[0]}
              >
                {sizes.map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </div>
            <div className="add-cart-container">
              <p
                className={
                  state.size[0] === "Size" ||
                  getField(currShirt, ["price"], "Out of stock") ===
                    "Out of stock"
                    ? "disabled-add-cart-button"
                    : "add-cart-button"
                }
                onClick={() => {
                  if (
                    state.size[0] === "Size" ||
                    getField(currShirt, ["price"], "Out of stock") ===
                      "Out of stock"
                  ) {
                    return;
                  } else {
                    const items = state.items[0];
                    const shirtId =
                      state.quantity[0] +
                      state.size[0] +
                      state.imageSide[0] +
                      state.imageColor[0] +
                      Math.random();
                    var cartItem = {
                      id: shirtId,
                      shirt: currShirt,
                      side: state.imageSide[0],
                      color: state.imageColor[0],
                      quantity: state.quantity[0],
                      size: state.size[0],
                      img: shirtImage,
                      isCustom: false,
                      userId: 0,
                      timeAdded: Date.now(),
                    };
                    items.unshift(cartItem);
                    state.items[1](items);
                    state.numberOfItems[1](
                      parseInt(state.numberOfItems[0]) +
                        parseInt(state.quantity[0])
                    );

                    if (state.auth[0]) {
                      // add item to firestore
                      let cartItemRef = firebase
                        .firestore()
                        .collection("ShoppingCartItems")
                        .doc(shirtId);

                      cartItem = {
                        ...cartItem,
                        userId: state.user[0].uid,
                      };
                      cartItemRef.set(cartItem);
                    }

                    // reset items
                    state.imageSide[1]("front");
                    state.imageColor[1]("white");
                    state.quantity[1](1);
                    state.size[1]("Size");
                    history.push("/shopping_cart");
                  }
                }}
              >
                Add to Cart
              </p>
            </div>
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

export default DetailsPage;
