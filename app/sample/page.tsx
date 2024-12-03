

// "use client";
// import React, { useState, useEffect } from "react";
// import aptitudeData from "../../public/aptitude.json";
// import reasoningData from "../../public/reasoning.json";
// import { supabase } from "@/utils/supabaseClient";

// // Sign-In Component
// const SignIn = ({ onSignIn }: { onSignIn: (email: string) => void }) => {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   // const handleSubmit = () => {
//   //   if (email && username) {
//   //     onSignIn(email, username); // Call the function passed via props
//   //   } else {
//   //     alert("Please fill in all fields.");
//   //   }
//   // };
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// if (!isValidEmail) {
//   setError("Please enter a valid email.");
//   return;
// }
//     // Clear previous messages
//     setMessage(null);
//     setError(null);

//     const { data, error } = await supabase.auth.signInWithOtp({ email });
//       options: { emailRedirectTo: window.location.origin }
//     if (error) {
//       setError(`Error: ${error.message}`);
//       console.error('Error signing in:', error.message);
//     } else {
//       setMessage('OTP sent to your email. Please check your inbox.');
//       console.log('OTP sent:', data);
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
//       <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
//       <form onSubmit={handleSubmit} className="mb-4 flex flex-col items-center">      
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="border border-gray-300 p-2 rounded w-full mb-2"
//         />
//       <button
//         className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-all duration-300"
//       >
//         Sign In
//       </button>
//       </form>
//     </div>
//   );
// };

// // Main Game Page Component
// const Page = () => {
//   const [signedIn, setSignedIn] = useState(false);
//   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
//   const [questions, setQuestions] = useState<{ question: string; answer: string }[]>([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [userAnswers, setUserAnswers] = useState<string[]>([]);
//   const [showGameUI, setShowGameUI] = useState(false);
//   const [isExamFinished, setIsExamFinished] = useState(false);
//   const [score, setScore] = useState(0);
//   const [totalTime, setTotalTime] = useState(0);
//   const [saveMessage, setSaveMessage] = useState("");
//   const [isInputLocked, setIsInputLocked] = useState(false);
//   const [showResults, setShowResults] = useState(false);
//   const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
//   const [userDetails, setUserDetails] = useState<{
//     email: string;

   
//   } | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const questionsPerPage = 25;
//   // Track question status (red, green, violet)
//   const [questionStatus, setQuestionStatus] = useState<string[]>([]); // red, green, violet for each question

//   // const handleCategoryChange = (category: string) => {
//   //   setSelectedCategories((prev) =>
//   //     prev.includes(category) ? prev.filter((cat) => cat !== category) : [...prev, category]
//   //   );
//   // };
//   const handleCategoryChange = (category: string) => {
//     setSelectedCategories([category]); // Only one category should be selected
//   };

//   const handleSaveClick = () => {
//     const currentAnswer = userAnswers[currentQuestionIndex]; // Get the current answer
//     handleAnswerSave(currentAnswer); // Call the function with the current answer
//   };
//   const paginateQuestions = () => {
//     const indexOfLastQuestion = currentPage * questionsPerPage;
//     const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
//     return questions.slice(indexOfFirstQuestion, indexOfLastQuestion);
//   };

//   const nextPage = () => {
//     if (currentPage < Math.ceil(questions.length / questionsPerPage)) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const prevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const startGame = () => {
//     const selectedQuestions = [
//       ...selectedCategories.includes('Aptitude') ? aptitudeData.riddles : [],
//       ...selectedCategories.includes('Reasoning') ? reasoningData.riddles : [],
//     ];
//     setQuestions(selectedQuestions);
//     setUserAnswers(new Array(selectedQuestions.length).fill(''));
//     setShowGameUI(true);
//     setCurrentQuestionIndex(0);
//     setTotalTime(selectedQuestions.length * 60); // Total time: 5 minutes for 5 questions
//     setQuestionStatus(new Array(selectedQuestions.length).fill("red")); // Initially all red (unanswered)
//     // Start the timer
//     if (selectedQuestions.length > 0) {
//       const interval = setInterval(() => {
//         setTotalTime((prev) => {
//           if (prev <= 1) {
//             clearInterval(interval);
//             setIsExamFinished(true);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//       setTimerId(interval); // Store the timer ID for later use
//     }
//   };

//   const handleNextQuestion = () => {
//     setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
//   };

//   const handleAnswerSave = (answer: string) => {
//     const newAnswers = [...userAnswers];
//     newAnswers[currentQuestionIndex] = answer;
//     setUserAnswers(newAnswers);

//     const newStatus = [...questionStatus];
//     newStatus[currentQuestionIndex] = "green"; // Mark as saved (green)
//     setQuestionStatus(newStatus);

//    // setSaveMessage("Your answer has been saved!");
//     setTimeout(() => setSaveMessage(""), 500);
//   };

//   const handleReviewQuestion = () => {
//     const newStatus = [...questionStatus];
//     newStatus[currentQuestionIndex] = "violet"; // Mark as review (violet)
//     setQuestionStatus(newStatus);
//   };

//   const handleSubmitFinal = () => {
//     let finalScore = 0;

//     userAnswers.forEach((userAnswer, index) => {
//       if (
//         questions[index].answer.toLowerCase().replace(/[^a-zA-Z0-9]/g, "").includes(
//           userAnswer.toLowerCase().replace(/[^a-zA-Z0-9]/g, "").trim()
//         )
//       ) {
//         finalScore += 1;
//       }
//     });

//     setScore(finalScore);
//     setIsExamFinished(true);
//     setIsInputLocked(true);
//     if (timerId) {
//       clearInterval(timerId);
//     }
//   };
//   const toggleResults = () => {
//     setShowResults((prev) => !prev); // Toggle the showResults state
//   };
//   const onSignIn = (email: string) => {
//     setUserDetails({ email});
//     setSignedIn(true); // Mark the user as signed in
//   };

//   const checkAnswerBoxColor = (index: number) => {
//     const answer = userAnswers[index];
//     if (!answer || answer.trim() === "") {
//       return "bg-red-500"; // No answer or cleared answer
//     }
//     return "bg-green-500"; // Answer provided
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
//       {!signedIn ? (
//         <SignIn onSignIn={onSignIn}/>
//       ) : (
//         <>
//           <h1 className="text-2xl font-bold mb-4">Mock Test</h1>
//           {!showGameUI && (
//             <div className="mb-6 space-y-2">
//               <label className="flex items-center space-x-2">
//                 <input
//                   type="radio"
//                   onChange={() => handleCategoryChange("Aptitude")}
//                   checked={selectedCategories.includes("Aptitude")}
//                 />
//                 <span>Aptitude</span>
//               </label>
//               <label className="flex items-center space-x-2">
//                 <input
//                   type="radio"
//                   onChange={() => handleCategoryChange("Reasoning")}
//                   checked={selectedCategories.includes("Reasoning")}
//                 />
//                 <span>Reasoning</span>
//               </label>
//             </div>
//           )}
//           <button
//             onClick={startGame}
//             disabled={selectedCategories.length === 0}
//             className={`${
//               selectedCategories.length === 0
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-blue-500 hover:bg-blue-600"
//             } text-white px-4 py-2 rounded mb-6 transition-all duration-300`}
//           >
//             Start Test
//           </button>

//           {showGameUI && (
//             <div className="flex w-full">
//               <div className="w-1/4 p-4 ">
//                 <div className="grid grid-cols-5 gap-y-4">
//                   {paginateQuestions().map((_, index) => (
//                     <button
//                       key={index}
//                       className={`w-8 h-8 space-y-2 space-x-2 flex items-center justify-center text-white rounded ${questionStatus[index + (currentPage - 1) * questionsPerPage] === "red"
//                           ? "bg-red-500"
//                           : questionStatus[index + (currentPage - 1) * questionsPerPage] === "green"
//                             ? "bg-green-500"
//                             : "bg-violet-500"
//                         }`}
//                       onClick={() => setCurrentQuestionIndex(index + (currentPage - 1) * questionsPerPage)}
//                     >
//                       {index + 1 + (currentPage - 1) * questionsPerPage}
//                     </button>
//                   ))}
                  
//                 </div>
//                 <div className="flex justify-between w-full mt-6 space-x-1">
//             <button onClick={prevPage} disabled={currentPage === 1} className="bg-gray-500 text-white px-4 py-2 rounded">
//               Previous
//             </button>
//             <button
//               onClick={nextPage}
//               disabled={currentPage === Math.ceil(questions.length / questionsPerPage)}
//               className="bg-gray-500 text-white px-4 py-2 rounded"
//             >
//               Next
//             </button>
//           </div>
//               </div>
//               <div className="flex flex-col justify-between p-6 w-full">
//               <div className="flex flex-row justify-between">
//                 <h2 className="text-xl font-semibold mb-3">Question:</h2>
//                 <span className="text-lg font-bold text-red-600">Overall Time: {Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}</span>
//                 </div>
//                 <p className="text-lg font-medium mb-4">{paginateQuestions()[currentQuestionIndex % questionsPerPage]?.question}</p>                <input
//                   type="text"
//                   value={userAnswers[currentQuestionIndex]}
//                   onChange={(e) => setUserAnswers([...userAnswers.slice(0, currentQuestionIndex), e.target.value, ...userAnswers.slice(currentQuestionIndex + 1)])}
//                   disabled={isInputLocked}
//                   className="border border-gray-300 p-2 rounded mb-4"
//                 />
//                 <div className="space-x-3 justify-around self-center">
//                 <button
//                     onClick={handleSaveClick}
//                     className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-all duration-300"
//                   >
//                     Save Answer
//                   </button>
//                   <button
//                     onClick={handleReviewQuestion}
//                     className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition-all duration-300"
//                   >
//                     Review Question
//                   </button>
//                   <button
//                     onClick={handleNextQuestion}
//                     className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-all duration-300"
//                   >
//                     Next Question
//                   </button>
//                   {/* <button
//                   onClick={handleSubmitFinal}
//                   className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded transition-all duration-300"
//                 >
//                   Submit Final
//                 </button> */}
//                 <button
//                   onClick={handleSubmitFinal}
//                   className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded transition-all duration-300"
//                 >
//                   Submit Final
//                 </button>
//                 </div>
//                 {saveMessage && (
//                   <div className="mt-4 text-green-600 font-semibold">{saveMessage}</div>
//                 )}
//               </div>
//               </div>
//           )}
//            {isExamFinished && (
//             <div className="mt-6">
//               <h2 className="text-xl font-semibold mb-3">You are done with the questions!</h2>
//               <button
//                 onClick={toggleResults}
//                 className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 w-full rounded transition-all duration-300 "
//               >
//                 {showResults ? "Hide Results" : "Show Results"}
//               </button>
//             </div>
//           )}

//           {showResults && (
//             <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-lg mt-6">
//               <h2 className="text-2xl font-bold">Test Results</h2>
//               <p className="mb-2">
//                 <strong>Score:</strong> {score} / {questions.length}
//               </p>
//               <div>
//                 {questions.map((q, index) => (
//                   <div key={index} className="mb-4">
//                     <p>
//                       <strong>Question {index + 1}:</strong> {q.question}
//                     </p>
//                     <p>
//                       <strong>Your Answer:</strong> {userAnswers[index]}
//                     </p>
//                     <p>
//                       <strong>Correct Answer:</strong> {q.answer}
//                     </p>
//                     <p
//                       className={`${
//                         userAnswers[index].toLowerCase().trim() ===
//                         q.answer.toLowerCase().trim()
//                           ? "text-green-600"
//                           : "text-red-600"
//                       }`}
//                     >
//                       {userAnswers[index].toLowerCase().trim() ===
//                       q.answer.toLowerCase().trim()
//                         ? "Correct"
//                         : "Incorrect"}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </>
//       )}
     
//     </div>
//   );
// };

// export default Page;




"use client";
import React, { useState, useEffect } from "react";
import aptitudeData from "../../public/aptitude.json";
import reasoningData from "../../public/reasoning.json";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";

// Main Game Page Component
const Page = () => {
  const [signedIn, setSignedIn] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [questions, setQuestions] = useState<{ question: string; answer: string }[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showGameUI, setShowGameUI] = useState(false);
  const [isExamFinished, setIsExamFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [saveMessage, setSaveMessage] = useState("");
  const [isInputLocked, setIsInputLocked] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [userDetails, setUserDetails] = useState<{
    email: string;

   
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 25;
  // Track question status (red, green, violet)
  const [questionStatus, setQuestionStatus] = useState<string[]>([]); // red, green, violet for each question

  // const handleCategoryChange = (category: string) => {
  //   setSelectedCategories((prev) =>
  //     prev.includes(category) ? prev.filter((cat) => cat !== category) : [...prev, category]
  //   );
  // };
  const router = useRouter();
  const handleCategoryChange = (category: string) => {
    setSelectedCategories([category]); // Only one category should be selected
  };

  const handleSaveClick = () => {
    const currentAnswer = userAnswers[currentQuestionIndex]; // Get the current answer
    handleAnswerSave(currentAnswer); // Call the function with the current answer
  };
  const paginateQuestions = () => {
    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    return questions.slice(indexOfFirstQuestion, indexOfLastQuestion);
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(questions.length / questionsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startGame = () => {
    const selectedQuestions = [
      ...selectedCategories.includes('Aptitude') ? aptitudeData.riddles : [],
      ...selectedCategories.includes('Reasoning') ? reasoningData.riddles : [],
    ];
    setQuestions(selectedQuestions);
    setUserAnswers(new Array(selectedQuestions.length).fill(''));
    setShowGameUI(true);
    setCurrentQuestionIndex(0);
    setTotalTime(selectedQuestions.length * 60); // Total time: 5 minutes for 5 questions
    setQuestionStatus(new Array(selectedQuestions.length).fill("red")); // Initially all red (unanswered)
    // Start the timer
    if (selectedQuestions.length > 0) {
      const interval = setInterval(() => {
        setTotalTime((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsExamFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimerId(interval); // Store the timer ID for later use
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
  };
  // const handleLogout = async () => {
  //   const { error } = await supabase.auth.signOut();
  //   if (error) {
  //     console.error("Error logging out:", error.message);
  //   } else {
  //     setSignedIn(false); // Update UI state
  //     setUserDetails(null); // Clear user details
  //     setShowGameUI(false); // Reset game UI

  //   }
  // };
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut(); // Clear Supabase session
      setUserDetails(null); // Clear user details in state
      setSignedIn(false); // Update signed-in status
      router.push('/'); // Navigate to the default page
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleAnswerSave = (answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);

    const newStatus = [...questionStatus];
    newStatus[currentQuestionIndex] = "green"; // Mark as saved (green)
    setQuestionStatus(newStatus);

   // setSaveMessage("Your answer has been saved!");
    setTimeout(() => setSaveMessage(""), 500);
  };

  const handleReviewQuestion = () => {
    const newStatus = [...questionStatus];
    newStatus[currentQuestionIndex] = "violet"; // Mark as review (violet)
    setQuestionStatus(newStatus);
  };

  const handleSubmitFinal = () => {
    let finalScore = 0;

    userAnswers.forEach((userAnswer, index) => {
      if (
        questions[index].answer.toLowerCase().replace(/[^a-zA-Z0-9]/g, "").includes(
          userAnswer.toLowerCase().replace(/[^a-zA-Z0-9]/g, "").trim()
        )
      ) {
        finalScore += 1;
      }
    });

    setScore(finalScore);
    setIsExamFinished(true);
    setIsInputLocked(true);
    if (timerId) {
      clearInterval(timerId);
    }
  };
  const toggleResults = () => {
    setShowResults((prev) => !prev); // Toggle the showResults state
  };
  const onSignIn = (email: string) => {
    setUserDetails({ email});
    setSignedIn(true); // Mark the user as signed in
  };

  const checkAnswerBoxColor = (index: number) => {
    const answer = userAnswers[index];
    if (!answer || answer.trim() === "") {
      return "bg-red-500"; // No answer or cleared answer
    }
    return "bg-green-500"; // Answer provided
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
    
        <>
        <div className="flex flex-row justify-end ">
          <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-whitepx-4 py-2 rounded"
            >
              Logout
            </button>
            </div>
            <h1 className="text-2xl font-bold mb-4">Mock Test</h1>

          {!showGameUI && (
            <div className="mb-6 space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  onChange={() => handleCategoryChange("Aptitude")}
                  checked={selectedCategories.includes("Aptitude")}
                />
                <span>Aptitude</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  onChange={() => handleCategoryChange("Reasoning")}
                  checked={selectedCategories.includes("Reasoning")}
                />
                <span>Reasoning</span>
              </label>
            </div>
          )}
          <button
            onClick={startGame}
            disabled={selectedCategories.length === 0}
            className={`${
              selectedCategories.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white px-4 py-2 rounded mb-6 transition-all duration-300`}
          >
            Start Test
          </button>

          {showGameUI && (
            <div className="flex w-full">
              <div className="w-1/4 p-4 ">
                <div className="grid grid-cols-5 gap-y-4">
                  {paginateQuestions().map((_, index) => (
                    <button
                      key={index}
                      className={`w-8 h-8 space-y-2 space-x-2 flex items-center justify-center text-white rounded ${questionStatus[index + (currentPage - 1) * questionsPerPage] === "red"
                          ? "bg-red-500"
                          : questionStatus[index + (currentPage - 1) * questionsPerPage] === "green"
                            ? "bg-green-500"
                            : "bg-violet-500"
                        }`}
                      onClick={() => setCurrentQuestionIndex(index + (currentPage - 1) * questionsPerPage)}
                    >
                      {index + 1 + (currentPage - 1) * questionsPerPage}
                    </button>
                  ))}
                  
                </div>
                <div className="flex justify-between w-full mt-6 space-x-1">
            <button onClick={prevPage} disabled={currentPage === 1} className="bg-gray-500 text-white px-4 py-2 rounded">
              Previous
            </button>
            <button
              onClick={nextPage}
              disabled={currentPage === Math.ceil(questions.length / questionsPerPage)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Next
            </button>
          </div>
              </div>
              <div className="flex flex-col justify-between p-6 w-full">
              <div className="flex flex-row justify-between">
                <h2 className="text-xl font-semibold mb-3">Question:</h2>
                <span className="text-lg font-bold text-red-600">Overall Time: {Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}</span>
                </div>
                <p className="text-lg font-medium mb-4">{paginateQuestions()[currentQuestionIndex % questionsPerPage]?.question}</p>                <input
                  type="text"
                  value={userAnswers[currentQuestionIndex]}
                  onChange={(e) => setUserAnswers([...userAnswers.slice(0, currentQuestionIndex), e.target.value, ...userAnswers.slice(currentQuestionIndex + 1)])}
                  disabled={isInputLocked}
                  className="border border-gray-300 p-2 rounded mb-4"
                />
                <div className="space-x-3 justify-around self-center">
                <button
                    onClick={handleSaveClick}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-all duration-300"
                  >
                    Save Answer
                  </button>
                  <button
                    onClick={handleReviewQuestion}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition-all duration-300"
                  >
                    Review Question
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-all duration-300"
                  >
                    Next Question
                  </button>
                  {/* <button
                  onClick={handleSubmitFinal}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded transition-all duration-300"
                >
                  Submit Final
                </button> */}
                <button
                  onClick={handleSubmitFinal}
                  className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded transition-all duration-300"
                >
                  Submit Final
                </button>
                </div>
                {saveMessage && (
                  <div className="mt-4 text-green-600 font-semibold">{saveMessage}</div>
                )}
              </div>
              </div>
          )}
           {isExamFinished && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">You are done with the questions!</h2>
              <button
                onClick={toggleResults}
                className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 w-full rounded transition-all duration-300 "
              >
                {showResults ? "Hide Results" : "Show Results"}
              </button>
            </div>
          )}

          {showResults && (
            <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-lg mt-6">
              <h2 className="text-2xl font-bold">Test Results</h2>
              <p className="mb-2">
                <strong>Score:</strong> {score} / {questions.length}
              </p>
              <div>
                {questions.map((q, index) => (
                  <div key={index} className="mb-4">
                    <p>
                      <strong>Question {index + 1}:</strong> {q.question}
                    </p>
                    <p>
                      <strong>Your Answer:</strong> {userAnswers[index]}
                    </p>
                    <p>
                      <strong>Correct Answer:</strong> {q.answer}
                    </p>
                    <p
                      className={`${
                        userAnswers[index].toLowerCase().trim().replace(/[^a-zA-Z0-9]/g, '') ===
                        q.answer.toLowerCase().trim().replace(/[^a-zA-Z0-9]/g, '')
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {userAnswers[index].toLowerCase().trim().replace(/[^a-zA-Z0-9]/g, '') ===
                      q.answer.toLowerCase().trim().replace(/[^a-zA-Z0-9]/g, '')
                        ? "Correct"
                        : "Incorrect"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      
     
    </div>
  );
};

export default Page;
