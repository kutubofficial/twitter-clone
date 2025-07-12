import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "./firbase";

const userAuthContext = createContext();

export function UserAuthContextProvider(props) {
  const [user, setUser] = useState({});

  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function signUp(email, password) {
    try {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
        });
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("This email is already registered. Try logging in instead.");
      }
    }
  }

  function logOut() {
    return signOut(auth);
  }

  function googleSignIn() {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentuser) => {
      setUser(currentuser);

      //* Save login history after Firebase login
      if (currentuser?.email) {
        const userAgent = navigator.userAgent;
        const os = navigator.platform;
        const deviceType = /mobile/i.test(userAgent) ? "mobile" : "desktop";
        console.log("HISTORY ", userAgent, os, deviceType);

        try {
          await fetch("http://localhost:5000/save-login-history", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: currentuser.email,
              browser: userAgent,
              os,
              deviceType,
            }),
          });
        } catch (error) {
          console.error("Failed to save login history:", error.message);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <userAuthContext.Provider
      value={{ user, logIn, signUp, logOut, googleSignIn }}
    >
      {props.children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
