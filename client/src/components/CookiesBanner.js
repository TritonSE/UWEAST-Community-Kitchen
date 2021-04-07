/**
 * Footer banner that informs users that website usings cookies for operation. Banner will not re-appear for that session once
 * user acknowledges the fact by pressing the button.
 *
 * @summary   Footer banner informing of site's cookie usage.
 * @author    Amrit Kaur Singh
 */

import React, { useState } from "react";
import { Button } from "react-bootstrap";
import "../css/CookiesBanner.css";

import { shouldDisplayBanner, removeBanner } from "../util/CookiesBannerCheck";

const CookiesBanner = () => {
  // load default state by checking in with sessionStorage
  const [showBanner, setShowBanner] = useState(shouldDisplayBanner());

  function hideBanner() {
    removeBanner();
    setShowBanner(false);
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "0",
        width: "100%",
        backgroundColor: "#333333",
        color: "#f9ce1d",
        padding: "10px",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: "45",
        opacity: "0.98",
        display: showBanner ? "flex" : "none",
      }}
    >
      <div>
        This website uses cookies to ensure you get the best experience.{" "}
        <a
          href="https://www.cookiesandyou.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ cursor: "pointer" }}
        >
          {" "}
          Learn more.{" "}
        </a>{" "}
      </div>
      <Button onClick={hideBanner}> Got it!</Button>
    </div>
  );
};

export default CookiesBanner;
