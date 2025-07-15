import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "./Editprofile.css";
import { BASE_URL } from "../../../config/api";

function Editchild({ dob, setdob }) {
  const [open, setopen] = useState(false);

  return (
    <>
      <div className="birthdate-section" onClick={() => setopen(true)}>
        <span>Edit</span>
      </div>

      {open && (
        <div className="modal-overlay">
          <div className="child-modal" style={{ width: 300, height: 300 }}>
            <h2>Edit date of birth</h2>
            <p>
              This can only be changed a few times. <br />
              Make sure you enter the age of the person using the account.
            </p>
            <input type="date" onChange={(e) => setdob(e.target.value)} />
            <button className="e-button" onClick={() => setopen(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const Editprofile = ({ user, loggedinuser }) => {
  const [name, setname] = useState("");
  const [bio, setbio] = useState("");
  const [location, setlocation] = useState("");
  const [website, setwebsite] = useState("");
  const [open, setopen] = useState(false);
  const [dob, setdob] = useState("");

  const handlesave = () => {
    const editinfo = { name, bio, location, website, dob };
    fetch(`${BASE_URL}/userupdate/${user?.email}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(editinfo),
    })
      .then((res) => res.json())
      .then((data) => console.log("done", data));
    setopen(false);
  };

  return (
    <div>
      <button className="Edit-profile-btn" onClick={() => setopen(true)}>
        Edit profile
      </button>

      {open && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="header">
              <button onClick={() => setopen(false)}>
                <CloseIcon />
              </button>
              <h2 className="header-title">Edit Profile</h2>
              <button className="save-btn" onClick={handlesave}>
                Save
              </button>
            </div>

            <form className="fill-content">
              <input
                type="text"
                className="text-field"
                placeholder="Name"
                onChange={(e) => setname(e.target.value)}
                defaultValue={loggedinuser[0]?.name || ""}
              />
              <input
                type="text"
                className="text-field"
                placeholder="Bio"
                onChange={(e) => setbio(e.target.value)}
                defaultValue={loggedinuser[0]?.bio || ""}
              />
              <input
                type="text"
                className="text-field"
                placeholder="Location"
                onChange={(e) => setlocation(e.target.value)}
                defaultValue={loggedinuser[0]?.location || ""}
              />
              <input
                type="text"
                className="text-field"
                placeholder="Website"
                onChange={(e) => setwebsite(e.target.value)}
                defaultValue={loggedinuser[0]?.website || ""}
              />
            </form>

            <div className="birthdate-section">
              <p>Birth Date</p>
              <Editchild dob={dob} setdob={setdob} />
            </div>

            <div className="last-section">
              {loggedinuser[0]?.dob ? (
                <h2>{loggedinuser[0]?.dob}</h2>
              ) : (
                <h2>{dob || "Add your date of birth"}</h2>
              )}
              <div className="last-btn">
                <h2>Switch to Professional</h2>
                <ChevronRightIcon />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editprofile;
