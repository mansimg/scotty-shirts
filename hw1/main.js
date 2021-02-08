// NOTE: The variable "shirts" is defined in the shirts.js file as the full list of shirt offerings
//       You can access this variable here, and should use this variable here to build your webpages

let createElement = (type, className) => {
  var elem = document.createElement(type);
  elem.className = className;
  return elem;
};

let getField = (name, path, defaultValue) => {
  var item = name;
  for (var i = 0; i < path.length; i++) {
    item = item[path[i]];
    if (item == null || item == undefined) {
      return defaultValue;
    }
  }
  return item;
};

let initProducts = () => {
  var allShirts = document.getElementById("all-shirts");
  shirts.map((shirt) => allShirts.appendChild(getPanel(shirt)));
};

let getPanel = (shirt) => {
  var panel = createElement("div", "shirt-panel");

  var imgLink = document.createElement("a");
  imgLink.href = "./details.html";
  var shirtImg = createElement("img", "shirt-img");
  shirtImg.onclick = (e) => {
    localStorage.setItem("shirt", JSON.stringify(shirt));
  };
  shirtImg.onerror = () => {
    shirtImg.onerror = null;
    shirtImg.src = shirt.default.front;
  };
  shirtImg.src = getField(
    shirt,
    ["colors", "white", "front"],
    shirt.default.front
  );
  imgLink.appendChild(shirtImg);
  panel.appendChild(imgLink);

  var title = createElement("h2", "shirt-title");
  var titleString = document.createTextNode(
    getField(shirt, ["name"], "Name not found")
  );
  title.appendChild(titleString);
  panel.appendChild(title);

  var shirtColors = createElement("p", "shirt-colors");
  var numColors = Object.keys(getField(shirt, ["colors"], [])).length;
  var colorsString = document.createTextNode(
    "Available in " + numColors + (numColors == 1 ? " color" : " colors")
  );
  shirtColors.appendChild(colorsString);
  panel.appendChild(shirtColors);

  var quickViewButton = createElement("p", "shirt-button");
  quickViewButton.onclick = (e) => {
    toggleQuickView(shirt);
  };
  quickViewButton.appendChild(document.createTextNode("Quick View"));

  var seePageLink = document.createElement("a");
  seePageLink.href = "./details.html";
  var seePageButton = createElement("p", "shirt-button");
  seePageButton.onclick = (e) => {
    localStorage.setItem("shirt", JSON.stringify(shirt));
  };
  seePageButton.appendChild(document.createTextNode("See Page"));
  seePageLink.appendChild(seePageButton);

  var buttons = createElement("div", "shirt-buttons");
  buttons.appendChild(quickViewButton);
  buttons.appendChild(seePageLink);
  panel.appendChild(buttons);

  return panel;
};

let initDetails = () => {
  var shirt = JSON.parse(localStorage.getItem("shirt"));

  var titleText = document.createTextNode(
    getField(shirt, ["name"], "Name not found")
  );
  var title = createElement("h1", "page-head");
  title.appendChild(titleText);

  var body = createElement("div", "page-body-details");

  var shirtImg = createElement("img", "shirt-img-details");
  shirtImg.onerror = () => {
    shirtImg.onerror = null;
    shirtImg.src = shirt.default.front;
  };
  shirtImg.src = getField(
    shirt,
    ["colors", "white", "front"],
    shirt.default.front
  );
  body.appendChild(shirtImg);

  localStorage.setItem("side", "front");
  localStorage.setItem("color", "white");

  var shirtInfo = document.createElement("div");

  var price = createElement("h1", "shirt-text-details");
  var priceText = document.createTextNode(
    getField(shirt, ["price"], "Out of stock")
  );
  price.appendChild(priceText);

  var desc = createElement("h3", "shirt-text-details");
  var descText = document.createTextNode(
    getField(shirt, ["description"], "Description not found")
  );
  desc.appendChild(descText);

  shirtInfo.appendChild(price);
  shirtInfo.appendChild(desc);

  var sideContainer = createElement("div", "side-container");

  var sideLabel = createElement("p", "side-label");
  sideLabel.appendChild(document.createTextNode("Side: "));
  sideContainer.appendChild(sideLabel);

  var frontButton = createButton("front-button", "front");
  var backButton = createButton("back-button", "back");
  sideContainer.appendChild(frontButton);
  sideContainer.appendChild(backButton);

  var colorContainer = createElement("div", "color-container");

  var colorLabel = createElement("p", "color-label");

  colorLabel.appendChild(document.createTextNode("Color: "));
  colorContainer.appendChild(colorLabel);

  Object.keys(getField(shirt, ["colors"], [])).map((color) => {
    var colorButton = createColorButton(`button-color`, color);
    colorContainer.appendChild(colorButton);
  });

  var buttonContainer = document.createElement("div");
  buttonContainer.append(sideContainer);
  buttonContainer.append(colorContainer);

  shirtInfo.appendChild(buttonContainer);
  body.appendChild(shirtInfo);

  var panel = document.getElementById("shirt-box");
  panel.appendChild(title);
  panel.appendChild(body);
};

let createButton = (buttonName, text) => {
  var button = createElement("p", buttonName);
  button.onclick = (e) => {
    changeImgSide(text);
  };
  button.appendChild(document.createTextNode(text));
  return button;
};
let createColorButton = (buttonName, text) => {
  var button = createElement("p", buttonName);
  button.style.backgroundColor = text;
  button.onclick = (e) => {
    changeImgColor(text);
  };
  button.appendChild(document.createTextNode(text));
  return button;
};
let changeImgSide = (side) => {
  var img = document.getElementsByClassName("shirt-img-details")[0];
  var color = localStorage.getItem("color");
  img.onerror = () => {
    img.onerror = null;
    img.src = shirt.default[side];
  };
  img.src = getField(shirt, ["colors", color, side], shirt.default[side]);
  localStorage.setItem("side", side);
};
let changeImgColor = (color) => {
  var img = document.getElementsByClassName("shirt-img-details")[0];
  var side = localStorage.getItem("side");
  img.onerror = () => {
    img.onerror = null;
    img.src = shirt.default[side];
  };
  img.src = getField(shirt, ["colors", color, side], shirt.default[side]);
  localStorage.setItem("color", color);
};

let toggleQuickView = (shirt) => {
  var quickView = document.getElementById("quick-view");
  if (!document.getElementById("quick-view-body")) {
    var quickViewBody = createElement("div", "quick-view-body");
    quickViewBody.id = "quick-view-body";

    var imgFront = createElement("img", "quick-view-img");
    imgFront.onerror = () => {
      imgFront.onerror = null;
      imgFront.src = shirt.default.front;
    };
    imgFront.src = getField(
      shirt,
      ["colors", "white", "front"],
      shirt.default.front
    );
    var imgBack = createElement("img", "quick-view-img");
    imgBack.onerror = () => {
      imgBack.onerror = null;
      imgBack.src = shirt.default.back;
    };
    imgBack.src = getField(
      shirt,
      ["colors", "white", "back"],
      shirt.default.back
    );

    var textBody = createElement("div", "quick-view-text-body");

    var title = createElement("h1", "quick-view-title");
    var titleText = document.createTextNode(
      getField(shirt, ["name"], "Name not found")
    );
    title.appendChild(titleText);

    var price = createElement("h1", "shirt-text-quickview");
    var priceText = document.createTextNode(
      getField(shirt, ["price"], "Out of stock")
    );
    price.appendChild(priceText);

    var desc = createElement("h3", "shirt-text-quickview");
    var descText = document.createTextNode(
      getField(shirt, ["description"], "Description not found")
    );
    desc.appendChild(descText);

    var button = createElement("p", "close-button");
    button.onclick = (e) => {
      toggleQuickView(shirt);
    };
    button.appendChild(document.createTextNode("Close"));

    textBody.appendChild(title);
    textBody.appendChild(price);
    textBody.appendChild(desc);
    textBody.appendChild(button);

    quickViewBody.appendChild(imgFront);
    quickViewBody.appendChild(imgBack);
    quickViewBody.appendChild(textBody);

    quickView.appendChild(quickViewBody);
  } else {
    var quickViewBody = document.getElementById("quick-view-body");
    quickView.removeChild(quickViewBody);
  }
};
