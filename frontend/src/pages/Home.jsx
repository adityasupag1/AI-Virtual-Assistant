import React, { useContext, useEffect, useRef, useState } from "react";
import { userDataContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import aiVoiceImage from "../assets/ai.gif";
import userVoiceImage from "../assets/user.gif";
import { IoMenu } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";

const Home = () => {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext);
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [ham, setHam] = useState(false);
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);

  const synth = window.speechSynthesis;

  const handleLogOut = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      console.log(result);
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      console.log(error.message);
    }
  };

  const extractSearchQuery = (input, assistantName) => {
    if (!input) return "";
    const name = assistantName.toLowerCase();
    return input
      .toLowerCase()
      .replace(new RegExp(`\\b${name}\\b`, "g"), "")
      .replace(/\bsearch\b/g, "")
      .replace(/\bplay\b/g, "")
      .replace(/\bopen\b/g, "")
      .replace(/\bon google\b/g, "")
      .replace(/\bon youtube\b/g, "")
      .replace(/\bgoogle\b/g, "")
      .replace(/\byoutube\b/g, "")
      .replace(/\bfor\b/g, "")
      .trim();
  };

  const startRecognition = () => {
    try {
      recognitionRef.current?.start();
      setListening(true);
    } catch (error) {
      if (!error.message.includes("start")) {
        console.error("Recognition error : ", error);
      }
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";
    const voice = window.speechSynthesis.getVoices();
    const hindiVoice = voice.find((v) => v.lang === "hi-IN");
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    isSpeakingRef.current = true;
    utterance.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;
      setTimeout(() => {
        startRecognition();
      }, 1000);
    };
    synth.cancel();
    synth.speak(utterance);
  };

  const handleCommand = (aiData) => {
    const { type, userInput, response } = aiData;

    switch (type) {
      case "google_search": {
        const cleanedQuery = extractSearchQuery(userInput, userData.assistantName);
        const query = encodeURIComponent(cleanedQuery);
        window.open(`https://www.google.com/search?q=${query}`, "_blank");
        speak(`Searching Google for ${cleanedQuery}`);
        break;
      }

      case "youtube_search": {
        const cleanedQuery = extractSearchQuery(userInput, userData.assistantName);
        const query = encodeURIComponent(cleanedQuery);
        window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank");
        speak(`Searching YouTube for ${cleanedQuery}`);
        break;
      }

      case "youtube_play": {
        const cleanedQuery = extractSearchQuery(userInput, userData.assistantName);
        const query = encodeURIComponent(cleanedQuery);
        window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank");
        speak(`Playing ${cleanedQuery} on YouTube`);
        break;
      }

      case "calculator_open": {
        window.open("https://www.google.com/search?q=calculator", "_blank");
        speak("Opening calculator.");
        break;
      }

      case "instagram_open": {
        window.open("https://www.instagram.com/", "_blank");
        speak("Opening Instagram.");
        break;
      }

      case "facebook_open": {
        window.open("https://www.facebook.com/", "_blank");
        speak("Opening Facebook.");
        break;
      }

      case "weather_show": {
        const query = encodeURIComponent(userInput || "weather");
        window.open(`https://www.google.com/search?q=${query}`, "_blank");
        speak("Here is the weather update.");
        break;
      }

      case "get_time": {
        const now = new Date();
        const time = now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        speak(`The current time is ${time}`);
        break;
      }

      case "get_date": {
        const now = new Date();
        const date = now.toLocaleDateString();
        speak(`Today's date is ${date}`);
        break;
      }

      case "get_day": {
        const day = new Date().toLocaleDateString("en-US", { weekday: "long" });
        speak(`Today is ${day}`);
        break;
      }

      case "get_month": {
        const month = new Date().toLocaleDateString("en-US", { month: "long" });
        speak(`The current month is ${month}`);
        break;
      }

      case "general": {
        if (response) speak(response);
        break;
      }

      default: {
        console.warn("Unknown AI type:", type);
        speak("I didn't understand that command.");
      }
    }
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    let isMounted = true; // flag to avoid setState on unmounted componet

    const startTimeout = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
          console.log("Recognition requested to Start");
        } catch (error) {
          if (error.name !== "InvalidStateError") {
            console.error("Start error : ", error);
          }
        }
      }
    }, 1000);

    recognition.onstart = () => {
      console.log("Recognition started");
      isRecognizingRef.current = true;
      setListening(true);
      setAiText("");
    };

    recognition.onend = () => {
      console.log("Recognition ended");
      isRecognizingRef.current = false;
      setListening(false);

      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          try {
            recognition.start();
            console.log("Recognition started...");
          } catch (error) {
            if (error.name !== "InvalidStateError") {
              console.error(error);
            }
          }
        }, 1000);
      }
    };

    recognition.onerror = (event) => {
      console.warn("Recognition Error : ", event.error);
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
              console.log("Recognition restarted after error");
            } catch (error) {
              if (error.name !== "InvalidStateError") {
                console.error(error);
              }
            }
          }
        }, 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("Heard:", transcript);

      if (userData?.assistantName && transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        setUserText(transcript);
        setAiText("");

        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);
        const data = await getGeminiResponse(transcript);
        handleCommand(data);
        //  console.log(data);
        setAiText(data.response);
        setUserText("");
      }
    };
    const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with?`);
    greeting.lang = "hi-IN";

    window.speechSynthesis.speak(greeting);

    return () => {
      isMounted = false;
      clearTimeout(startTimeout);
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
    };
  }, []);

  return (
    <div className="w-full overflow-x-hidden min-h-screen bg-linear-to-t relative from-black to-[#030353] flex justify-center items-center flex-col">
      {/* ================= Desktop History Panel ================= */}
      <div
        className="hidden lg:flex fixed top-24 right-5 w-80 h-[60%]
               bg-black/40 backdrop-blur-xl rounded-2xl
               flex flex-col border border-white/10"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-white/10">
          <h1 className="text-white text-lg font-semibold tracking-wide">History</h1>
        </div>

        {/* History List */}
        <div className="flex-1 px-4 py-3 overflow-y-auto">
          <div className="flex flex-col gap-2">
            {userData?.history?.map((item) => (
              <span key={item._id} className="text-white/90 text-sm whitespace-nowrap overflow-x-clip scrollbar-hide">
                {item.command}
              </span>
            ))}

            {userData?.history?.length === 0 && <span className="text-white/50 text-sm">No commands yet</span>}
          </div>
        </div>
      </div>

      {/* ================= Mobile Hamburger Icon ================= */}
      <IoMenu
        onClick={() => setHam(true)}
        className="lg:hidden absolute top-5 right-5 w-7 h-7 text-white cursor-pointer"
      />

      {/* ================= Mobile Slide Menu ================= */}
      <div
        className={`absolute top-0 right-0 z-50 lg:hidden w-full h-full
                bg-black/40 backdrop-blur-xl
                flex flex-col transition-transform duration-300 ease-in-out
                ${ham ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Close Icon */}
        <RxCross2 onClick={() => setHam(false)} className="absolute top-5 right-5 w-7 h-7 text-white cursor-pointer" />

        {/* Actions */}
        <div className="w-full px-5 mt-16 space-y-4">
          <button
            onClick={() => navigate("/customize")}
            className="w-full py-3 rounded-xl bg-white/10 text-white font-semibold
                   backdrop-blur-md active:scale-95 transition"
          >
            Customize Assistant
          </button>

          <button
            onClick={handleLogOut}
            className="w-full py-3 rounded-xl bg-red-500 text-white font-semibold
                   active:scale-95 transition"
          >
            Logout
          </button>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/20 my-6" />

        {/* Mobile History */}
        <div className="flex-1 w-full px-5 overflow-y-auto mb-5">
          <h1 className="text-white text-lg font-semibold mb-3 tracking-wide">History</h1>

          <div className="flex flex-col gap-2">
            {userData?.history?.map((item) => (
              <span key={item._id} className="text-white/90 text-sm whitespace-nowrap overflow-x-clip scrollbar-hide">
                {item.command}
              </span>
            ))}

            {userData?.history?.length === 0 && <span className="text-white/50 text-sm">No commands yet</span>}
          </div>
        </div>
      </div>

      {/* ================= Desktop Top Actions ================= */}
      <div className="hidden lg:flex absolute top-5 right-5 gap-4">
        <button
          onClick={() => navigate("/customize")}
          className="px-5 py-2 text-sm font-semibold rounded-full
                 bg-white/10 text-white backdrop-blur-md
                 hover:bg-white/20 transition-all duration-200"
        >
          Customize Assistant
        </button>

        <button
          onClick={handleLogOut}
          className="px-5 py-2 text-sm font-semibold rounded-full
                 bg-red-500/90 text-white
                 hover:bg-red-600 transition-all duration-200"
        >
          Logout
        </button>
      </div>

      {/* ================= Assistant Avatar ================= */}
      <div className="w-60 h-80 flex justify-center items-center overflow-hidden rounded-4xl">
        <img src={userData?.assistantImage} alt="" className="h-full object-cover" />
      </div>

      {/* ================= Assistant Name ================= */}
      <h1 className="text-[#ffae23] mt-4 text-4.5 font-semibold">I'm {userData?.assistantName}</h1>

      {/* ================= Speech Text ================= */}
      <h1 className="text-white text-xl h-10 my-5 w-[80%] text-center">
        {userText ? userText : aiText ? aiText : null}
      </h1>

      {/* ================= Speaking / Listening Animation ================= */}
      {!aiText && <img src={userVoiceImage} className="w-60" />}
      {aiText && <img src={aiVoiceImage} className="w-60" />}
    </div>
  );
};

export default Home;
