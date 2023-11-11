"use client";

import React, { useState } from "react";
import StatsTiles from "@/components/StatsTiles";
import GettingDatasLength from "@/app/tilesDatas/Tiles";

export default function TileContainer() {
  const [data, setData] = useState(GettingDatasLength());

  return (
    <>
      {data?.map((tile: any, index: number) => {
        return (
          <StatsTiles
            key={index}
            Icon={tile.icon}
            color={tile.color}
            title={tile.title}
            count={tile.count}
          />
        );
      })}
    </>
  );
}
