import React from "react";

const Footer = ({ history }) => {
  return (
    <div className="footnav">
      <p
        onClick={() => {
          history.push("/not_implemented");
        }}
      >
        Contact Us
      </p>
      <p
        onClick={() => {
          history.push("/not_implemented");
        }}
      >
        Site Map
      </p>
      <p
        onClick={() => {
          history.push("/not_implemented");
        }}
      >
        Privacy Policy
      </p>
      <p
        onClick={() => {
          history.push("/not_implemented");
        }}
      >
        Careers
      </p>
      <p
        onClick={() => {
          history.push("/not_implemented");
        }}
      >
        Reviews
      </p>
      <p className="author">Designed by Mansi Gandhi</p>
    </div>
  );
};

export default Footer;
