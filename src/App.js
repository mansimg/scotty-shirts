import React, { useState, useEffect } from "react";

// Components
import Header from "./containers/Header/Header.js";
import Footer from "./containers/Footer/Footer.js";
import HomePage from "./containers/HomePage/HomePage.js";
import AuthPage from "./containers/AuthPage/AuthPage.js";
import DetailsPage from "./containers/DetailsPage/DetailsPage.js";
import PicturePage from "./containers/PicturePage/PicturePage.js";
import ProductsPage from "./containers/ProductsPage/ProductsPage.js";
import ShoppingCartPage from "./containers/ShoppingCartPage/ShoppingCartPage.js";
import NotImplementedPage from "./containers/NotImplementedPage/NotImplementedPage.js";

import CreateYourOwnPage from "./CreateYourOwnPage.js";

// Routes
import appRoutes from "./shared/appRoutes.js";
import firebase from "./firebase/index.js";

// Stylesheet
import "./App.css";
import { Route, Switch, withRouter } from "react-router-dom";

import shirts from "./shared/shirts.js";

// Libraries
import _ from "lodash";

require("dotenv").config();

const App = ({ history }) => {
  const [currShirt, setCurrShirt] = useState(shirts[0]);
  const [items, setItems] = useState([]);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [imageColor, setImageColor] = useState("white");
  const [imageSide, setImageSide] = useState("front");
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("Size");
  const [auth, setAuth] = useState(undefined);
  const [user, setUser] = useState(undefined);
  const [selectedImg, setSelectedImg] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState([]);
  const [numPics, setNumPics] = useState(0);
  const [numResults, setNumResults] = useState(0);
  const [showMoreVisibility, setShowMoreVisibility] = useState(false);

  const state = {
    currShirt: [currShirt, setCurrShirt],
    items: [items, setItems],
    numberOfItems: [numberOfItems, setNumberOfItems],
    imageColor: [imageColor, setImageColor],
    imageSide: [imageSide, setImageSide],
    quantity: [quantity, setQuantity],
    size: [size, setSize],
    auth: [auth, setAuth],
    user: [user, setUser],
    selectedImg: [selectedImg, setSelectedImg],
    searchTerm: [searchTerm, setSearchTerm],
    searchQuery: [searchQuery, setSearchQuery],
    numPics: [numPics, setNumPics],
    numResults: [numResults, setNumResults],
    showMoreVisibility: [showMoreVisibility, setShowMoreVisibility],
  };

  // setting initial items based on user
  useEffect(() => {
    if (user) {
      var oldQueryItems = state.items[0];
      console.log(oldQueryItems);
      oldQueryItems.map((item) => {
        var newItem = { ...item, userId: state.user[0].uid };
        firebase
          .firestore()
          .collection("ShoppingCartItems")
          .doc(item.id)
          .set(newItem);
        return newItem;
      });
    }
    // console.log(queryItems);
    firebase
      .firestore()
      .collection("ShoppingCartItems")
      .where("userId", "==", _.get(user, "uid", 0))
      .onSnapshot(function (querySnapshot) {
        var queryItems = [];
        var queryNum = 0;
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          queryItems.push(doc.data());
          console.log(queryItems);
          queryNum += parseInt(doc.data().quantity);
        });
        setItems(
          _.sortBy(queryItems, (o) => {
            return -1 * o.timeAdded;
          })
        );
        setNumberOfItems(queryNum);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // adding anonymous items to cart when user signs in
  // useEffect(() => {
  // var queryItems = state.items[0];
  // console.log(queryItems);
  // queryItems.map((item) => {
  //   var newItem = [...item, state.user[0].uid];
  //   firebase
  //     .firestore()
  //     .collection("ShoppingCartItems")
  //     .doc(item.id)
  //     .set(newItem);
  //   return newItem;
  // });
  //   // state.items[1]([]);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [auth]);

  // useEffect(() => {
  //   // history.push("/");
  //   console.log(user);
  // }, [user]);
  // // console.log(currShirt);

  // firebase.auth().onAuthStateChanged((user) => {
  //   if (user) {
  //     // User is signed in.
  //     setUser(user);
  //   } else {
  //     // User is signed out.
  //     setUser(undefined);
  //   }
  // });

  return (
    <div>
      <div className="mainContent">
        <Switch>
          <Route exact path={appRoutes.home}>
            <Header history={history} state={state} />
            <HomePage state={state} />
            <Footer history={history} />
          </Route>
          <Route exact path={appRoutes.products}>
            <Header history={history} state={state} />
            <ProductsPage state={state} history={history} />
            <Footer history={history} />
          </Route>
          <Route exact path={appRoutes.details}>
            <Header history={history} state={state} />
            <DetailsPage state={state} history={history} />
            <Footer history={history} />
          </Route>
          <Route exact path={appRoutes.shoppingCart}>
            <Header history={history} state={state} />
            <ShoppingCartPage state={state} history={history} />
            <Footer history={history} />
          </Route>
          <Route exact path={appRoutes.picture}>
            <Header history={history} state={state} />
            <PicturePage state={state} history={history} />
            <Footer history={history} />
          </Route>
          <Route exact path={appRoutes.auth}>
            <Header history={history} state={state} />
            <AuthPage state={state} history={history} />
            <Footer history={history} />
          </Route>
          <Route exact path={appRoutes.createYourOwn}>
            <CreateYourOwnPage />
          </Route>
          <Route>
            <Header history={history} state={state} />
            <NotImplementedPage />
            <Footer history={history} />
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default withRouter(App);
