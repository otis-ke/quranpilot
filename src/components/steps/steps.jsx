import React from "react";
import "./steps.css";
import eLearning from "../assets/ownpace.webp"; 
import tajweed from "../assets/tajweed2.webp"; 
import pronunciation from "../assets/makhraj2.webp"; 
import feedback from "../assets/record1-scaled.webp"; 

const QuranPilotSection = () => {
  const features = [
    {
      image: eLearning,
      title: "Learn at Your Own Pace",
      description:
        "Learn from home at your own pace if you do not have a real-time teacher",
    },
    {
      image: tajweed,
      title: "Learn With Tajweed",
      description: "Reciting without tajweed destroys the beauty of the Quran",
    },
    {
      image: pronunciation,
      title: "Correct Pronunciations",
      description:
        "Differentiate between similar sounding letters by knowing how to pronounce it",
    },
    {
      image: feedback,
      title: "Record & Feedback",
      description:
        "Record your practice words on this site, and a teacher will provide feedback",
    },
  ];

  return (
    <section className="quran-section">
      <h2 className="section-title">How Quran Pilot May Help</h2>
      <p className="section-subtitle">
        If you can't learn with a teacher, then this is how Quran Pilot will
        progress you through the stages...
      </p>
      <div className="features-container">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <img src={feature.image} alt={feature.title} className="feature-img" />
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
    
  );
};

export default QuranPilotSection;
