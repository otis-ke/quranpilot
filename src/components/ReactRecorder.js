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
import "./record.css";

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
  const [audioURL, setAudioURL] = useState(null);
  const [textMessage, setTextMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  // Responsive: Determine mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load user data from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setUser(userData);
    }
  }, []);

  // Listen to messages for the logged-in user
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

  // Create object URL for the recorded blob
  useEffect(() => {
    if (recordBlob) {
      const url = URL.createObjectURL(recordBlob);
      setAudioURL(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setAudioURL(null);
    }
  }, [recordBlob]);

  const onStop = (recordedBlob) => {
    setRecordBlob(recordedBlob.blob);
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("upload_preset", "quranpilot");
    formData.append("file", file);

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dwlasndqv/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (response.ok) return data.secure_url;
      throw new Error(data.error?.message || "Upload failed");
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      alert("Audio upload failed. Please try again.");
      return null;
    }
  };

  const handleSend = async () => {
    if (!user) {
      alert("User data not found. Please log in again.");
      return;
    }
    setUploading(true);
    let audioUrl = null;
    if (recordBlob) {
      audioUrl = await uploadToCloudinary(recordBlob);
    }
    if (textMessage || audioUrl) {
      try {
        await addDoc(collection(db, `users/${user.email}/messages`), {
          text: textMessage,
          audio: audioUrl,
          senderName: `${user.firstName} ${user.lastName}`,
          senderEmail: user.email,
          timestamp: new Date().toISOString(),
        });
        setTextMessage("");
        setRecordBlob(null);
      } catch (error) {
        console.error("Error sending message:", error);
        alert("Error sending message. Please try again.");
      }
    }
    setUploading(false);
  };

  const handleDelete = async (id) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, `users/${user.email}/messages`, id));
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Error deleting message.");
    }
  };

  // Helper to check if a message is from the logged-in user
  const isMyMessage = (msg) => msg.senderEmail === user?.email;

  // Adjust container style based on device size
  const containerStyle = isMobileView
    ? styles.container
    : { 
        ...styles.container, 
        margin: "40px 0 40px 40px", // align left on large screens
        maxWidth: "800px" // bigger width on large devices
      };

  return (
    <div style={containerStyle}>
      <h3 style={styles.header}>Chat & Voice Messages with Tutor</h3>
      <div style={styles.messagesContainer}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={
              isMyMessage(msg)
                ? { ...styles.messageBubble, ...styles.myMessage }
                : { ...styles.messageBubble, ...styles.otherMessage }
            }
          >
            <div style={styles.senderInfo}>
              <strong>{msg.senderName}</strong>
            </div>
            {msg.text && <div style={styles.messageText}>{msg.text}</div>}
            {msg.audio && (
              <audio controls src={msg.audio} style={styles.audioPlayer} />
            )}
            <div style={styles.timestamp}>
              {new Date(msg.timestamp).toLocaleString()}
            </div>
            <button
              onClick={() => handleDelete(msg.id)}
              style={styles.deleteButton}
              title="Delete Message"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
      <div style={styles.inputArea}>
        <textarea
          placeholder="Type a message..."
          value={textMessage}
          onChange={(e) => setTextMessage(e.target.value)}
          style={styles.textArea}
        />
        <button
          onClick={() => setIsRecording(!isRecording)}
          style={styles.recordButton}
          disabled={uploading}
          title="Record Audio"
        >
          <FaMicrophone /> {isRecording ? "Stop" : "Record"}
        </button>
        <div style={styles.reactMicContainer}>
          <ReactMic
            record={isRecording}
            onStop={onStop}
            mimeType="audio/webm"
            backgroundColor="transparent"
            style={isMobileView ? styles.reactMicMobile : styles.reactMic}
          />
          {audioURL && (
            <audio controls src={audioURL} style={styles.audioPreview} />
          )}
        </div>
        <button
          onClick={handleSend}
          style={styles.sendButton}
          disabled={uploading}
          title="Send Message"
        >
          <FaPaperPlane /> {uploading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    fontFamily: "'Roboto', sans-serif",
    // Default for mobile: centered with auto margin
    margin: "40px auto",
    maxWidth: "600px",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "20px",
  },
  messagesContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginBottom: "20px",
    maxHeight: "400px",
    overflowY: "auto",
    backgroundColor: "#f5f5f5",
    padding: "10px",
    borderRadius: "8px",
  },
  messageBubble: {
    position: "relative",
    padding: "10px 15px",
    borderRadius: "10px",
    fontSize: "14px",
    lineHeight: "1.4",
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
    wordBreak: "break-word",
  },
  myMessage: {
    backgroundColor: "#8f79f7",
    color: "#fff",
    marginLeft: "auto",
    textAlign: "left",
  },
  otherMessage: {
    backgroundColor: "#fff",
    color: "#333",
    marginRight: "auto",
    textAlign: "left",
  },
  senderInfo: {
    fontSize: "12px",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  messageText: {
    fontSize: "14px",
    marginBottom: "5px",
  },
  timestamp: {
    fontSize: "12px",
    color: "#999",
    textAlign: "right",
  },
  audioPlayer: {
    width: "100%",
    marginTop: "5px",
  },
  deleteButton: {
    position: "absolute",
    top: "5px",
    right: "5px",
    background: "transparent",
    border: "none",
    color: "#666",
    cursor: "pointer",
    fontSize: "14px",
  },
  inputArea: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    borderTop: "1px solid #ddd",
    paddingTop: "10px",
  },
  textArea: {
    width: "100%",
    minHeight: "60px",
    resize: "none",
    borderRadius: "4px",
    border: "1px solid #ccc",
    padding: "8px",
    fontSize: "14px",
  },
  recordButton: {
    backgroundColor: "#28b485",
    color: "#fff",
    padding: "10px 15px",
    borderRadius: "20px",
    cursor: "pointer",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "5px",
  },
  reactMicContainer: {
    width: "100%",
    overflow: "hidden",
  },
  reactMic: {
    width: "100%",
    height: "40px",
    backgroundColor: "transparent",
    border: "none",
  },
  reactMicMobile: {
    width: "100%",
    height: "30px",
    backgroundColor: "transparent",
    border: "none",
  },
  audioPreview: {
    marginTop: "5px",
    width: "100%",
  },
  sendButton: {
    alignSelf: "flex-end",
    backgroundColor: "#ff758c",
    color: "#fff",
    padding: "10px 15px",
    borderRadius: "20px",
    cursor: "pointer",
    border: "none",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
};

export default ReactRecorder;
