import React from "react";
import { skills, experiences, educationalAttainment } from "../constants";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import CTA from "../components/CTA";
import { myselfPhoto } from "../assets/icons";

const About = () => {
  return (
    <section className="max-container bg-slate-900 h-full w-full text-white">
      <div className="md:flex block md:gap-4">
        <div className="w-full h-[250px] md:h-[350px] l md:w-[550px] overflow-hidden">
          <img
            className="w-full h-[450px] md:h-full rounded-xl object-cover"
            src={myselfPhoto}
          />
        </div>
        <div>
          <h1 className="head-text">
            Hi, I'm{" "}
            <span className="green-gradient_text font-semibold drop-shadow">
              Jayharron Mar Abejar
            </span>
          </h1>
          <div className="mt-5 flex flex-col gap-3 text-slate-500">
            <p>
              I am a Software Engineer based in Cebu, Philippines, with three
              years of experience building high-quality web applications using
              .NET, React.js, and Next.js. I also have solid experience working
              with Microsoft Azure DevOps, including setting up CI/CD pipelines,
              managing deployments, and configuring Key Vaults. I am open to
              onsite opportunities and equally comfortable working in a remote
              setup
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
