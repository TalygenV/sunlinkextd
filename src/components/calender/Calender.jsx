import React from "react";
import { InstallerPortalLayout } from "../portal/layout/InstallerPortalLayout";

function Calender() {
  return (
    <InstallerPortalLayout isAdmin={true}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p
          style={{
            fontSize: "16px",
            color: "white",
            cursor: "pointer",
          }}
        >
          Calender component Does not exist
        </p>
      </div>
    </InstallerPortalLayout>
  );
}

export default Calender;
