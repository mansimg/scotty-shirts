import React from "react";

const OrderSummaryPanel = ({ items, history }) => {
  const addMoney = (priceA, priceB, num) => {
    return (
      "$" +
      (
        parseFloat(priceA.substring(1)) +
        parseInt(num) * parseFloat(priceB.substring(1))
      ).toFixed(2)
    );
  };
  const cost = items.reduce((a, e) => {
    console.log(addMoney(a, e.shirt.price));
    return addMoney(a, e.shirt.price, e.quantity);
  }, "$0");

  const shippingCost = items.length === 0 ? "$0" : "$6.95";
  return (
    <div>
      <div className="orderpanel-mainpanel">
        <h1 className="orderpanel-header">Order Summary</h1>
        <div className="orderpanel-body-container">
          <div className="orderpanel-body-left">
            <h3 className="orderpanel-summary-left">Summary:</h3>
            <h3 className="orderpanel-ship-left">Est. Shipping:</h3>
            <h2 className="orderpanel-total-left">Total:</h2>
          </div>
          <div className="orderpanel-body-right">
            <h3 className="orderpanel-summary-right">{cost}</h3>
            <h3 className="orderpanel-ship-right">{shippingCost}</h3>
            <hr className="orderpanel-hr"></hr>
            <h2 className="orderpanel-total-right">
              {addMoney(cost, shippingCost, 1)}
            </h2>
          </div>
        </div>
        <p
          className="orderpanel-checkout"
          onClick={() => {
            history.push("not_implemented");
          }}
        >
          Sign in and Checkout
        </p>
      </div>
      <p
        className="orderpanel-shopping"
        onClick={() => {
          history.push("products");
        }}
      >
        Continue Shopping
      </p>
    </div>
  );
};

export default OrderSummaryPanel;
