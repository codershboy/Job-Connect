import React from "react";
import { TextInput } from "@mantine/core";

const DreamJob = () => {
  return (
    <div className="flex items-center px-16 mt-10">

      {/* LEFT TEXT SECTION */}
      <div className="flex flex-col w-[45%] gap-3">
        <div className="text-6xl font-bold leading-tight text-white">
          Find your{" "}
          <span className="text-bright-sun-400">dream</span>{" "}
          <span className="text-bright-sun-400">job</span>{" "}
          with us
        </div>

        <div className="text-lg text-mine-shaft-200">
          Good life begins with a good company. Start explore thousands of jobs in one place.
        </div>

        <div className="flex gap-3">
          <TextInput className="bg-mine-shaft-900 rounded-lg p-1 px-2 text-mine-shaft-100"
            variant="unstyled"
            label="Job Title"
            placeholder="Search job title..."
          />

          <TextInput className="bg-mine-shaft-900 rounded-lg p-1 px-2 text-mine-shaft-100"
            variant="unstyled"
            label="Location"
            placeholder="Enter location..."
          />
          <div>

          </div>
        </div>
      </div>

      {/* RIGHT IMAGE SECTION */}
      <div className="w-[55%] flex items-center justify-center">
        <div className="w-[30rem]">
          <img src="/boy.webp" alt="working illustration" />
        </div>
      </div>
    </div>
  );
};

export default DreamJob;
