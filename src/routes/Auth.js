import { authService, firebaseInstance } from "../fbase";
import { useState } from "react";

// console.log(authService);

const Auth = () => {
  //값으로 넣어질 상태값
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");

  const onChange = (event) => {
    //구조분해 할당
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const toggleAccount = () => setNewAccount((prev) => !prev);

  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    if (name === "google") {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
      console.log(provider);
    } else if (name === "github") {
      provider = new firebaseInstance.auth.GithubAuthProvider();
    }
    const data = await authService.signInWithPopup(provider);
    console.log(data);
  };

  //가입
  const onSubmit = async (event) => {
    event.preventDefault(); //함수사용시 재렌더링 현상때문에 초기값으로 돌아가는 현상을 막기위해 사용 (새로고침 방지)
    try {
      let data;
      if (newAccount) {
        //새로운 사용자
        data = await authService.createUserWithEmailAndPassword(
          email,
          password
        );
      } else {
        //로그인액션
        data = await authService.signInWithEmailAndPassword(email, password);
      }
      console.log(data);
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          value={email}
          onChange={onChange}
          type="email"
          placeholder="Email"
          required
        />
        <input
          name="password"
          value={password}
          onChange={onChange}
          type="password"
          placeholder="Password"
          required
        />
        <input value={newAccount ? "Create Account" : "Login"} type="submit" />
        {error}
      </form>
      <span onClick={toggleAccount}>
        {newAccount ? "Sign in" : "createAccount"}
      </span>
      <div>
        <button onClick={onSocialClick} name="google">
          Google
        </button>
        <button onClick={onSocialClick} name="github">
          Github
        </button>
      </div>
    </div>
  );
};

export default Auth;
