import React from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { GiAbstract010 } from "react-icons/gi";
import { GrCompliance, GrUser } from "react-icons/gr";
import { FaUserAlt } from "react-icons/fa";
import { CgMenuGridR } from "react-icons/cg";
import { TfiStatsUp } from "react-icons/tfi";

interface Props {
  key: number;
  Icon: any;
  color: string;
  title: string;
  count: number;
}

export default function StatsTiles({ Icon, title, count }: Props) {
  return (
    <div className='pt-12'>
    <div className="bg-white/90 backdrop-blur-sm border border-gray-100 shadow-md rounded-3xl w-96 h-40 m-2 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center p-6">
      {Icon === "GrCompliance" && (
        <GrCompliance className="text-3xl text-blue-600" />
      )}
      {Icon === "GrUser" && <GrUser className="text-3xl text-blue-600" />}
      {Icon === "GiAbstract010" && (
        <GiAbstract010 className="text-3xl text-blue-600" />
      )}
      {Icon === "AiOutlineClockCircle" && (
        <AiOutlineClockCircle className="text-3xl text-blue-600" />
      )}
      {Icon === "FaUserAlt" && (
        <FaUserAlt className="text-3xl text-blue-600" />
      )}
      {Icon === "CgMenuGridR" && (
        <CgMenuGridR className="text-3xl text-blue-600" />
      )}
      {Icon === "TfiStatsUp" && (
        <TfiStatsUp className="text-3xl text-blue-600" />
      )}
      <p className="text-sm text-gray-600 font-medium mt-3">{title}</p>
      <p className="text-2xl text-gray-800 font-bold mt-2">{count}</p>
    </div>
    </div>
  );
}
