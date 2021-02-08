import React, { useState, useEffect, useRef } from "react";
import Unsplash, { toJson } from "unsplash-js";
// import tempResults from "./tempResults.json";

require("dotenv").config();

const SearchBar = ({
  history,
  state,
  setSelectedImg,
  searchTerm,
  setSearchTerm,
}) => {
  const pics = state.searchQuery[0];
  const setPics = state.searchQuery[1];
  const numPics = state.numPics[0];
  const setNumPics = state.numPics[1];
  const numResults = state.numResults[0];
  const setNumResults = state.numResults[1];
  const showMoreVisibility = state.showMoreVisibility[0];
  const setShowMoreVisibility = state.showMoreVisibility[1];

  const [searchOptions, setSearchOptions] = useState({});

  const isMounted = useRef(false);

  const unsplash = new Unsplash({
    accessKey: process.env.REACT_APP_UNSPLASH_API_KEY,
  });

  const displayPics = async (e) => {
    e.preventDefault();
    if (numPics === 1) {
      setSearchOptions({});
      // fetchData();
    }
    setNumPics(1);
    setShowMoreVisibility(true);
  };

  const displayMorePics = async (e) => {
    e.preventDefault();
    setNumPics(numPics + 1);
    setShowMoreVisibility(true);
  };

  const generateDisplayMore = () => {
    if (showMoreVisibility && numPics < numResults) {
      return (
        <div className="show-more-button" onClick={displayMorePics}>
          <p className="show-more-text">Display More</p>
        </div>
      );
    } else {
      return (
        <div className="show-more-button-disabled">
          <p className="show-more-text-disabled">Display More</p>
        </div>
      );
    }
  };

  const fetchData = async () => {
    if (isMounted.current) {
      console.log("fetching data");
      console.log(searchOptions);
      unsplash.search
        .photos(searchTerm, numPics, 10, searchOptions)
        .then(toJson)
        .then((json) => {
          if (numPics === 1) {
            setPics(json.results);
          } else {
            var oldPics = pics.concat(json.results);
            setPics(oldPics);
          }
          setNumResults(json.total_pages);
        });
    } else {
      isMounted.current = true;
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numPics, searchOptions]);

  //testing
  useEffect(() => {
    console.log(pics);
  }, [pics]);

  // useEffect(() => {
  //   setSearchOptions({});
  // }, [searchTerm]);

  return (
    <>
      <div className="search-container">
        <form onSubmit={displayPics}>
          <input
            type="text"
            placeholder="Search for pictures"
            className="search-text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-button">
            <p className="search-button-text">Search</p>
          </button>
        </form>
      </div>
      {pics.length !== 0 ? (
        <div className="results-container">
          <div className="augment-bar">
            <p className="sort-label-search">Sort by:</p>
            <select
              className="sort-dropdown-search"
              onChange={(e) => {
                console.log(e.target.value);
                setSearchOptions({ ...searchOptions, orderBy: e.target.value });
              }}
            >
              <option value="relevant" className="sort-value-search">
                Relevant
              </option>
              <option value="latest" className="sort-value-search">
                Latest
              </option>
            </select>
            <p className="color-label-search">Color:</p>
            <select
              className="color-dropdown-search"
              onChange={(e) => {
                console.log(e.target.value);
                setSearchOptions({ ...searchOptions, color: e.target.value });
              }}
            >
              <option value="black" className="color-value-search">
                Black
              </option>
              <option value="white" className="color-value-search">
                White
              </option>
              <option value="yellow" className="color-value-search">
                Yellow
              </option>
              <option value="orange" className="color-value-search">
                Orange
              </option>
              <option value="red" className="color-value-search">
                Red
              </option>
              <option value="purple" className="color-value-search">
                Purple
              </option>
              <option value="magenta" className="color-value-search">
                Magenta
              </option>
              <option value="green" className="color-value-search">
                Green
              </option>
              <option value="teal" className="color-value-search">
                Teal
              </option>
              <option value="blue" className="color-value-search">
                Blue
              </option>
            </select>
            <p className="orientation-label-search">Orientation:</p>
            <select
              className="orientation-dropdown-search"
              onChange={(e) => {
                console.log(e.target.value);
                setSearchOptions({
                  ...searchOptions,
                  orientation: e.target.value,
                });
              }}
            >
              <option value="landscape" className="orientation-value-search">
                Landscape
              </option>
              <option value="portrait" className="orientation-value-search">
                Portrait
              </option>
              <option value="squarish" className="orientation-value-search">
                Squarish
              </option>
            </select>
          </div>

          <div className="image-list-container">
            {generateDisplayMore()}
            <div className="image-list">
              {pics.map((pic) => (
                <div
                  className="image-container"
                  key={pic.id}
                  onClick={(e) => setSelectedImg(e.target.src)}
                >
                  <img
                    className="image"
                    alt={pic.alt_description}
                    src={pic.urls.regular}
                  ></img>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p className="search-no-results">
            No search results. Maybe try a Scotty?
          </p>
        </div>
      )}
    </>
  );
};

export default SearchBar;
