import React, { useEffect, useState } from "react";
import { useUserAuth } from "../context/UserAuthContext";
import { BASE_URL } from "../config/api";

const useLoggedinuser = () => {
  const { user } = useUserAuth();
  const email = user?.email;
  const [loggedinuser, setloggedinuser] = useState({});

  useEffect(() => {
    if (!email) return;

    fetch(`${BASE_URL}/loggedinuser?email=${email}`)
      .then((res) => res.json())
      .then((data) => {
        setloggedinuser(data);
      });
  }, [email]); 

  return [loggedinuser, setloggedinuser];
};

export default useLoggedinuser;
