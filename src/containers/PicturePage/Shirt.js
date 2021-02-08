import React from "react";

import blankShirt from "../../assets/images/shirt-base.png";

import firebase from "../../firebase/index.js";

const Shirt = ({ history, state, selectedImgSrc, searchTerm }) => {
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
  const newShirt = {
    name: searchTerm,
    description: "new custom shirt",
    price: "$20.00",
    colors: {},
    default: {
      front: blankShirt,
      back: blankShirt,
    },
  };
  const generatePic = () => {
    if (selectedImgSrc) {
      return (
        <img
          src={selectedImgSrc}
          className="picture-image"
          alt="selectedImg"
        ></img>
      );
    }
  };
  const generateShirt = () => {
    return (
      <div className="picture-shirt-page">
        <img src={blankShirt} alt="Shirt base" className="picture-shirt"></img>
        {generatePic()}
      </div>
    );
  };
  return (
    <>
      <div>
        <div className="picture-shirt-page">{generateShirt()}</div>
      </div>
      <div className="picture-price-container">
        <p className="picture-price">$20.00</p>
      </div>
      <div className="picture-quantity-container">
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
      <div className="picture-size-container">
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
            state.size[0] === "Size" || !selectedImgSrc
              ? "disabled-add-cart-button"
              : "add-cart-button"
          }
          onClick={() => {
            if (state.size[0] === "Size" || !selectedImgSrc) {
              return;
            } else {
              const items = state.items[0];
              let shirtId =
                state.quantity[0] +
                state.size[0] +
                state.imageSide[0] +
                state.imageColor[0] +
                Math.random();
              let cartItem = {
                id: shirtId,
                shirt: newShirt,
                side: state.imageSide[0],
                color: state.imageColor[0],
                quantity: state.quantity[0],
                size: state.size[0],
                img: selectedImgSrc,
                isCustom: true,
                userId: 0,
                timeAdded: Date.now(),
              };
              items.unshift(cartItem);
              state.items[1](items);
              state.numberOfItems[1](
                parseInt(state.numberOfItems[0]) + parseInt(state.quantity[0])
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
    </>
  );
};

export default Shirt;
