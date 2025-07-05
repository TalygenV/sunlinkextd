// StepLayout.tsx
import { useLocation } from "react-router-dom";
import StepProgressBar from "../common/StepProgressBar";
import React from "react";

const steps = [
  { id: "system-overview", label: "Design" },
  { id: "system-design", label: "Batteries" },
  { id: "choose-plan", label: "Choose Your Plan" },
];

type AppState = "auth" | "main" | "contract" | "success" | "photos" | "portal";

interface StepLayoutProps {
  children: React.ReactElement<any>; // accept one React element with props
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}

export default function StepLayout({
  children,
  appState,
  setAppState,
}: StepLayoutProps) {
  const location = useLocation();
  const currentPath = location.pathname.replace("/", "");

  const progressSteps = steps.map((step, index) => {
    const currentIndex = steps.findIndex((s) => s.id === currentPath);
    return {
      ...step,
      completed: index < currentIndex,
      active: index === currentIndex,
    };
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {appState === "main" && (
        <div className="pt-8 pb-4">
          <StepProgressBar steps={progressSteps} />
        </div>
      )}
      <div className="px-4 md:px-12">
        {React.cloneElement(children, { appState, setAppState })}
      </div>
    </div>
  );
}
