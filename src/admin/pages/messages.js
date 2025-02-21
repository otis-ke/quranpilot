import React, { useState, useEffect } from "react";
import { ReactMic } from "react-mic";
import { initializeApp, getApps } from "firebase/app";
import { FaTrash, FaMicrophone, FaPaperPlane } from "react-icons/fa";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyD6xgrttBIm9vw07xRltKsqHZNpS1jJ8xw",
  authDomain: "taistat-f0e1d.firebaseapp.com",
  projectId: "taistat-f0e1d",
  storageBucket: "taistat-f0e1d.firebasestorage.app",
  messagingSenderId: "196742294604",
  appId: "1:196742294604:web:715fe57bf6471221b898e9",
};

// Initialize Firebase only if not already initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

const Messages = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordBlob, setRecordBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [textMessage, setTextMessage] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Load admin (logged in) user data from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) setLoggedInUser(userData);
  }, []);

  // Fetch only users that have messages in their subcollection
  useEffect(() => {
    const fetchUsers = async () => {
      const usersArr = [];
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      await Promise.all(
        usersData.map(async (user) => {
          const messagesSnapshot = await getDocs(
            collection(db, `users/${user.email}/messages`)
          );
          if (messagesSnapshot.size > 0) {
            usersArr.push(user);
          }
        })
      );
      setUsers(usersArr);
    };
    fetchUsers();
  }, []);

  // Listen to messages for the selected user (sorted oldest at the top)
  useEffect(() => {
    if (!selectedUser) return;
    const unsubscribe = onSnapshot(
      collection(db, `users/${selectedUser.email}/messages`),
      (snapshot) => {
        const msgs = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
          ); // Oldest messages first
        setMessages(msgs);
      }
    );
    return () => unsubscribe();
  }, [selectedUser]);

  // Create an object URL for the recorded blob and clean it up when it changes.
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
    if (!loggedInUser || !selectedUser) {
      alert("Please select a user and ensure you're logged in.");
      return;
    }

    setUploading(true);
    let audioUrl = null;
    if (recordBlob) {
      audioUrl = await uploadToCloudinary(recordBlob);
    }

    if (textMessage || audioUrl) {
      try {
        await addDoc(
          collection(db, `users/${selectedUser.email}/messages`),
          {
            text: textMessage,
            audio: audioUrl,
            senderName: `${loggedInUser.firstName} ${loggedInUser.lastName}`,
            senderEmail: loggedInUser.email,
            timestamp: new Date().toISOString(),
          }
        );
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
    if (!selectedUser) return;
    try {
      await deleteDoc(
        doc(db, `users/${selectedUser.email}/messages`, id)
      );
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Error deleting message.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>All Users</h2>
      <div style={styles.userList}>
        {users.map((user) => (
          <div
            key={user.id}
            style={
              selectedUser && selectedUser.id === user.id
                ? styles.selectedUser
                : styles.userCard
            }
            onClick={() => setSelectedUser(user)}
          >
            {user.firstName} {user.lastName} ({user.email})
          </div>
        ))}
      </div>

      {selectedUser && (
        <div style={styles.chatContainer}>
          <h3>
            Chat with {selectedUser.firstName} {selectedUser.lastName}
          </h3>
          <div style={styles.messages}>
            {messages.map((msg) => (
              <div key={msg.id} style={styles.message}>
                <p>
                  <strong>{msg.senderName}</strong> ({msg.senderEmail})
                </p>
                <p style={styles.timestamp}>
                  {new Date(msg.timestamp).toLocaleString()}
                </p>
                <p style={styles.messageText}>{msg.text}</p>
                {msg.audio && (
                  <audio
                    controls
                    src={msg.audio}
                    style={styles.audioPlayer}
                  />
                )}
                <button
                  onClick={() => handleDelete(msg.id)}
                  style={styles.deleteButton}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
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
          >
            <FaMicrophone /> {isRecording ? "Stop" : "Record"}
          </button>
          <ReactMic
            record={isRecording}
            onStop={onStop}
            mimeType="audio/webm"
            style={styles.reactMic}
          />
          {audioURL && (
            <audio controls src={audioURL} style={styles.audioPlayer} />
          )}
          <button
            onClick={handleSend}
            style={styles.sendButton}
            disabled={uploading}
          >
            <FaPaperPlane /> {uploading ? "Sending..." : "Send"}
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: "20px" },
  userList: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  userCard: {
    padding: "10px",
    background: "#ddd",
    cursor: "pointer",
    borderRadius: "5px",
  },
  selectedUser: {
    padding: "10px",
    background: "#007BFF",
    color: "white",
    cursor: "pointer",
    borderRadius: "5px",
  },
  chatContainer: {
    maxWidth: "500px",
    margin: "auto",
    padding: "20px",
    background: "linear-gradient(135deg, #84fab0, #8fd3f4)",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    overflow: "hidden",
    border: "1px solid #ccc",
  },
  messages: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginBottom: "20px",
    maxHeight: "300px",
    overflowY: "auto",
    borderRadius: "8px",
    backgroundColor: "#fff",
    padding: "10px",
  },
  message: {
    padding: "10px",
    borderBottom: "1px solid #ccc",
    backgroundColor: "#f9f9f9",
    borderRadius: "5px",
  },
  messageText: {
    padding: "10px",
    background:
      "linear-gradient(135deg, rgb(0, 48, 18), hsl(241, 83.90%, 24.30%))",
    borderRadius: "8px",
    color: "white",
  },
  timestamp: {
    fontSize: "12px",
    color: "#fff",
    padding: "2px 6px",
    backgroundColor: "#333",
    borderRadius: "5px",
    display: "inline-block",
  },
  textArea: {
    width: "100%",
    minHeight: "80px",
    borderRadius: "8px",
    padding: "10px",
    marginBottom: "10px",
  },
  sendButton: {
    background: "linear-gradient(90deg, #ff7eb3, #ff758c)",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "20px",
    cursor: "pointer",
    border: "none",
    marginRight: "10px",
  },
  recordButton: {
    background: "linear-gradient(90deg, #7ed56f, #28b485)",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "20px",
    cursor: "pointer",
    border: "none",
    marginBottom: "10px",
  },
  deleteButton: {
    background: "#ff4d4d",
    color: "white",
    padding: "5px 10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
  },
  reactMic: {
    width: "100%",
    maxHeight: "100px",
    overflow: "hidden",
  },
  audioPlayer: {
    width: "100%",
    marginTop: "10px",
  },
};

export default Messages;
