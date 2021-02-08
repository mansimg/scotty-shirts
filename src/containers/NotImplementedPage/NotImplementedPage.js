import React from "react";

import scottyError from "../../assets/images/scotty.png";

const NotImplementedPage = () => {
  return (
    <div>
      <img className="scotty" src={scottyError} alt="Scotty Error"></img>
      <h2 className="error-text">
        Oops, this page doesn't exist yet... how about a shirt from the last
        page?
      </h2>
    </div>
  );
};

export default NotImplementedPage;
