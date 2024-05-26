import React, { useEffect, useState } from "react";
import Auth from "./components/Auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { auth, db, storage } from "./config/firebase";
import { ref, uploadBytes } from "firebase/storage";

const App = () => {
  const [movieList, setMovieList] = useState([]);

  const movieCollectionRef = collection(db, "movies");
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState("");

  const [updatedTitle, setUpdatedTitle] = useState("");
  const [targetId, setTargetId] = useState(null);

  const [fileUpload, setFileUpload] = useState(null);

  async function getMovieList() {
    try {
      const data = await getDocs(movieCollectionRef);
      // console.log(data);
      const filteredData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // console.log(filteredData);
      setMovieList(filteredData);
    } catch (error) {
      alert(error);
    }
  }

  async function onSubmitMovie(e) {
    e.preventDefault();
    try {
      await addDoc(movieCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        userId: auth.currentUser ? auth.currentUser.uid : null,
      });
      setNewMovieTitle("");
      setNewReleaseDate("");
      getMovieList();
    } catch (error) {
      alert(error);
      console.log(error);
    }
  }
  async function deleteMovie(id) {
    try {
      const movieDoc = doc(db, "movies", id);
      await deleteDoc(movieDoc);
      getMovieList();
    } catch (error) {
      alert(error);
    }
  }

  async function updateMovieTitle(id, e) {
    e.preventDefault();
    const movieDoc = doc(db, "movies", id);
    await updateDoc(movieDoc, { title: updatedTitle });
    setUpdatedTitle("");
    getMovieList();
  }
  console.log(auth);
  useEffect(() => {
    getMovieList();
  }, []);

  function handleChange(event) {
    setTargetId(event.target.id);
    setUpdatedTitle(event.target.value);
  }

  async function uploadFile(e) {
    e.preventDefault();
    if (!fileUpload) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      await uploadBytes(filesFolderRef, fileUpload);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div style={{ textAlign: "center" }}>
      <Auth />
      <div>
        {movieList.map((movie) => (
          <div key={movie.id}>
            <h1>{movie.title}</h1>
            <p> Date: {movie.releaseDate} </p>
            <button onClick={() => deleteMovie(movie.id)}>delete</button>
            <form onSubmit={(e) => updateMovieTitle(movie.id, e)}>
              <input
                id={movie.id}
                value={targetId === movie.id ? updatedTitle : ""}
                placeholder="new title..."
                onChange={(event) => handleChange(event)}
              />
              <input type="submit" value="Update Title" />
            </form>
          </div>
        ))}
      </div>

      <br />
      <form onSubmit={onSubmitMovie}>
        <input
          value={newMovieTitle}
          placeholder="Movie title..."
          onChange={(e) => setNewMovieTitle(e.target.value)}
        />
        <input
          value={newReleaseDate}
          placeholder="Release Date..."
          type="number"
          onChange={(e) => setNewReleaseDate(Number(e.target.value))}
        />
        <input type="submit" value="Submit Movie" />
      </form>
      <br />
      <br />
      <form onSubmit={uploadFile}>
        <input type="file" onChange={(e) => setFileUpload(e.target.files[0])} />
        <input type="submit" value="Upload File" />
      </form>
    </div>
  );
};

export default App;
