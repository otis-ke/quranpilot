import React from "react";
import "./record.css";
import record2 from '../assets/record2.webp';
import record3 from '../assets/record3.webp';

const RecordResponseSection = () => {
  return (
    <section className="record-response-container">
      <div className="content">
        <h2>Record and Response</h2>
        <p>
          At Quran Pilot, we use a teaching and learning system that most others don’t utilise.
        </p>
        <p>
          You don’t need to sit in front of a web class live at a certain time, maybe in front of a teacher on webcam, or via audio lesson on Skype.
        </p>
        <p>
          You don’t have to provide an immediate answer to your teacher as you do in a real-time situation.
        </p>
        <p>
          A teacher does not have to wait for you to think and respond.
        </p>
        <p>
          Instead, you will learn the lesson as instructed by video, and then you will be given words to practice. As you learn each word, you will be asked to pronounce the word correctly and record that word using our special <em>word record button.</em>
        </p>
        <p>
          Once you have done that for the whole lesson, one of our qualified teachers will listen to your recording to see if you understood the lesson well and if you pronounced the words correctly.
        </p>
        <p>
          The teacher will then provide you with feedback (within 24 hours usually) via an audio file which you can listen to, to see what you did right and what you did wrong and where you may be able to improve.
        </p>
        <p>
          You will also have the ability to leave any questions for the teacher via audio message also, just in case you didn’t understand a part of the lesson.
        </p>
      </div>
      <div className="images-container">
        <img src={record2} alt="Recording UI 1" className="image" />
        <img src={record3} alt="Recording UI 2" className="image" />
      </div>
    </section>
  );
};

export default RecordResponseSection;
