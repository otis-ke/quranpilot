import React, { useState, useEffect } from "react";
import { ReactMic } from "react-mic";
import { initializeApp } from "firebase/app";
import { FaTrash, FaMicrophone, FaPaperPlane } from "react-icons/fa";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import './record.css'

const firebaseConfig = {
  apiKey: "AIzaSyD6xgrttBIm9vw07xRltKsqHZNpS1jJ8xw",
  authDomain: "taistat-f0e1d.firebaseapp.com",
  projectId: "taistat-f0e1d",
  storageBucket: "taistat-f0e1d.firebasestorage.app",
  messagingSenderId: "196742294604",
  appId: "1:196742294604:web:715fe57bf6471221b898e9",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ReactRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordBlob, setRecordBlob] = useState(null);
  const [textMessage, setTextMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setUser(userData);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(
      collection(db, `users/${user.email}/messages`),
      (snapshot) => {
        const msgs = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setMessages(msgs);
      }
    );
    return () => unsubscribe();
  }, [user]);

  const onStop = (recordedBlob) => {
    setRecordBlob(recordedBlob.blob);
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("upload_preset", "quranpilot");
    formData.append("file", file);

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dwlasndqv/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) return data.secure_url;
      throw new Error(data.error?.message || "Upload failed");
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      return null;
    }
  };

  const handleSend = async () => {
    if (!user) {
      alert("User data not found. Please log in again.");
      return;
    }

    let audioUrl = null;
    if (recordBlob) {
      audioUrl = await uploadToCloudinary(recordBlob);
    }

    if (textMessage || audioUrl) {
      await addDoc(collection(db, `users/${user.email}/messages`), {
        text: textMessage,
        audio: audioUrl,
        senderName: `${user.firstName} ${user.lastName}`,
        senderEmail: user.email,
        timestamp: new Date().toISOString(),
      });

      setTextMessage("");
      setRecordBlob(null);
    }
  };

  const handleDelete = async (id) => {
    if (!user) return;
    await deleteDoc(doc(db, `users/${user.email}/messages`, id));
  };

  return (
    <div style={styles.chatContainer}>
      <h3>Chat & Voice Messages with Tutor</h3>
      <div style={styles.messages}>
        {messages.map((msg) => (
          <div key={msg.id} style={styles.message}>
            <p><strong>{msg.senderName}</strong></p>
            <p style={styles.timestamp}>{new Date(msg.timestamp).toLocaleString()}</p>
            <p style={styles.messageText}>{msg.text}</p>
            {msg.audio && <audio controls src={msg.audio} style={styles.audioPlayer} />}
            <button onClick={() => handleDelete(msg.id)} style={styles.deleteButton}><FaTrash /></button>
          </div>
        ))}
      </div>
      <textarea
        placeholder="Type a message..."
        value={textMessage}
        onChange={(e) => setTextMessage(e.target.value)}
        style={styles.textArea}
      />
      <button onClick={() => setIsRecording(!isRecording)} style={styles.recordButton}>
        <FaMicrophone /> {isRecording ? "Stop" : "Record"}
      </button>
      <ReactMic
        record={isRecording}
        onStop={onStop}
        mimeType="audio/webm"
        style={styles.reactMic}
      />
      {recordBlob && (
        <audio controls src={URL.createObjectURL(recordBlob)} style={styles.audioPlayer} />
      )}
      <button onClick={handleSend} style={styles.sendButton}><FaPaperPlane /> Send</button>
    </div>
  );
};

const styles = {
  chatContainer: {
    maxWidth: "500px",
    margin: "auto",
    padding: "20px",
    background: "linear-gradient(135deg, #84fab0, #8fd3f4)", // Gradient background
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    overflow: "hidden", // Ensures children stay inside container
  },
  messages: {
    display: "flex",
    borderRadius: "8px",
    
    flexDirection: "column",
    gap: "20px",
    marginBottom: "20px"
    
   
  },
  messageText: {
    padding: "10px",
    background: "linear-gradient(135deg,rgb(0, 48, 18),hsl(241, 83.90%, 24.30%))", // Matching gradient
    borderRadius: "8px",
    color: "white",
  },
  timestamp: {
    fontSize: "12px",
    color: "#fff",
    padding: "2px 6px",
    backgroundColor: "#333", // Dark background to differentiate timestamp
    borderRadius: "5px",
    display: "inline-block",
  },
  textArea: {
    width: "100%",
    minHeight: "80px",
    borderRadius: "8px",
    padding: "10px",
  },
  sendButton: {
    background: "linear-gradient(90deg, #ff7eb3, #ff758c)",
    color: "#fff",
    padding: "10px",
    borderRadius: "20px",
    cursor: "pointer",
  },
  recordButton: {
    background: "linear-gradient(90deg, #7ed56f, #28b485)",
    color: "#fff",
    padding: "10px",
    borderRadius: "20px",
    cursor: "pointer",
  },
  deleteButton: {
    background: "#ff4d4d",
    color: "white",
    padding: "5px",
    borderRadius: "5px",
  },
  reactMic: {
    width: "100%", // Ensures it fits within the container
    maxHeight: "100px", // Prevents overflow on small devices
    overflow: "hidden",
  },
  audioPlayer: {
    width: "100%",
    marginTop: "10px",
  },
};

export default ReactRecorder;
