import React from "react";

// Images
import homePic from "../../assets/images/banner.png";

const HomePage = () => {
  return (
    <div>
      <img
        className="homePic"
        src={homePic}
        alt="Home Graphic"
        href="/index.html"
      />
      <div className="page-body">
        <div className="textBox">
          <h1 className="textBoxTitle">We don't ship. We're not real.</h1>
          <p className="textBoxBody">
            We sell shirts. We are passionate about selling shirts. But keep in
            mind that we have no infrastructure, supply chain or mechanism to
            actually produce these shirts or fulfill the orders. But the shirts
            will always be real in your imagination.
          </p>
        </div>
        <div className="textBox">
          <h1 className="textBoxTitle">
            Design your own shirt! But help us do that...
          </h1>
          <p className="textBoxBody">
            Not only do we not sell shirts, but we let you design your own!
            Eventually. We actually kinda need your help implementing that. If
            you could build an actual paint-style interface that you can make
            designs in that would be great :)
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
