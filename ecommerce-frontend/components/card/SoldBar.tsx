"use client";
import React from "react";

interface SoldBarProps {
  sold: number;
  total: number;
}

const SoldBar: React.FC<SoldBarProps> = ({ sold, total }) => {
  const percentage = Math.min((sold / total) * 100, 100);

  return (
    <div className="sold-bar-wrapper">
      <div className="sold-text">
        {sold >= 1000 ? `${(sold / 1000).toFixed(1)}K` : sold} Sold
      </div>

      <div className="sold-progress">
        <div
          className="sold-progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default SoldBar;
