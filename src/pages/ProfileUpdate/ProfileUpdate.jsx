import React, { useContext, useEffect, useState } from 'react';
import './ProfileUpdate.css';
import assets from '../../assets/assets';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import upload from '../../lib/upload';
import { AppContext } from '../../context/AppContext';

function ProfileUpdate() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const { setUserData } = useContext(AppContext);

  const profileUpdate = async (event) => {
    event.preventDefault();
    try {
      if (!name.trim() || !bio.trim()) {
        toast.error("Name and bio cannot be empty");
        return;
      }

      const docRef = doc(db, 'users', uid);

      let updatedData = { bio, name };

      if (image) {
        const imgUrl = await upload(image);
        updatedData.avatar = imgUrl;
        setPrevImage(imgUrl);
      }

      await updateDoc(docRef, updatedData);

      const snap = await getDoc(docRef);
      setUserData(snap.data());
      toast.success("Profile updated successfully");
      navigate('/chat');
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || "");
          setBio(data.bio || "");
          setPrevImage(data.avatar || "");
        }
      } else {
        navigate('/');
      }
    });
  }, [navigate]);

  return (
    <div className='profile'>
      <div className="profile-container">
        <form onSubmit={profileUpdate}>
          <h3>Profile Detail</h3>
          <label htmlFor="avatar">
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id='avatar'
              accept='.png, .jpg, .jpeg'
              hidden
            />
            <img
              src={image ? URL.createObjectURL(image) : prevImage || assets.avatar_icon}
              alt="Profile Preview"
            />
            Upload profile image
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder='Your name'
            required
          />
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder='Write profile bio'
            required
          ></textarea>
          <button type='submit'>Save</button>
        </form>
        <img
          className='profile-pic'
          src={image ? URL.createObjectURL(image) : prevImage || assets.logo_icon}
          alt="Profile Picture"
        />
      </div>
    </div>
  );
}

export default ProfileUpdate;
