import React from "react";
import SearchBar from "./SearchBar";
import Shirt from "./Shirt";

const PicturePage = ({ history, state }) => {
  return (
    <div className="picture-container">
      <div className="picture-left-container">
        <Shirt
          history={history}
          state={state}
          selectedImgSrc={state.selectedImg[0]}
          searchTerm={state.searchTerm[0]}
        />
      </div>
      <div className="picture-right-container">
        <div className="search-bar">
          <SearchBar
            history={history}
            state={state}
            setSelectedImg={state.selectedImg[1]}
            searchTerm={state.searchTerm[0]}
            setSearchTerm={state.searchTerm[1]}
          />
        </div>
      </div>
    </div>
  );
};

export default PicturePage;
