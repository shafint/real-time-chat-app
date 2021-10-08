import React, { useState, useEffect } from "react";
import "./css/SignIn.css";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
const SignIn = () => {
  const [signUp, setSignUp] = useState({
    username: "",
    email: "",
    phone: "",
    password: ""
  });
  const [file, setFile] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    file: "",
    default: ""
  })
  const location = useHistory()


  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const responceIslonin = await fetch("/user/api/issign");
    const loginResult = await responceIslonin.json()
    if (loginResult.data) {
      location.push("/conversection")
    }
  }, [location])

  let formData = new FormData()
  formData.append("username", signUp.username)
  formData.append("email", signUp.email)
  formData.append("phone", signUp.phone)
  formData.append("avater", file)
  formData.append("password", signUp.password)

  // onchange handeller
  const onChangeHandeller = (e) => {
    setSignUp({ ...signUp, [e.target.name]: e.target.value })
  }

  //form submit handeller
  const formHandeler = async (e) => {
    e.preventDefault();
    const responceData = await fetch("/user/api/signup",{
      method: "POST",
      body: formData,
      headers: {
        "Accept": "multipart/form-data"
      },
      credentials: "include"
    });
    const mainData = await responceData.json();
    if (mainData.errors) {
      console.log(mainData.errors)
      setErrors({ ...mainData.errors })
      setSignUp({ ...signUp })
    } else if (mainData.success) {
      setErrors({
        username:"",
        email: "",
        phone: "",
        password: "",
        file: "",
        default: ""
      })
      window.alert("Registasion Successfully!")
      location.push("/signin")
    }
  }



  return (
    <div>
      
    <Helmet>
      <meta charSet="utf-8" />
      <title> SM-Chat-App -SignUp  </title>
      <link rel="canonical" href="http://localhost:3000/signup" />
    </Helmet>
      <div className="signIn">
        <div className="container">
          <div className="row">
            <div className="wrapperMsg">
              <div className="from_wraper">
                <div className="textSignUP ">
                  <h2 className="text-center">Glad to see you!</h2>
                  <p className="text-center">
                    SignUp then signin and enjoy messages with
                    <br /> you friends "best of luck"
                  </p>
                  <Link to="/signin">
                    <button className="Homebtn2">Sign in</button>
                  </Link>
                </div>
                <div className="textSignUP spcal">
                  <form className="form_sign" onSubmit={formHandeler}>
                    <h2 className="text-center  Inpt_clor">Sign up</h2>
                    <label for=".username" className="lable_master">
                      Username
                    </label>
                    <input

                      name="username"
                      onChange={onChangeHandeller}
                      value={signUp.username}
                      type="text"
                      className={`username ${errors.username ? "errorInptclass" : null}`}
                      placeholder="Username"
                    />
                    <span style={{ color: "red", fontSize: "12px" }} className="usernameErr">{errors.username ? errors.username.msg : null}</span>

                    <label for=".username" className="lable_master">
                      Email
                    </label>
                    <input
                      name="email"
                      onChange={onChangeHandeller}
                      value={signUp.email} type="email" className={`email ${errors.email ? "errorInptclass" : null}`} placeholder="Email" />
                    <span style={{ color: "red", fontSize: "12px" }} className="EmailErr">{errors.email ? errors.email.msg : null}</span>

                    <label for=".username" className="lable_master">
                      Phone
                    </label>
                    <input
                      name="phone"
                      onChange={onChangeHandeller}
                      value={signUp.phone}
                      type="number"
                      className={`phone ${errors.phone ? "errorInptclass" : null}`}
                      placeholder="017XXXXXXXX"
                    />
                    <span style={{ color: "red", fontSize: "12px" }} className="PhoneErr">{errors.phone ? errors.phone.msg : null}</span>

                    <label for=".username" className="lable_master">
                      File Choice
                    </label>
                    <input
                      required
                      accept="image/gif,image/jpeg,image/png,image/jpg"
                      name="file"
                      onChange={(e) => setFile(e.target.files[0])}
                      type="file" className={`file ${errors.file ? "errorInptclass" : null}`} placeholder="File" multiple />
                    <span style={{ color: "red", fontSize: "12px" }} className="fileErr">{errors.file ? errors.file : null}</span>

                    <label for=".username" className="lable_master">
                      Password
                    </label>
                    <input
                      name="password"
                      onChange={onChangeHandeller}
                      value={signUp.password}
                      type="password"
                      className={`passsword ${errors.password ? "errorInptclass" : null}`}
                      placeholder="password"

                    />
                    <span style={{ color: "red", fontSize: "12px" }} className="passErr">{errors.password ? errors.password.msg : null}</span>
                    <span style={{ color: "red", fontSize: "12px" }} className="defalultErr">{errors.default ? errors.default : null}</span>


                    <button
                      className="SubmitBtn"
                      style={{ marginBottom: "10px" }}
                      type="submit"
                    >
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
