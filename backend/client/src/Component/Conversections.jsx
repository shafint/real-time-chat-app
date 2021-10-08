/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import "./css/convers.css";
import Search from "../image/search.png";
import User1 from "../image/user1.png";
import Trash from "../image/trash.png";
import attachment from "../image/attachment.png";
import sent from "../image/sent.png";
import ConversModel from "./ConversModel";
import { Helmet } from "react-helmet";
import Picker from "emoji-picker-react";
import Contact from "./Contact";
import { io } from "socket.io-client";
const Conversections = () => {
  const [modal, setmodal] = useState(false);
  const [userData, setUserData] = useState({});
  const [allConvars, setConvars] = useState([]);
  const [messagesGet, setMessagesGet] = useState([]);
  const [messagesGeterr, setMessagesGeterr] = useState("");
  const [convIdenty, setMsgIdent] = useState({});
  const [sentmsg, setSentmsg] = useState("");
  const [headerName, setHeaderName] = useState("");
  const [emoji, setEmoji] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);
  const [socketMsg, setSocketMsg] = useState([]);
  const socket = useRef();
  const IdentyOfConvers = useRef({});
  function close() {
    setmodal(false);
  }

  console.log(activeUsers)

  useEffect(() => {
    if (Object.keys(convIdenty).length > 0) {
      if (convIdenty.creator.id === userData._id) {
        if (
          activeUsers.some((val) => val.userId === convIdenty.participant.id)
        ) {
          setActiveStatus(true);
        } else {
          setActiveStatus(false);
        }
      } else {
        if (activeUsers.some((val) => val.userId === convIdenty.creator.id)) {
          setActiveStatus(true);
        } else {
          setActiveStatus(false);
        }
      }
    }
    return ()=>{
        
    }
  }, [activeUsers, convIdenty, userData._id]);

  const location = useHistory();


  useEffect(() => {
    if (
      socketMsg?.some(
        (value) => value.conversation === IdentyOfConvers?.current._id
      )
    ) {
      setMessagesGet((old) => [
        ...socketMsg?.filter(
          (val) => val.conversation === IdentyOfConvers?.current._id
        ),
        ...old,
      ]);
      setSocketMsg([
        ...socketMsg?.filter(
          (val) => val.conversation !== IdentyOfConvers?.current._id
        ),
      ]);
    } else {
      setMessagesGet((old) => [...old]);
    }
  }, [socketMsg]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const responceIslonin = await fetch("/user/api/issign");
    const loginResult = await responceIslonin.json();
    if (loginResult.data) {
      setUserData({ ...loginResult.data });
      const convas = await fetch("/conversation/api/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const convData = await convas.json();
      if (convData.data) {
        setConvars([...convData.data]);
      }
      socket.current = io("/");
      socket.current?.emit("addUser", loginResult.data._id);
      socket.current?.on("activeUsers", (datas) => {
        setActiveUsers(datas);
      });
      socket?.current.on("getMessage", (socketMSG) => {
        setSocketMsg((oldValue) => [socketMSG, ...oldValue]);
      });
    } else {
      location.push("/signin");
    }
    return()=>{
        
    }
  }, [location]);

  async function handlleMessageSubmit(e) {
    e.preventDefault();

    if (!sentmsg.trim()) {
      window.alert("please write some");
    } else {
      if (Object.keys(convIdenty).length > 0) {
        let senderObje = {
          text: sentmsg ? sentmsg : "",
          atachment: "",
          conversation: convIdenty._id,
          sender:
            convIdenty.creator.id === userData._id
              ? { ...convIdenty.creator }
              : { ...convIdenty.participant },
          receiver:
            convIdenty.creator.id !== userData._id
              ? { ...convIdenty.creator }
              : { ...convIdenty.participant },
          date_time: new Date().toGMTString(),
        };

        let isActiveUser = activeUsers.some(
          (val) => val.userId === senderObje.receiver.id
        );
        if (isActiveUser) {
          socket.current?.emit("sendMessage", senderObje);
        }

        setMessagesGet((oldVal) => [senderObje, ...oldVal]);
        try {
          const resData = await fetch("/message/sent", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(senderObje),
          });
          const resDataPars = await resData.json();
          if (resDataPars.data) {
            setSentmsg("");
            setMessagesGeterr("");
          } else if (resDataPars.errors) {
            window.alert(resDataPars.errors);
          }
        } catch (err) {
          console.log(err.message);
        }
      } else {
        window.alert("please select a contact");
      }
    }
  }

  function trushContact() {
    setHeaderName("");
    setMessagesGet([]);
    setMsgIdent({});
    IdentyOfConvers.current = {};
  }

  const onEmojiClick = (event, emojiObject) => {
    setSentmsg(sentmsg + emojiObject.emoji);
  };

  async function logoutHandle() {
    try {
      const resData = await fetch("/user/api/signout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const dd = await resData.json();
      if (dd.data) {
        window.alert(dd.data);
        location.push("/");
      }
    } catch (err) {
      console.log(err);
    }
  }

  const pushOnAdmin=()=>{
    socket.current?.emit("selfDisconnect")
    location.push("/admin")

  }

  return (
    <>
    <Helmet>
      <meta charSet="utf-8" />
      <title> SM-Chat-App</title>
      <link rel="canonical" href="http://localhost:3000/conversection" />
    </Helmet>
      <div className="conversections">
        <div className="container">
          <div className="">
            <button className="btn btn-danger" onClick={logoutHandle}>
              Logout
            </button>

            {userData.roll === "admin" ? (
              <button
                className="btn btn-success"
                onClick={pushOnAdmin}
              >
                Controll Your Users
              </button>
            ) : (
              ""
            )}
          </div>
          <div className="wrapper_convers_box">
            <div className="main_convers_box">
              <div className="row box_maintainer">
                <ConversModel
                  modalVAl={modal}
                  modalClos={close}
                  userData={userData}
                  setConvars={setConvars}
                />
                <button
                  type="button"
                  onClick={() => setmodal(true)}
                  className="userAddBtnd"
                >
                  {" "}
                  +{" "}
                </button>
                {emoji ? (
                  <Picker
                    onEmojiClick={onEmojiClick}
                    pickerStyle={{
                      position: "absolute",
                      zIndex: "2",
                      top: "30%",
                      left: "10%",
                      boxShadow: "0 0px 0px transparent",
                    }}
                  />
                ) : null}
                <div className="col-2 col-sm-2 col-md-2 col-lg-4 contact_list">
                  <div className="search">
                    <img src={Search} alt="Serach-photo" />
                    <input type="text" name="search" placeholder="Search" />
                  </div>
                  <ul className="contact_list_prent">
                    {/*single contact*/}
                    {allConvars.map((datas, ind) => {
                      return (
                        <>
                          <Contact
                            Key={ind}
                            datas={datas}
                            ref={IdentyOfConvers}
                            setMsgIdent={setMsgIdent}
                            setHeaderName={setHeaderName}
                            userData={userData}
                            setMessagesGet={setMessagesGet}
                            setMessagesGeterr={setMessagesGeterr}
                            activeUsers={activeUsers}
                            setSocketMsg={setSocketMsg}
                            messagesGet={messagesGet}
                            socketMsg={socketMsg}
                            // eslint-disable-next-line react/jsx-no-duplicate-props
                          />
                        </>
                      );
                    })}
                    {allConvars.length < 1 ? (
                      <h5 className="text-center text-light">Add Contact</h5>
                    ) : null}
                    {/*single contact*/}
                  </ul>
                </div>
                <div className="col-10 col-sm-10 col-md-10 col-lg-8 messages_and_header">
                  {/* messsage header */}
                  <div className="msg_had ">
                    {headerName ? (
                      <>
                        <div className="had_txt">
                          <h3>{headerName}</h3>
                          <span>{activeStatus ? "Online😀" : "Offline😴"}</span>
                        </div>
                        <div className="delete">
                          <img onClick={trushContact} src={Trash} alt="Trash" />
                        </div>
                      </>
                    ) : null}
                  </div>
                  {/* end */}
                  <div className="wrap_msgandinpt d-flex flex-column h-100 w-100">
                    <ul className="message_ul">
                      {messagesGet?.conversation !== convIdenty?._id ? (
                        <>
                          {messagesGet?.length > 0 ? (
                            <>
                              {messagesGet?.map((val, ind) => {
                                return (
                                  <>
                                    {val.sender.id === userData._id ? (
                                      <>
                                        <div
                                          className="wrapper_message_single"
                                          key={ind}
                                        >
                                          <li className="sender_msg">
                                            <p>{val.text ? val.text : null} </p>
                                            <span>
                                              {val.atachment
                                                ? val.atachment
                                                : null}
                                            </span>
                                            <div>
                                              <img src={val.avater?`${process.env.React_App_HTTP_LINK+val.avater}`:User1} alt="photo" />
                                            </div>
                                          </li>
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <div
                                          className="wrapper_message_single"
                                          key={ind}
                                        >
                                          <li className="reciver_msg">
                                            <div>
                                              <img src={val.avater?`${process.env.React_App_HTTP_LINK+val.avater}`:User1} alt="photo" />
                                            </div>
                                            <p>{val.text ? val.text : null}</p>
                                            <span>
                                              {val.atachment
                                                ? val.atachment
                                                : null}
                                            </span>
                                          </li>
                                        </div>
                                      </>
                                    )}
                                  </>
                                );
                              })}
                            </>
                          ) : null}
                        </>
                      ) : null}
                      {messagesGeterr ? (
                        <h4 className="text-center text-light ">
                          {messagesGeterr}
                        </h4>
                      ) : null}
                    </ul>
                    <form
                      className="send_msg_form"
                      onSubmit={handlleMessageSubmit}
                    >
                      <div className="img_msg">
                        <img
                          onClick={() =>
                            emoji === true ? setEmoji(false) : setEmoji(true)
                          }
                          src={attachment}
                          alt="athemp"
                        />
                      </div>
                      <div className="inpt_sent_msg">
                        <input
                          value={sentmsg}
                          onClick={() => setEmoji(false)}
                          onChange={(e) => setSentmsg(e.target.value)}
                          type="text"
                          name="public"
                          placeholder="Write some messages...."
                          autoComplete="off"
                        />
                      </div>
                      <button
                        onClick={() => setEmoji(false)}
                        type="submit"
                        className="sent_icon_msg"
                      >
                        <img src={sent} alt="sentImg" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Conversections;
