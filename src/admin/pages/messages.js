import React, { useState, useEffect } from "react";
import { ReactMic } from "react-mic";
import { initializeApp, getApps } from "firebase/app";
import { FaTrash, FaMicrophone, FaPaperPlane, FaArrowLeft } from "react-icons/fa";
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
  apiKey: "AIzaSyD6xgrttBIm9vw07xRltKsqHZNp1jJ8xw",
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

  // Determine if we're in mobile view based on screen width
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    // Check initially
    handleResize();
    // Listen for window resize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
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
        await addDoc(collection(db, `users/${selectedUser.email}/messages`), {
          text: textMessage,
          audio: audioUrl,
          senderName: `${loggedInUser.firstName} ${loggedInUser.lastName}`,
          senderEmail: loggedInUser.email,
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
    if (!selectedUser) return;
    try {
      await deleteDoc(doc(db, `users/${selectedUser.email}/messages`, id));
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Error deleting message.");
    }
  };

  // Helper to check if message is from the logged-in user
  const isMyMessage = (msg) => msg.senderEmail === loggedInUser?.email;

  // ---- MOBILE VIEW ----
  if (isMobileView) {
    // If user not selected, show the People list only
    if (!selectedUser) {
      return (
        <div style={styles.mobileContainer}>
          <h2 style={styles.mobileTitle}>People</h2>
          <div style={styles.mobilePeopleList}>
            {users.map((user) => (
              <div
                key={user.id}
                style={styles.mobilePersonItem}
                onClick={() => setSelectedUser(user)}
              >
                {user.firstName} {user.lastName} ({user.email})
              </div>
            ))}
          </div>
        </div>
      );
    }

    // If user is selected, show the chat screen with a back arrow
    return (
      <div style={styles.mobileChatContainer}>
        {/* Chat Header with back arrow */}
        <div style={styles.mobileChatHeader}>
          <button
            onClick={() => setSelectedUser(null)}
            style={styles.backButton}
            title="Go Back"
          >
            <FaArrowLeft />
          </button>
          <div style={styles.chatHeaderName}>
            <strong>
              {selectedUser.firstName} {selectedUser.lastName}
            </strong>
          </div>
        </div>

        {/* Messages */}
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
              {msg.text && (
                <div style={styles.messageText}>{msg.text}</div>
              )}
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

        {/* Input Area */}
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
          {/* Wrap ReactMic in a container that restricts its width */}
          <div style={styles.reactMicContainer}>
            <ReactMic
              record={isRecording}
              onStop={onStop}
              mimeType="audio/webm"
              backgroundColor="transparent"
              style={styles.reactMicMobile}
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
  }

  // ---- DESKTOP / LARGER SCREENS ----
  return (
    <div style={styles.container}>
      {/* Left Sidebar: People */}
      <div style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>People</h2>
        <div style={styles.peopleList}>
          {users.map((user) => (
            <div
              key={user.id}
              style={
                selectedUser && selectedUser.id === user.id
                  ? { ...styles.personItem, ...styles.selectedUser }
                  : styles.personItem
              }
              onClick={() => setSelectedUser(user)}
            >
              {user.firstName} {user.lastName} ({user.email})
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={styles.chatArea}>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div style={styles.chatHeader}>
              <div style={styles.chatHeaderName}>
                <strong>
                  {selectedUser.firstName} {selectedUser.lastName}
                </strong>
              </div>
            </div>

            {/* Messages List */}
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
                  {msg.text && (
                    <div style={styles.messageText}>{msg.text}</div>
                  )}
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

            {/* Input Area */}
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
                  style={styles.reactMic}
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
          </>
        ) : (
          <div style={styles.noUserSelected}>
            <h2>Select a user from the left to start chatting</h2>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 *  STYLES
 *  Customize colors, fonts, sizes, etc., to match your preferences.
 */
const styles = {
  /******************************************************************
   *  SHARED / DESKTOP STYLES
   ******************************************************************/
  container: {
    display: "flex",
    height: "100vh",
    width: "100%",
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: "#f8f8f8",
  },
  sidebar: {
    width: "280px",
    borderRight: "1px solid #ddd",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
    overflowY: "auto",
  },
  sidebarTitle: {
    padding: "15px",
    margin: 0,
    borderBottom: "1px solid #ddd",
    fontSize: "18px",
  },
  peopleList: {
    padding: "10px",
    flex: 1,
  },
  personItem: {
    padding: "10px",
    marginBottom: "5px",
    borderRadius: "5px",
    backgroundColor: "#f0f0f0",
    cursor: "pointer",
    color: "#333",
  },
  selectedUser: {
    backgroundColor: "#007BFF",
    color: "#fff",
  },
  chatArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  chatHeader: {
    padding: "15px 20px",
    borderBottom: "1px solid #ddd",
    backgroundColor: "#fff",
  },
  chatHeaderName: {
    fontSize: "16px",
  },
  messagesContainer: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    backgroundColor: "#f5f5f5",
    display: "flex",
    flexDirection: "column",
  },
  noUserSelected: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  messageBubble: {
    position: "relative",
    padding: "10px 15px",
    margin: "5px 0",
    maxWidth: "60%",
    borderRadius: "10px",
    fontSize: "14px",
    lineHeight: "1.4",
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
    wordBreak: "break-word",
    clear: "both",
  },
  myMessage: {
    backgroundColor: "#8f79f7",
    color: "#fff",
    marginLeft: "auto",
    marginRight: "10px",
    textAlign: "left",
  },
  otherMessage: {
    backgroundColor: "#fff",
    color: "#333",
    marginRight: "auto",
    marginLeft: "10px",
    textAlign: "left",
  },
  senderInfo: {
    fontSize: "12px",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  messageText: {
    fontSize: "14px",
  },
  timestamp: {
    fontSize: "12px",
    color: "#999",
    marginTop: "5px",
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
    borderTop: "1px solid #ddd",
    backgroundColor: "#fff",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
  },
  textArea: {
    width: "100%",
    minHeight: "60px",
    resize: "none",
    borderRadius: "4px",
    border: "1px solid #ccc",
    padding: "8px",
    marginBottom: "10px",
    fontSize: "14px",
  },
  recordButton: {
    backgroundColor: "#28b485",
    color: "#fff",
    padding: "8px 15px",
    borderRadius: "20px",
    cursor: "pointer",
    border: "none",
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    width: "120px",
    justifyContent: "center",
  },
  reactMicContainer: {
    marginBottom: "10px",
    width: "100%",
    overflow: "hidden",
  },
  reactMic: {
    width: "100%",
    maxWidth: "100%",
    height: "40px",
    backgroundColor: "transparent",
    border: "none",
    margin: 0,
    padding: 0,
    display: "block",
  },
  reactMicMobile: {
    width: "100%",
    maxWidth: "100%",
    height: "30px",
    backgroundColor: "transparent",
    border: "none",
    margin: 0,
    padding: 0,
    display: "block",
  },
  audioPreview: {
    marginTop: "5px",
    width: "100%",
  },
  sendButton: {
    alignSelf: "flex-end",
    backgroundColor: "#ff758c",
    color: "#fff",
    padding: "8px 15px",
    borderRadius: "20px",
    cursor: "pointer",
    border: "none",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    width: "120px",
    justifyContent: "center",
  },

  /******************************************************************
   *  MOBILE-SPECIFIC STYLES
   ******************************************************************/
  mobileContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#fff",
  },
  mobileTitle: {
    padding: "15px",
    margin: 0,
    borderBottom: "1px solid #ddd",
    fontSize: "18px",
  },
  mobilePeopleList: {
    flex: 1,
    overflowY: "auto",
    padding: "10px",
  },
  mobilePersonItem: {
    padding: "10px",
    marginBottom: "5px",
    borderRadius: "5px",
    backgroundColor: "#f0f0f0",
    cursor: "pointer",
    color: "#333",
  },
  mobileChatContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#fff",
  },
  mobileChatHeader: {
    display: "flex",
    alignItems: "center",
    padding: "15px",
    borderBottom: "1px solid #ddd",
    backgroundColor: "#fff",
  },
  backButton: {
    background: "transparent",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    marginRight: "10px",
  },
};

export default Messages;
