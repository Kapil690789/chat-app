import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, setDoc, doc, collection, where, getDocs,query } from "firebase/firestore";
import { toast } from "react-toastify";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB2naKKYy8a5QoxLoVzu2zzX3YvXFOVfWY",
  authDomain: "chat-app-ks-2872a.firebaseapp.com",
  projectId: "chat-app-ks-2872a",
  storageBucket: "chat-app-ks-2872a.firebasestorage.app",
  messagingSenderId: "121794149123",
  appId: "1:121794149123:web:ef8afddb39c29378a18736"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    // Save user data to Firestore
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name: "",
      avatar: "",
      bio: "Hey, There I am using chat app",
      lastseen: Date.now(),
    });

    // Initialize empty chats collection for the user
    await setDoc(doc(db, "chats", user.uid), {
      chatsData: [],
    });

    toast.success("Signup successful!");
  } catch (error) {
    console.error( error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }
};

const login  = async (email,password)=>{
    try {
      await signInWithEmailAndPassword(auth,email,password);
    } catch (error) {
      console.error(error);
      toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
      toast.error(error.code.split('/')[1].split('-').join(" "));
  }
 
}

const resetPass = async (email) => {
  if (!email) {
    toast.error("Enter your email");
    return null;
  }
  try {
    const userRef = collection(db,'users');
    const q = query(userRef,where("email","==",email));
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
        await sendPasswordResetEmail(auth,email);
        toast.success("Reset Email Sent")
    }
    else{
      toast.error("Email doesn't exists")
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }

}

export { signup,login,logout,auth,db,resetPass};
