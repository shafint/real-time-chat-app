/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useEffect, useState } from "react";
import "./css/admin.css";
import User from "../image/user1.png";
import { useHistory } from "react-router-dom";
import UserList from "./UserList";
import { Helmet } from "react-helmet";
const AdminDashboard = () => {
  const [userData, setUserData] = useState({});
  const [Users, setUsers] = useState([]);
  const location = useHistory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function getAllUsers() {
    const responceIslonin = await fetch("/user/api/issign");
    const loginResult = await responceIslonin.json();
    if (!loginResult?.data) {
      location.push("/");
    } else {
      if (loginResult?.data.roll === "admin") {
        setUserData(() => loginResult?.data);
        const allUser = await fetch("/admin/api/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const parsAllUser = await allUser.json();
        setUsers(() => [...parsAllUser.data]);
      } else {
        location.push("/conversection");
      }
    }
  }

  useEffect(getAllUsers, [location]);
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Admin - Dashboard</title>
        <link rel="canonical" href="http://localhost:3000/admin" />
      </Helmet>
      <div className="parent_clsUsers w-100 d-flex justify-content-center align-items-center flex-column">
        <div className="button_alls">
          <button
            className="btn btn-outline-danger"
            onClick={() => location.push("/conversection")}
          >
            GO To Contact
          </button>
        </div>
        <ul className="list-user mt-2 d-flex flex-column justify-content-center align-items-center">
          {Users.map((val, ind) => {
            return (
              <UserList
                key={ind}
                User={User}
                datas={val}
                userData={userData}
                getAllUsers={getAllUsers}
              />
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default AdminDashboard;
