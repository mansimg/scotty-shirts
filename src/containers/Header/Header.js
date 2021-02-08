import React from "react";

import logo from "../../assets/images/logo.png";
import cart from "../../assets/images/cart.png";

import "./Header.css";

const Header = ({ history, state }) => {
  return (
    <div>
      <div className="rectangle"></div>
      <div className="pageHeader">
        <img
          className="logo"
          src={logo}
          alt="Scotty Logo"
          onClick={() => {
            history.push("/");
          }}
        />
        <h1 className="pageTitle">Scotty Shirts U Illustrate (SSUI)</h1>
        <div
          className="cart-container"
          onClick={() => {
            history.push("/shopping_cart");
          }}
        >
          <img className="cart" src={cart} alt="Shopping Cart" />
          <p className="cart-label">{state.numberOfItems[0]}</p>
        </div>
      </div>
      <div className="topnav">
        <p
          onClick={() => {
            history.push("/products");
          }}
        >
          T-SHIRTS
        </p>
        <p
          onClick={() => {
            history.push("/create_from_picture");
          }}
        >
          CREATE FROM PICTURE
        </p>
        <p
          onClick={() => {
            history.push("/create_your_own");
          }}
        >
          CREATE YOUR OWN
        </p>
        <p
          onClick={() => {
            history.push("/not_implemented");
          }}
        >
          ABOUT US
        </p>
        <p
          onClick={() => {
            history.push("/auth");
          }}
        >
          {state.user[0] ? state.user[0].displayName : "Log In"}
        </p>
      </div>
    </div>
  );
};

export default Header;
