import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";
interface SectionTopProps {
  title?: string;
}

const SectionTop: React.FC<SectionTopProps> = ({ title}) => {
  return (
    <div className="section-top">
      <h2 className="section-top-title">{title}</h2>
      <button>
        View All <FaArrowRightLong />
      </button>
    </div>
  );
};

export default SectionTop;
