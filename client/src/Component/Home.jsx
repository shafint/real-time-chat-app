import React,{useEffect} from "react";
import "./css/Homestyle.css";
import { Link,useHistory } from "react-router-dom";
import homeImg from "../image/web_developer.gif";
const Home = () => {
  const location=useHistory()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async() => {
    const responceIslonin=await fetch("/user/api/issign");
    const loginResult=await responceIslonin.json()
    if(loginResult.data){
      location.push("/conversection")
    }
  }, [location])

  return (
    <>
      <div className="home">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12 homeImg">
              <img src={homeImg} alt="HomeImg" />
            </div>
            <div className="col-lg-6 col-md-6 col-12 IntroTxt homeImg">
              <h1 className="text-center">Welcome to SM Chat-App</h1>
              <Link to="/signin">
                <button className="Homebtn">Get Started</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
