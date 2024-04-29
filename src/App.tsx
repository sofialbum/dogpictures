import React, { useState, FormEvent, useEffect } from "react";
import "./App.css";
import logoImg from "./assets/logo.jpeg";

function App() {
  const [breed, setBreed] = useState("");
  const [numOfPictures, setNumOfPictures] = useState("");
  const [didEdit, setDidEdit] = useState(false);
  const [pictures, setPictures] = useState([] as string[]);
  const [breedList, setBreedList] = useState([] as string[]);
  const [isValidBreed, setIsValidBreed] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(breed);
    console.log(numOfPictures);

    if(isValidBreed) {
      const res = await fetch("http://localhost:8080/search-pictures", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ breed, numOfPictures }),
    });
    const data = await res.json();
    setPictures(data.images);
    setBreed("");
    setNumOfPictures("");
    } else {
      console.error("Invalid breed");
    }
    setShowContent(true)
  };

  const fetchBreedList = async () => {
    const res = await fetch("http://localhost:8080/search-breeds");
    const data = await res.json();
    setBreedList(data.breeds);
  };

  useEffect(() => {
    fetchBreedList();
  }, []);
  
  console.log(breedList);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setBreed(value);
    setDidEdit(true);
    // setBreed(event.target.value);
    const isValid = breedList.includes(value);
    setIsValidBreed(isValid);
  };
  console.log(breedList);

  // const breedIsInvalid = breed.trim() === '' && didEdit;

  const handleClose = (picture: string) => {
    const newPics = pictures.filter(item =>  item !== picture);
    setPictures(newPics);
  }


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
          <div className='gallery-container'>
            {pictures.map((picture, index) => (
              <div className="tocloseimage">
                <span className="close" onClick={() => handleClose(picture)} >&times;</span>
                <img key={index} src={picture} alt="dog" className="image" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
