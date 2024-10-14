import React from "react";

interface MainHeadingProps {
  title: string;
}

const MainHeading: React.FC<MainHeadingProps> = ({ title }) => {
  return <h1 className="text-2xl font-bold text-grey-9000">{title}</h1>;
};

export default MainHeading;
