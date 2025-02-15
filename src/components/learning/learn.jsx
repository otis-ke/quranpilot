import React from "react";
import "./learn.css";
import makraj from "../assets/makraj.webp"; // ✅ Corrected Image Import

const QuranLearningSection = () => {
  return (
    <div className="quran-learning-container">
      {/* Video Section */}
      <div className="video-section">
        <div className="video-wrapper">
          <iframe
            src="https://www.youtube.com/embed/AtVQeqO9XaI?start=9&rel=0&modestbranding=1&showinfo=0&autoplay=0"
            title="Quran Learning System"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="video-text">
          <h2>This is a Unique Quran Learning System</h2>
          <p>
            This solution to learning the Quran is <strong>ONLY</strong> if you cannot 
            learn face-to-face with a qualified teacher.
          </p>
          <p>
            If you really do not have any other option, then this is the 
            next best solution.
          </p>
          <p><strong>Watch the video for an explanation of this system</strong></p>
        </div>
      </div>

      {/* Makhraj Section */}
      <div className="makhraj-section">
        <div className="makhraj-text">
          <h2>Makhraj</h2>
          <p>
            Makhraj refers to the place in the mouth or throat where the 
            sound comes out from.
          </p>
          <br />
          <p>
            For example, the letter Haa would originate from, and be 
            pronounced from the throat.
          </p>
          <br />
          <p>Most of the time, this is natural.</p>
          <p>
            <br />
            Making sure the sound comes out from the right place will 
            avoid changing one letter for another and making a major 
            error in some instances.
          </p>
          <br />
          <p>
            So as part of these lessons, you will be taught to pronounce 
            letters from their correct places right from the very 
            beginning, so you don’t have to worry about it as you proceed 
            further in your lessons.
          </p>
        </div>
        <div className="makhraj-image">
          <img src={makraj} alt="Makhraj Concept" /> {/* ✅ Fixed Image Rendering */}
        </div>
      </div>
    </div>
  );
};

export default QuranLearningSection;
