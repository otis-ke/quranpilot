import React from "react";
import { useNavigate } from "react-router-dom";
import "./tajweed.css"
import tajweed from '../assets/tajweed.webp'



const TajweedSection = () => {
  const navigate = useNavigate(); // Initialize the navigate function
  
  return (
    <section className="tajweed-section">
      <div className="tajweed-container">
      <img
  src={tajweed}
  alt="Quran with Tajweed"
  className="tajweed-image"
/>
        <div className="tajweed-content">
          <h2>Tajweed</h2>
          <p>
            If you are going to recite the Quran, then you must learn to recite
            it with tajweed. This is compulsory.
          </p>
<br />
          <h3>So what is <strong>tajweed</strong>?</h3>
          <br />
          <p>

            Tajweed literally means to “make perfect,” but here, it means to
            recite each letter and each word with its own set of rules,
            correctly.
          </p>
<br />
          <p>
            Tajweed is so important in the recitation of the Quran. If a person
            fails to read with tajweed despite knowing the rules, he would be
            sinful.
          </p>
          <br />
          <button onClick={() => navigate("/login")} className="learn-btn">Learn For Free</button>
        </div>
      </div>
    </section>
  );
};

export default TajweedSection;
