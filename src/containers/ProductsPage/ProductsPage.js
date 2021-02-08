import React from "react";
import { withRouter } from "react-router-dom";

import shirts from "../../shared/shirts.js";
import ShirtPanel from "./ShirtPanel.js";

const ProductsPage = ({ state, history }) => {
  let initProducts = () => {
    return shirts.map((shirt) => (
      <ShirtPanel
        state={state}
        shirt={shirt}
        history={history}
        key={shirt.price}
      />
    ));
  };

  return (
    <div>
      <h1 className="page-head">Our T-Shirts</h1>
      <div id="all-shirts" className="all-shirts">
        {initProducts()}
      </div>
    </div>
  );
};

export default withRouter(ProductsPage);
