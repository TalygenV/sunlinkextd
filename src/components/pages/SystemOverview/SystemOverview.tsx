import React from "react";
import { MapView } from "./MapView";
import { SummaryPanel } from "./SummaryPanel";

function SystemOverview() {
  const isMobile = window.innerWidth < 1024;

  return (
    <div
      style={{
        backgroundColor: "black",
        color: "white",
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Map Section */}
        <div
          style={{
            flex: 1,
            padding: isMobile ? "8px" : "16px",
            order: 1,
            height: isMobile ? "40vh" : "auto",
            minHeight: isMobile ? undefined : "calc(100vh - 120px)",
            overflow: "hidden",
          }}
        >
          <MapView />
        </div>

        {/* Summary Section */}
        <div
          style={{
            flexShrink: 0,
            order: 2,
            height: isMobile ? "60vh" : "100vh",
            overflowY: "auto",
            padding: "16px",
            boxSizing: "border-box",
          }}
        >
          <SummaryPanel />
        </div>
      </div>
    </div>
  );
}

export default SystemOverview;
