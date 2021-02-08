import React from "react";
import googleImg from "../../assets/images/google-logo.png";
import firebase from "../../firebase/index.js";

const AuthPage = ({ state, history, updateUser }) => {
  const chooseButton = () => {
    if (state.auth[0]) {
      return (
        <div className="auth-button" onClick={handleLogOut}>
          <p className="log-out-text">
            {"Log out as " +
              (state.user[0] ? state.user[0].displayName : "(undefined)")}
          </p>
        </div>
      );
    } else {
      return (
        <div className="auth-button" onClick={handleLogIn}>
          <div className="log-in-text-cont">
            <img src={googleImg} alt="google logo" className="log-in-img"></img>
            <p className="log-in-text">{"Log in with Google"}</p>
          </div>
        </div>
      );
    }
  };

  const handleLogIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // var token = result.credential.accessToken;
        // The signed-in user info.
        // var user = result.user;
        // ...
        console.log(result.user);
        state.auth[1](true);
        state.user[1](result.user);
        history.push("/");
      })
      .catch((error) => {
        console.error("ERROR: " + error);
      });
  };

  const handleLogOut = () => {
    firebase.auth().signOut();
    state.items[1]([]);
    state.auth[1](false);
    state.user[1](undefined);
    history.push("/");
  };

  return <div className="auth-container">{chooseButton()}</div>;
};

export default AuthPage;
