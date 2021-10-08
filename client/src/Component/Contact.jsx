import React, { useState, useEffect } from 'react'
import User1 from "../image/user1.png"
const Contact = ({socketMsg,messagesGet, datas, setMsgIdent, setHeaderName, userData, setMessagesGet, setMessagesGeterr, activeUsers, setSocketMsg }, IdentyOfConvers) => {
    const [isActive, setActive] = useState("OfflineUser")
    const [msgShow,setMsgShow] = useState([])



    useEffect(()=>{
        setMsgShow((old)=>messagesGet.length>0?[...[messagesGet.filter((old)=>old.conversation===datas._id)][0]]:[...old])
        setMsgShow((old)=>socketMsg.length>0?[...socketMsg.filter((old)=>old.conversation===datas._id)]:[...old])
    },[datas._id, messagesGet,socketMsg])


    const handellClickContact = async () => {
        IdentyOfConvers.current = { ...datas }
        setMsgIdent({ ...datas })
        if (datas.creator.id === userData._id) {
            setHeaderName(datas.participant.name)
        } else {
            setHeaderName(datas.creator.name)
        }
        const messages = await fetch(`/message/get/${datas._id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const parsmessages = await messages.json()
        if (parsmessages.data) {
            setMessagesGeterr("")
            setSocketMsg(old => [...old.filter(val => val.conversation !== datas._id)])
            setMessagesGet([...parsmessages.data])
        } else if (parsmessages.errors){
            setMessagesGeterr(parsmessages.errors.msg)
            setMessagesGet([])
        }
    }



    useEffect(() => {
        let participents
        if (activeUsers.length > 0) {
            if (datas?.creator.id === userData?._id) {
                participents = datas?.participant.id
            } else {
                participents = datas?.creator.id
            }
            if (participents) {
                if (activeUsers?.some((user) => user.userId === participents)) {
                    setActive("OnlineUser")
                } else {
                    setActive("OfflineUser")
                }
            } else {
                setActive("OfflineUser")
            }
        } else {
            setActive("OfflineUser")
        }
    }, [activeUsers, datas?.creator.id, datas?.participant.id, userData, userData?._id])








    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {
        // eslint-disable-next-line no-unused-vars
        const responce = await fetch(`/message/getsingle/${datas?._id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/josn"
            }
        });
        const dss=await responce.json()
        if(dss.data){
            setMsgShow((old)=>[...dss.data])
        }
    },[datas?._id])

// console.log(datas.participant.avater)

    return (
        <>
            {datas.creator.id !== userData._id ? (<>
                <li className="single_contact" onClick={
                    () => handellClickContact()}>
                        {socketMsg.filter(val=>val.conversation===datas._id).length>0? <span className="msg_notification">{socketMsg.filter(val=>val.conversation===datas._id).length}</span>:""}
                       
                    <div className="row endt d-flex justify-content-start w-100">
                        <div className="userImg col-3 d-flex justify-content-center align-items-center">
                            <img src={datas.creator.avater?`${process.env.React_App_HTTP_LINK+datas.creator.avater}`:User1} alt="userImg" />
                        </div>
                        
                        <div className="col-9 txt_sign_convars">
                            <div className="texts_head d-flex justify-content-lg-between">
                                <h5>{datas.creator.name}</h5>
                                <span className={isActive}></span>
                            </div>
                            <div className="msg">
                                <p>{msgShow.length>0? msgShow[0].sender.id===userData._id?`You: ${msgShow[0].text.slice(0,15)+"..."}`:`friend: ${msgShow[0].text.slice(0,15)+"..."}`:""}</p>
                            </div>
                        </div>
                    </div>
                </li></>) : null}



            {datas.participant.id !== userData._id ? (<>
                <li className="single_contact" onClick={handellClickContact}>
                        {socketMsg.filter(val=>val.conversation===datas._id).length>0? <span className="msg_notification">{socketMsg.filter(val=>val.conversation===datas._id).length}</span>:""}
                    <div className="row endt d-flex justify-content-start w-100">
                        <div className="userImg col-3 d-flex justify-content-center align-items-center">
                            <img src={datas.participant.avater?`${process.env.React_App_HTTP_LINK+datas.participant.avater}`:User1} alt="userImg" />
                        </div>
                        <div className="col-9 txt_sign_convars">
                            <div className="texts_head d-flex justify-content-lg-between">
                                <h5>{datas.participant.name}</h5>
                                <span className={isActive}></span>
                            </div>
                            <div className="msg">
                            <p>{msgShow.length>0? msgShow[0].sender.id===userData._id?`You: ${msgShow[0].text.slice(0,15)+"..."}`:`friend: ${msgShow[0].text.slice(0,15)+"..."}`:""}</p>
                            </div>
                        </div>
                    </div>
                </li></>) : null}

        </>
    )

}
const forwardedContact = React.forwardRef(Contact)
export default React.memo(forwardedContact)
