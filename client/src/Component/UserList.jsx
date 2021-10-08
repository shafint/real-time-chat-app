/* eslint-disable jsx-a11y/img-redundant-alt */
import React from "react";
import Trash from "../image/trash.png";
const UserList = ({ User, datas, userData, getAllUsers }) => {
  async function removeuser() {
    const dataDlt = await fetch("/admin/api/removeuser", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: datas._id }),
    });
    const parseDataDlt = await dataDlt.json();
    if (parseDataDlt.data) {
      window.alert(
        `${parseDataDlt.data.username} hasbeen Deleted Successfully`
      );
      console.log(parseDataDlt);
      getAllUsers();
    } else {
      window.alert("Something Worrong");
      console.log(parseDataDlt.errors);
    }
  }

  return (
    <>
      <li className="d-flex align-items-center Design-Lis p-1">
        <div className="text-li w-90 ">
          <img
            src={
              datas.avater
                ? `${process.env.React_App_HTTP_LINK+datas.avater}`
                : User
            }
            className="img-user-list"
            alt="Photo"
          />
          <p>
            {datas._id === userData?._id ? (
              <>
                {datas.username}
                <span style={{ color: "violet", fontSize: "12px" }}>
                  {" "}
                  ({datas._id})
                </span>
                <span style={{ color: "violet" }}> (ME)</span>
              </>
            ) : (
              <>
                {datas.username}
                <span style={{ color: "violet", fontSize: "12px" }}>
                  {" "}
                  ({datas._id})
                </span>
              </>
            )}
          </p>
        </div>
        <div className="button-li w-10 ms-auto">
          {datas._id === userData?._id ? (
            ""
          ) : (
            <>
              <button
                onClick={() => removeuser()}
                className="btn btn-sm btn-outline-danger dlt-btn-use"
              >
                <img src={Trash} className="img-dlt-user" alt="Photo" />
              </button>
            </>
          )}
        </div>
      </li>
    </>
  );
};

export default UserList;
