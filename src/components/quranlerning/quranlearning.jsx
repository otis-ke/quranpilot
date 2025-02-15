import React from "react";
import { useNavigate } from "react-router-dom";
import teacherQuran from "../assets/withteacher.webp";
import studentImage1 from "../assets/listeningonline.webp";
import studentImage2 from "../assets/listeningonline2.webp";
import image1 from "../assets/words01.webp";
import image2 from "../assets/record4.webp";
import image3 from "../assets/qaidahpage1.webp";
import teacherStudentImage from "../assets/teaching1.webp";
import quranImage from "../assets/Quran.webp"; // Replace with the actual path
import "./ql.css";

const QuranStudySection = () => { 
  const navigate = useNavigate(); // Initialize navigate function
  return (
    <>
      <section className="study-section">
        <div className="study-container">
          <div className="study-text">
            <h2>Want to Learn The Quran From Scratch Without Any Pressure?</h2>
            <p>
              That’s exactly what you’ll be able to do here. You have no one to
              answer to but <em>you will</em> receive feedback from the lesson you
              complete.
            </p>
            <p>
              If you plan on learning the Quran, you must learn via a real live
              qualified teacher, face to face. That is the best way to learn and
              absorb teachings quickly.
            </p>
            <p>
              We would not advise you to learn from Quran Pilot if you have a
              face-to-face teacher available.
            </p>
            <p>
              But as a last resort, if you live remotely or no teacher is
              available, then Quran Pilot is the next best solution.
            </p>
          </div>
          <div className="study-image">
            <img src={teacherQuran} alt="Teacher guiding a child to read Quran" />
          </div>
        </div>
      </section>

      <section className="quran-learning-container">
        <div className="quran-learning-content">
          <div className="quran-learning-images">
            <img src={studentImage1} alt="Student learning Quran" />
            <img src={studentImage2} alt="Student learning Quran" />
          </div>
          <div className="quran-learning-text">
            <p>
              This is a <a href="/">non-live</a> learning program. This means you
              can learn whenever and wherever you wish (although we advise
              learning every single day for better retention). You are not
              constricted to sitting and concentrating in front of a teacher,
              online or offline.
            </p>
            <p>
              Unlike most other programs which simply ask you to go through their
              lessons, here at Quran Pilot, we also invest our time and energy to
              make sure you learn and succeed and can recite the Quran correctly.
              We take time to <a href="/">listen to our students’ lesson recordings</a> 
              and provide feedback on everything they have done. We ask our students 
              to fix any issues before proceeding to the next lesson.
            </p>
            <p>
              If a student doesn’t understand any part of the lesson, we provide a way 
              for the student to ask a question so all doubts and uncertainties are 
              cleared before moving forward.
            </p>
            <p>
              Our <a href="/">qualified</a> teachers also provide valuable feedback explaining 
              where you may have slipped up and what you should change in your mind and 
              tongue to fix it forever.
            </p>
          </div>
        </div>
      </section>


      <section className="practice-section">
      <div className="practice-container">
        <div className="practice-text">
          <h2>Practice Reciting the Quran with Structured Guidance</h2>
          <p>
            Each lesson is mapped out to make sure you progress in logical steps.
            You won’t be asked to pronounce a word that you have not had instruction on.
            As you progress through the lessons, you start to pronounce larger words and then 
            small phrases and then whole sentences. This will then allow you to recite the Quran.
          </p>
          <p>
            At the beginning of every lesson, you will be provided with a video explaining 
            the lesson and things you should know. It will then give you a couple of examples 
            and any important information. After that, you will use that instruction and complete 
            the rest of the lesson with the correct pronunciation. If you make a mistake during your 
            recording of any specific word, you can easily record over it with the correct pronunciation.
          </p>
          <p>
            Once you are done, you can submit the lesson recordings for review. Your lesson will reach us 
            and a teacher will listen to your delivery of the words and then comment on your performance.
          </p>
          <p>
            For our lessons, we will be using a high-rated purpose-built Qaidah, created by Safar Academy.
            If you wish, you can purchase a physical copy of the Qaidah and follow along whilst progressing
            through your lessons online.
          </p>
          <p>
            Makhraj and Tajweed are crucial factors when learning to recite the Quran. There are many people
            who read the Quran today without the correct pronunciation because they were taught by “old school” 
            teachers who didn’t go through this themselves. As a result, many people are learning incorrectly 
            and this is a great disaster upon the ummah.
          </p>
          <p>
            By teaching you everything the right way from the very beginning, we will ensure the correct 
            pronunciation sits on your lips and comes out correctly every single time. There will be no 
            wrong learning which you then have to fix later on. This will be fixed from the start, so you 
            don’t even have to worry about going down the wrong path at all.
          </p>
        </div>
        <div className="practice-images">
          <img src={image1} alt="Quran practice example 1" className="practice-img1" />
          <img src={image2} alt="Quran practice example 2" className="practice-img2" />
          <img src={image3} alt="Quran practice example 3" className="practice-img3" />
        </div>
      </div>
    </section>


    <section className="quran-lessons-section">
      <div className="lessons-container">
        <div className="lessons-image">
          <img src={teacherStudentImage} alt="Teacher and Student Learning Quran" />
        </div>
        <div className="lessons-text">
          <p>
            Ideally, we would like these Quran lessons to be completely free, and InshaAllah, 
            when we are able to automate the whole learning process, it will be.
          </p>
          <p>
            But for the time being, we need to pay our qualified teachers for their time 
            to listen and respond. For this reason, we charge a small monthly nominal fee, 
            just like you would pay if you were sitting in front of a real-time teacher.
          </p>
          <p>
            When you are confident that you can read the Quran correctly with all due care, 
            then you are free to stop these lessons. You are not tied in for any length of time.
          </p>
          <p>
            If you really do not have a real-time teacher and want to get started immediately, 
            then don’t delay a good deed. Use the button below to get started now.
          </p>
        
        </div>
      </div>
    </section>


   




 

 
    <section className="how-to-start">
      <div>
        <h2>How to Start...</h2>
        <p>
          You can get started by joining Quran Pilot and learning from our instructional videos immediately.
        </p>
      </div>

      <div className="start-container">
        <div className="start-text">
          <h3>Click The Button Below To Begin</h3>
          <p className="cost-info">
            The monthly cost to learn the Quran the right way, from the beginning, is <strong>£35</strong>
          </p>
          <h4>At Your Own Pace...</h4>
          <h2 className="quran-pilot">Quran Pilot From Zero</h2>

          {/* Navigate to Signup Page */}
          <button 
            className="start-button"
            onClick={() => navigate("/login")}
          >
            START LEARNING NOW
          </button>
        </div>

        <div className="start-image">
          <h2>£35 Per Month</h2>
          <img src={quranImage} alt="Quran Book Illustration" />
        </div>
      </div>

      <p className="not-ready">
        Not Ready Just Yet?{" "}
        {/* Navigate to Free Lessons Page */}
        <a 
          href="/free-lessons" 
          className="free-lessons"
          onClick={(e) => {
            e.preventDefault();
            navigate("/login");
          }}
        >
          Learn Limited Lessons For <span>FREE</span> – Without Feedback
        </a>
      </p>
    </section>

    <footer className="footer">
      <div className="footer-container">
        {/* Footer Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/">About Us</a></li>
            <li><a href="/">Courses</a></li>
            <li><a href="/">Pricing</a></li>
            <li><a href="/">Contact</a></li>
          </ul>
        </div>

        {/* Support Links */}
        <div className="footer-links">
          <h3>Support</h3>
          <ul>
            <li><a href="/">FAQs</a></li>
            <li><a href="/">Help Center</a></li>
            <li><a href="/">Terms of Service</a></li>
            <li><a href="/">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="footer-social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="/"><i className="fab fa-facebook"></i></a>
            <a href="/"><i className="fab fa-twitter"></i></a>
            <a href="/"><i className="fab fa-instagram"></i></a>
            <a href="/"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Quran Pilot. All Rights Reserved.</p>
      </div>
    </footer>
    </>
  );
};

export default QuranStudySection;
