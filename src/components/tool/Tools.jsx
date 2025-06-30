import React from "react";
import { InstallerPortalLayout } from "../portal/layout/InstallerPortalLayout";

function Tools() {
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
          Tools component Does not exist
        </p>
      </div>
    </InstallerPortalLayout>
  );
}

export default Tools;
