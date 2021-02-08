import React from "react";

import ShoppingCartItem from "./ShoppingCartItem.js";
import OrderSummaryPanel from "./OrderSummaryPanel.js";

// import firebase from "../../firebase/index.js";

import _ from "lodash";

// import BeepBoopWhiteFront from "../../assets/shirt_images/beepboop-white-front.png";
// import CarBlueFront from "../../assets/shirt_images/car-blue-front.png";

const ShoppingCartPage = ({ state, history }) => {
  //   const shirts = [
  //     {
  //       shirt: {
  //         name: "BEEEPBOOP",
  //         price: "$19.99",
  //       },
  //       side: "front",
  //       color: "white",
  //       quantity: 5,
  //       size: "Women's XS",
  //       img: BeepBoopWhiteFront,
  //     },
  //     {
  //       shirt: {
  //         name: "Carnegie Mellon",
  //         price: "$9.99",
  //       },
  //       side: "front",
  //       color: "blue",
  //       quantity: 2,
  //       size: "Men's XL",
  //       img: CarBlueFront,
  //     },
  //   ];
  const items = state.items[0];

  // .onSnapshot((querySnapshot) => {
  //   // console.log(querySnapshot);
  //   console.log("HELLO");
  //   querySnapshot.forEach((doc) => {
  //     console.log(doc);
  //     items.push(doc);
  //   });
  //   // var cities = [];
  //   // querySnapshot.forEach(function (doc) {
  //   //   cities.push(doc.data().name);
  // });
  // return cities;
  // console.log("Current cities in CA: ", cities.join(", "));
  // });

  console.log(_.get(state.user[0], "uid", 0));

  return (
    <div className="shopcart-container">
      <h1 className="shopcart-header">My Cart ({state.numberOfItems[0]})</h1>
      <div className="shopcart-body">
        <div className="shopcart-body-left">
          {items.length === 0 ? (
            <h1 className="empty-message">Your cart is empty.</h1>
          ) : (
            items.map((item) => (
              <ShoppingCartItem
                history={history}
                state={state}
                shirt={item}
                key={item.id}
              />
            ))
          )}
        </div>
        <div className="shopcart-body-right">
          <OrderSummaryPanel history={history} items={items} />
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartPage;
