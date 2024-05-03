import React, { useState, FormEvent, useEffect } from "react";
import "./App.css";
import logoImg from "./assets/logo.jpeg";
import fetchDataFromApi from "./utils/fetchData";
const BASE_URL = "http://localhost:8080";
let currentBreed = "";
let currentNumOfPictures = "";

function App() {
  const [breed, setBreed] = useState("");
  const [numOfPictures, setNumOfPictures] = useState("");
  const [didEdit, setDidEdit] = useState(false);
  const [pictures, setPictures] = useState([] as string[]);
  const [breedList, setBreedList] = useState([] as string[]);
  const [isValidBreed, setIsValidBreed] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    currentBreed = breed;
    currentNumOfPictures = numOfPictures;

    if (isValidBreed) {
      const requestData = { breed, numOfPictures };
      const url = `${BASE_URL}/search-pictures`;
      
      const data = await fetchDataFromApi({
        url,
        method: "POST",
        body: requestData,
      });
      setPictures(data.images);
      setBreed("");
      setNumOfPictures("");
    } else {
      console.error("Invalid breed");
    }
    setShowContent(true);

    // if(isValidBreed) {
    //   const res = await fetch("http://localhost:8080/search-pictures", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ breed, numOfPictures }),
    // });
    // const data = await res.json();
    // setPictures(data.images);
    // setBreed("");
    // setNumOfPictures("");
    // } else {
    //   console.error("Invalid breed");
    // }
    // setShowContent(true)
  };

  const fetchBreedList = async () => {
    const url = `${BASE_URL}/search-breeds`;

    const data = await fetchDataFromApi({url, method: 'GET'});
    setBreedList(data.breeds);
  };

  useEffect(() => {
    fetchBreedList();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setBreed(value);
    setDidEdit(true);
    const isValid = breedList.includes(value);
    setIsValidBreed(isValid);
  };

  // const breedIsInvalid = breed.trim() === '' && didEdit;

  const handleClose = (picture: string) => {
    const newPics = pictures.filter((item) => item !== picture);
    setPictures(newPics);
    setShowButton(true);
  };

  const handleGenerateMorePictures = async () => {
    if (pictures.length !== parseInt(currentNumOfPictures, 10)) {
      const eliminatePics =
        parseInt(currentNumOfPictures, 10) - pictures.length;
      const requiredPics = parseInt(currentNumOfPictures, 10) - eliminatePics;

      const url = `${BASE_URL}/search-pictures`;
      const requestData = {
        breed: currentBreed,
        numOfPictures: requiredPics,
      };

      const data = await fetchDataFromApi({
        url,
        method: "POST",
        body: requestData,
      });

      setPictures([...pictures, ...data.images]);
    }
  };

  return (
    <div>
      <header>
        <img src={logoImg} alt="A dog taking pictures" />
        <h1>Dog Pictures</h1>
      </header>
      <form onSubmit={handleSubmit}>
        <h2>Get cute pictures</h2>

        <div className="control-row">
          <div className="control no-margin">
            <label htmlFor="input1">Breed: </label>
            <input
              type="text"
              id="input1"
              // onBlur={handleInputBlur}
              value={breed}
              onChange={handleInputChange}
              required
            />
            <div className="control-error">
              {didEdit && !isValidBreed && <p>Please enter a valid breed.</p>}
            </div>
          </div>
          <div className="control no-margin">
            <label htmlFor="input2">Number of Pictures: </label>
            <input
              type="number"
              id="input2"
              value={numOfPictures}
              onChange={(e) => setNumOfPictures(e.target.value)}
              required
              min={1}
            />
          </div>
        </div>

        <p className="form-actions">
          <button className="button">Send</button>
        </p>
      </form>
      {showContent && (
        <div className="gallery">
          <h2>Gallery</h2>
          <div className="gallery-container">
            {pictures.map((picture, index) => (
              <div className="tocloseimage">
                <span className="close" onClick={() => handleClose(picture)}>
                  &times;
                </span>
                <img key={index} src={picture} alt="dog" className="image" />
              </div>
            ))}
          </div>
        </div>
      )}
      {showButton && (
        <div className="control-button">
          <p className="form-actions">
            <button onClick={handleGenerateMorePictures} className="button">
              Generate more pics
            </button>
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
