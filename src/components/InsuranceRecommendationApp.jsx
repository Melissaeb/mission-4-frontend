import { useEffect, useState } from "react";
import superagent from "superagent";
import styles from "./InsuranceRecommendationApp.module.css";

import minimiseIcon from "/images/minimiseIcon.svg";
import maximiseIcon from "/images/maximiseIcon.svg";

export default function InsuranceRecommendationApp() {
  const [minimise, setMinimise] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [disableSend, setDisableSend] = useState(false);

  async function sendMessage(event) {
    event.preventDefault();
    setHistory((prev) => [
      ...prev,
      { role: "user", parts: [{ text: message }] },
    ]);
    setMessage("");
    try {
      const { text } = await superagent
        .post(import.meta.env.VITE_BACKEND_URL + "/gemini")
        .send({ message, history });

      setHistory((prev) => [
        ...prev,
        { role: "model", parts: [{ text: text }] },
      ]);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    setHistory([
      {
        role: "user",
        parts: [{ text: `Hi there.` }],
      },
      {
        role: "model",
        parts: [
          {
            text: "Hello, I'm Tinnie, your personal insurance advisor. I'm here to help you to choose an insurance policy.  May I ask you a few personal questions to make sure I recommend the best policy for you?",
          },
        ],
      },
    ]);
  }, []);

  return (
    <div
      className={`${styles.appContainer} ${minimise ? styles.minimised : ""}`}
    >
      <header className={styles.chatHeader}>
        <h3 className={styles.chatTitle}>Tinnie</h3>
        <button
          className={styles.minimiseButton}
          onClick={() => setMinimise(!minimise)}
        >
          <img
            src={minimise ? maximiseIcon : minimiseIcon}
            alt="minimise"
            className={styles.icon}
          />
        </button>
      </header>
      <div
        className={` ${styles.chatHistoryAndInput} ${
          minimise ? styles.hidden : ""
        }`}
      >
        <div className={styles.chatHistory}>
          {history.map(({ role, parts }, i) => {
            return (
              <div
                className={`${styles.chatBox} ${
                  role === "user" ? styles.myChatBox : styles.modelChatBox
                }`}
                key={i}
              >
                {role == "user" ? (
                  <p className={styles.myChat}>
                    {"Me"}: {parts[0].text}
                  </p>
                ) : (
                  <p className={styles.modelChat}>{parts[0].text}</p>
                )}
              </div>
            );
          })}
        </div>
        <form className={styles.formContainer}>
          <input
            type="text"
            className={styles.messageInput}
            onChange={(event) => {
              setMessage(event.target.value);
            }}
            value={message}
            placeholder="What would you like to say?"
          />
          <button
            type="submit"
            className={styles.sendButton}
            onClick={sendMessage}
          >
            SEND
          </button>
        </form>
      </div>
    </div>
  );
}
