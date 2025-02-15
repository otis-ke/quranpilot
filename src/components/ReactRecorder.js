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

  // Load user data from local storage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setUser(userData);
    }
  }, []);

  // Fetch messages only for the logged-in user
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

  // When recording stops
  const onStop = (recordedBlob) => {
    setRecordBlob(recordedBlob.blobURL);
  };

  // Send message to Firestore
  const handleSend = async () => {
    if (!user) {
      alert("User data not found. Please log in again.");
      return;
    }

    if (textMessage || recordBlob) {
      await addDoc(collection(db, `users/${user.email}/messages`), {
        text: textMessage,
        audio: recordBlob,
        senderName: `${user.firstName} ${user.lastName}`,
        senderEmail: user.email,
        timestamp: new Date().toISOString(),
      });

      setTextMessage("");
      setRecordBlob(null);
    }
  };

  // Delete message from Firestore
  const handleDelete = async (id) => {
    if (!user) return;
    await deleteDoc(doc(db, `users/${user.email}/messages`, id));
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div style={styles.chatContainer}>
      <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
        Chat & Voice Messages with Tutor
      </h3>

      {/* Messages Section */}
      <div style={styles.messages}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              ...styles.message,
              alignSelf: msg.senderEmail === user?.email ? "flex-end" : "flex-start",
              background: msg.senderEmail === user?.email ? "#007bff" : "#eee",
              color: msg.senderEmail === user?.email ? "#fff" : "#333",
            }}
          >
            <p style={{ fontWeight: "bold", margin: "0" }}>{msg.senderName}</p>
            <p style={styles.timestamp}>{formatTimestamp(msg.timestamp)}</p>
            <p style={styles.messageText}>{msg.text}</p>
            {msg.audio && (
              <audio controls src={msg.audio} style={styles.audioPlayer} />
            )}
            <button style={styles.deleteButton} onClick={() => handleDelete(msg.id)}>
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      {/* Input & Recording Section */}
      <div style={styles.inputContainer}>
        <textarea
          placeholder="Type a message..."
          value={textMessage}
          onChange={(e) => setTextMessage(e.target.value)}
          style={styles.textArea}
        />

        <button onClick={() => setIsRecording(!isRecording)} style={styles.recordButton}>
          <FaMicrophone /> {isRecording ? "Stop Recording" : "Start Recording"}
        </button>

        <ReactMic
          record={isRecording}
          onStop={onStop}
          className="recorder"
          mimeType="audio/webm"
        />

        {recordBlob && (
          <div style={styles.audioPreview}>
            <p>Audio Preview:</p>
            <audio controls src={recordBlob} style={styles.audioPlayer} />
            <button style={styles.dismissButton} onClick={() => setRecordBlob(null)}>
              <FaTrash />
            </button>
          </div>
        )}

        <button onClick={handleSend} style={styles.sendButton}>
          Send <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};


const styles = {
  chatContainer: {
    maxWidth: "500px",
    margin: "auto",
    padding: "20px",
    background: "#f8f9fa",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  messages: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
    wordWrap: "break-word",
  },
  message: {
    padding: "10px",
    borderRadius: "8px",
    maxWidth: "85%",
    wordWrap: "break-word",
  },
  timestamp: {
    fontSize: "12px",
    color: "#fff", // Timestamp text set to white
    margin: "2px 0",
   
  },
  messageText: {
    wordWrap: "break-word",
    margin: "5px 0",
    padding:"10px",
    background: "linear-gradient(135deg, #1e3c72, #2a5298)",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    borderRadius:"8px",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  textArea: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    resize: "none",
    width: "100%",
    minHeight: "80px",
    boxSizing: "border-box",
  },
  sendButton: {
    padding: "10px",
    borderRadius: "20px",
    border: "none",
    background: "linear-gradient(90deg, #ff7eb3, #ff758c)",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    transition: "0.3s",
  },
  recordButton: {
    padding: "10px",
    borderRadius: "20px",
    border: "none",
    background: "linear-gradient(90deg, #7ed56f, #28b485)",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    transition: "0.3s",
  },
  dismissButton: {
    padding: "5px",
    borderRadius: "50%",
    border: "none",
    background: "#ff4d4d",
    color: "#fff",
    fontSize: "14px",
    cursor: "pointer",
    marginLeft: "10px",
  },
  deleteButton: {
    padding: "5px",
    borderRadius: "5px",
    border: "none",
    background: " #2a5298)",
    color: "red",
    fontSize: "12px",
    cursor: "pointer",
    marginTop: "5px",
    alignSelf: "right",
  },
  audioPreview: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#eee",
    padding: "10px",
    borderRadius: "8px",
    flexWrap: "wrap",
  },
  audioPlayer: {
    width: "100%",
    borderRadius: "8px",
    background: "#f1f1f1",
  },
};

export default ReactRecorder;
