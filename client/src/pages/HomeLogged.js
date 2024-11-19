import React from "react";
import Header from "../components/Header";

const HomeLogged = ({ username, showNav }) => {
  return <Header username={username} showNav={showNav} />;
};

export default HomeLogged;
