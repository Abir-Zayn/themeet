"use client";
import { ChevronRight } from "lucide-react";



const ExploreBtn = () => {
  return (
    <button
      id="explore-btn"
      className="mt-7 mx-auto"
      onClick={() => console.log("Clicked")}
    >
      <a href="#events">
        Explore Events
        <ChevronRight />
      </a>
    </button>
  );
};

export default ExploreBtn;
