import React, { useState, useEffect } from 'react'
import "./css/SignIn.css"
import { Link } from "react-router-dom"
import { useHistory } from "react-router-dom"
const SignIn = () => {
  const [signUp, setSignUp] = useState({
    email: "",
    password: ""
  })
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    default: ""
  })

  const location = useHistory()

  function handleIput(e) {
    setSignUp({ ...signUp, [e.target.name]: e.target.value })
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const responceIslonin = await fetch("/user/api/issign");
    const loginResult = await responceIslonin.json()
    if (loginResult.data) {
      location.push("/conversection")
    }
  }, [location])

  async function handleForm(e) {
    e.preventDefault()
    const logData = await fetch("/user/api/signin", {
      method: "POST",
      headers: {
        "content-Type": "application/json"
      },
      body: JSON.stringify({ ...signUp })
    });
    const logVal = await logData.json();
    if (logVal.errors) {
      setErrors({ ...logVal.errors })
    } else if (logVal.data) {
      if (logVal.data.confirm === true) {

        window.alert(`Login Successfull!`)
      } else {

        window.alert(`Login Successfull! "Mail sent successfully go to the Mail and confirm your account"`)
      }
      setErrors({
        email: "",
        password: "",
        default: ""
      })

      location.push("/conversection")

    }
  }

  return (
    <div>
      <div className="signIn">
        <div className="container">
          <div className="row">
            <div className="wrapperMsg">
              <div className="from_wraper">
                <div className="textSignUP ">
                  <h2 className="text-center">
                    Glad to see you!
                  </h2>
                  <p className="text-center" >
                    SignIn and start  chatting to you friends. <br />"best of luck"
                  </p>
                  <Link to="/signup">
                    <button className="Homebtn2">
                      Sign Up
                    </button>
                  </Link>
                </div>
                <div className="textSignUP spcal">
                  <form className="form_sign" onSubmit={handleForm}>
                    <h2 className="text-center  Inpt_clor">Sign In</h2>


                    <label for="username" className="lable_master">Email</label>
                    <input value={signUp.email} onChange={handleIput} type="email" className={`email ${errors.email || errors.default ? "errorInptclass" : null}`} placeholder="Email" name="email" />
                    <span style={{ color: "red", fontSize: "12px" }} className="usernameErr">{errors.email ? errors.email.msg : null}</span>
                    <span style={{ color: "red", fontSize: "12px" }} className="defalultErr">{errors.default ? errors.default : null}</span>




                    <label for=".username" className="lable_master">Password</label>
                    <input name="password" value={signUp.password} onChange={handleIput} type="password" className={`passsword ${errors.password || errors.default ? "errorInptclass" : null}`} placeholder="Password" />
                    <span style={{ color: "red", fontSize: "12px" }} className="passErr">{errors.password ? errors.password.msg : null}</span>
                    <span style={{ color: "red", fontSize: "12px" }} className="defalultErr">{errors.default ? errors.default : null}</span>
                    <button className="SubmitBtn" type="submit">Submit</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn
