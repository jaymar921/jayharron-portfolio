import React from "react";
import { getYearsAndMonthsFromDate } from "../../../utilities/jsUtils";

function getYearAndMonth({ years, months }) {
  return `${years} yr${years > 1 ? "s" : ""} . ${months} mo`;
}
function ResumeWindow() {
  const fullScale = getYearsAndMonthsFromDate(new Date("3-10-2022"));
  return (
    <div className="w-[320px]">
      <h2 className="text-white text-xl mb-4">Professional Experience</h2>
      <div className="bg-[rgba(0,0,0,0.2)] p-4 border-2 mb-2">
        <h1 className="font-bold text-green-600 text-lg">
          Forrest T. Jones & Company Inc.
        </h1>
        <p>
          <span className="text-blue-300">
            Software Engineer II (Contract)
          </span>{" "}
        </p>
        <p>
          {getYearAndMonth(getYearsAndMonthsFromDate(new Date("3-10-2024")))}
        </p>
      </div>
      <div className="bg-[rgba(0,0,0,0.2)] p-4 border-2 mb-2">
        <h1 className="font-bold text-green-600 text-lg">
          Full Scale Teams PH, Inc.
        </h1>
        <p>
          <span className="text-blue-300">
            Software Engineer II (Contract)
          </span>{" "}
        </p>
        <p>
          {getYearAndMonth(getYearsAndMonthsFromDate(new Date("5-22-2023")))}
        </p>
      </div>
    </div>
  );
}

export default ResumeWindow;
