/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from "react";
import User1 from "../image/user1.png";
import "./css/convers.css";
import Search from "../image/search.png";

const ConversModel = (props) => {
  const [cls, setClsd] = useState(false);
  const [inpt, setInpt] = useState("");
  const [fetchVal, setFVal] = useState({});
  useEffect(() => {
    if (props.modalVAl === true) {
      setClsd(true);
    } else {
      setClsd(false);
    }
  }, [props.modalVAl]);

  const closeMod = () => {
    setClsd(false);
    props.modalClos(false);
  };
  async function sendData() {
    const resData = await fetch("/conversation/api/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        creator: {
          id: props.userData._id,
          name: props.userData.username,
          avater: props.userData.avater,
          roll: props.userData.roll,
        },
        participant: {
          id: fetchVal.data.msg._id,
          name: fetchVal.data.msg.username,
          avater: fetchVal.data.msg.avater,
          roll: fetchVal.data.msg.roll,
        },
      }),
    });

    const convarsResult = await resData.json();
    if (convarsResult.data) {
      window.alert("Contact created successfully");

      setClsd(false);
      props.modalClos(false);
      const convas = await fetch("/conversation/api/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const convData = await convas.json();
      if (convData.data) {
        props.setConvars([...convData.data]);
      }
      setClsd(false);
      props.modalClos(false);
    } else if (convarsResult.errors) {
      window.alert(convarsResult.errors.msg);
    }
  }

  async function haddleSubmit(e) {
    e.preventDefault();
    const resData = await fetch(`/user/api/find/${inpt}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const resVal = await resData.json();
    setFVal({ ...resVal });
  }

  return (
    <>
      <div className={`userAdd_input ${cls && "active"}`}>
        <center className="mb-2">
          <input
            onClick={closeMod}
            type="button"
            value="Back"
            className="btn btn-secondary backBent"
          />
        </center>
        <div className="box_search_contactd">
          <form className="search_area " onSubmit={haddleSubmit}>
            <input
              value={inpt}
              onChange={(e) => setInpt(e.target.value)}
              type="text"
              name="phone"
              placeholder="search by Number"
            />
            <button type="submit" className="userAddSearchDiv">
              <img src={Search} alt="" />
            </button>
          </form>
          <ul className="wrapper_contact_search">
            {fetchVal.data && (
              <li onClick={sendData}>
                <div>
                  <img
                    src={
                      fetchVal.data.msg.avater
                        ? `${process.env.React_App_HTTP_LINK+fetchVal.data.msg.avater}`
                        : User1
                    }
                    className="con_img_cls"
                  />
                </div>
                <h5 className="hadding_txt_con">
                  {fetchVal.data.msg.username}
                </h5>
              </li>
            )}
            {fetchVal.errors && (
              <h2 className="text-center text-light">not found</h2>
            )}

            {Object.keys(fetchVal).length < 1 ? (
              <h5 className="text-center text-light">Search Your Contact</h5>
            ) : null}
          </ul>
        </div>
      </div>
    </>
  );
};

export default React.memo(ConversModel);
