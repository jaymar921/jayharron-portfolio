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
    <section className="max-container bg-slate-900 h-full text-white">
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
              I'm a Software Developer based in Cebu, Philippines, specializing
              in building high quality web applications with .NET, Flask, and
              NextJS frameworks. On my fee time, I also spend some time on
              working with my Indie Games and Minecraft Plugins/Addons.
            </p>
          </div>
        </div>
      </div>
      <div className="py-10 flex flex-col">
        <h3 className="subhead-text">My Skills</h3>
        <div className="mt-16 flex flex-wrap gap-12">
          {skills.map((skill, index) => (
            <div key={index} className="block-container w-20 h-20">
              <div className="btn-back rounded-xl" />
              <div className="btn-front rounded-xl flex justify-center items-center">
                <img
                  src={skill.imageUrl}
                  alt={skill.name}
                  className="w-1/2 h-1/2 object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="py-16">
        <h3 className="subhead-text">Professional Experience</h3>
        <div className="mt-5 flex flex-col gap-3 text-slate-500">
          <p>
            I've worked with all sorts of companies, leveling up my skills and
            teaming up with smart people. Here's the rundown:
          </p>
        </div>
        <div className="mt-12 flex">
          <VerticalTimeline>
            {experiences.map((experience, index) => (
              <VerticalTimelineElement
                key={experience.company_name + index}
                date={experience.date}
                icon={
                  <div className="flex justify-center items-center w-full h-full">
                    <img
                      src={experience.icon}
                      alt={experience.company_name}
                      className="w-[60%] h-[60%] object-contain"
                    />
                  </div>
                }
                iconStyle={{ background: experience.iconBg }}
                contentStyle={{
                  borderBottom: "8px",
                  borderStyle: "solid",
                  borderBottomColor: experience.iconBg,
                  boxShadow: "none",
                  backgroundColor: "#141F38",
                }}
                className="px-4"
              >
                <div>
                  <h3
                    className="text-white text-xl font-poppins font-semibold"
                    title="Job title"
                  >
                    {experience.title}
                  </h3>
                  <p
                    className="text-white font-medium font-base"
                    style={{ margin: 0 }}
                    title={`Company '${experience.company_name}'`}
                  >
                    {experience.company_name}
                  </p>
                  <p
                    className="text-red-300"
                    style={{ margin: 0, fontSize: 12 }}
                    title="Job type"
                  >
                    {experience.job_type}
                  </p>
                </div>
                <ul className="my-5 list-disc ml-5 space-y-2">
                  {experience.points.map((point, index) => (
                    <li
                      className="text-white font-normal pl-1 text-sm"
                      key={index}
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
        </div>
      </div>
      <div className="py-16">
        <h3 className="subhead-text">Education</h3>
        {/* <div className="mt-5 flex flex-col gap-3 text-slate-500">
          <p> ... </p>
        </div> */}
        {educationalAttainment.map((school) => (
          <div className="bg-[#141F38] p-4 rounded-md border-b-[6px] border-b-red-400 shadow-md my-4">
            <div className="flex items-center gap-2">
              <img className="w-10 rounded-full" src={school.logo} />
              <h2 className="font-bold text-lg">{school.school}</h2>
            </div>
            <div className="px-4 pt-4">
              <p className="py-1">{school.curriculum}</p>
              <p>
                Year: <span className="text-yellow-400">{school.year}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
      <hr className="border-slate-200" />
      <CTA />
    </section>
  );
};

export default About;
