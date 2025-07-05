import React from "react";

interface Step {
  id: string;
  label: string;
  completed: boolean;
  active: boolean;
}

interface Props {
  steps: Step[];
}

export default function StepProgressBar({ steps }: Props) {
  return (
    <div className="flex items-center justify-center w-full max-w-4xl mx-auto px-4">
      <div className="flex items-center justify-between w-full relative">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step Item */}
            <div className="flex flex-col items-center z-10">
              <div
                className={`
                  w-5 h-5 rounded-full border-2 transition-all duration-300 mb-2
                  ${
                    step.completed
                      ? "bg-green-400 border-green-400 shadow-[0_0_8px_2px_rgba(34,197,94,0.6)]"
                      : step.active
                      ? "bg-blue-600 border-blue-500 shadow-[0_0_8px_2px_rgba(59,130,246,0.6)]"
                      : "bg-gray-700 border-gray-500"
                  }
                `}
              ></div>
              <span
                className={`
                  text-xs mt-1 font-medium
                  ${
                    step.active
                      ? "text-blue-400"
                      : step.completed
                      ? "text-green-400"
                      : "text-gray-400"
                  }
                `}
              >
                {step.label}
              </span>
            </div>

            {/* Connector */}
            {index < steps.length - 1 && (
              <div className="absolute top-2 left-0 right-10">
                <div className="flex justify-evenly items-center w-full">
                  <div className="flex-1 h-0.5 bg-gray-600 relative mx-2">
                    <div
                      className={`
                        h-0.5 absolute top-0 left-0 right-0 transition-all duration-500 ease-in-out
                        ${
                          step.completed
                            ? "bg-green-400 shadow-[0_0_6px_rgba(34,197,94,0.5)] w-full"
                            : step.active
                            ? "bg-blue-500 w-1/2"
                            : "w-0"
                        }
                      `}
                    />
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
