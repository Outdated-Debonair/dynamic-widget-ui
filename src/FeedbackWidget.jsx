import { useEffect, useState } from "react";
import "./FeedbackWidget.css";

export default function FeedbackForm() {
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/getQuestions", {
                    method: "GET",
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const data = await res.json();
                if (data.message === "success") {
                    setQuestions(data.questions);
                }
            } catch (err) {
                console.error("Error fetching questions:", err);
            }
        };
        fetchQuestions();

        const eventSource = new EventSource("http://localhost:4000/api/events");

        // eventSource.onmessage = (event) => {
        //     try {
        //         const newData = JSON.parse(event.data);
        //         console.log("SSE new question:", newData);
        //         // Add only if not already in the list
        //         setQuestions((prev) => {
        //             const exists = prev.some(q => q.questionid === newData.payload.questionid);
        //             if (exists) return prev;
        //             return [...prev, newData.payload];
        //         });
        //     } catch (e) {
        //         console.error("Invalid SSE data:", e);
        //     }
        // };

        eventSource.onmessage = (event) => {
            try {
                const newData = JSON.parse(event.data);
                console.log("SSE update:", newData);

                const { type, payload } = newData;

                setQuestions((prev) => {
                    switch (type) {
                        case "CREATE_QUESTION":
                            // Add only if not already there
                            if (prev.some(q => q.questionid === payload.questionid)) return prev;
                            return [...prev, payload];

                        case "UPDATE_QUESTION":
                            // Update text/status/type etc.
                            return prev.map(q =>
                                q.questionid === payload.questionid ? { ...q, ...payload } : q
                            );

                        case "UNPUBLISH_QUESTION":
                            // Mark as unpublished (but keep in list)
                            return prev.map(q =>
                                q.questionid === payload.questionid ? { ...q, status: "unpublished" } : q
                            );

                        case "DELETE_QUESTION":
                            // If you support deletes, remove completely
                            return prev.filter(q => q.questionid !== payload.questionid);

                        default:
                            return prev;
                    }
                });
            } catch (e) {
                console.error("Invalid SSE data:", e);
            }
        };


        eventSource.onerror = (err) => {
            console.error("SSE error:", err);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, []);

    const handleChange = (questionid, value) => {
        setAnswers((prev) => ({ ...prev, [questionid]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            responses: questions
                .filter((q) => q.status === "published")
                .map((q) => ({
                    questionId: q.questionid,
                    radioBtn: q.questiontype === "radioBtn" ? answers[q.questionid] === "yes" : false,
                    ratingScale: q.questiontype === "rating" ? Number(answers[q.questionid]) || -1 : -1,
                    textField: q.questiontype === "text" ? answers[q.questionid] || "" : "",
                })),
        };

        try {
            await fetch("http://localhost:4000/api/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify(payload),
            });
            setSubmitted(true);
        }
        catch (err) {
            console.error("Error submitting feedback:", err);
        }
    };

    if (submitted) {
        return <h2>🎉 Thank you for your feedback!</h2>;
    }

    return (
        <div>
            <form className="feedback-form" onSubmit={handleSubmit}>
                <h1 className="feedback-form-title">Feedback Form</h1>

                {questions
                    ?.filter((q) => q.status === "published")
                    .map((q) => (
                        <div key={q.questionid} className="question-block">
                            <p>{q.questiontext}</p>

                            {/* Yes/No */}
                            {q.questiontype === "radioBtn" && (
                                <div>
                                    <label>
                                        <input
                                            type="radio"
                                            name={`question-${q.questionid}`}
                                            value="yes"
                                            checked={answers[q.questionid] === "yes"}
                                            onChange={() => handleChange(q.questionid, "yes")}
                                            required
                                        />
                                        Yes
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name={`question-${q.questionid}`}
                                            value="no"
                                            checked={answers[q.questionid] === "no"}
                                            onChange={() => handleChange(q.questionid, "no")}
                                            required
                                        />
                                        No
                                    </label>
                                </div>
                            )}

                            {/* Rating 1-5 */}
                            {q.questiontype === "rating" && (
                                <div className="rating-scale">
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <button
                                            key={rating}
                                            type="button"
                                            className={`rating-btn ${answers[q.questionid] === rating ? "selected" : ""}`}
                                            onClick={() => handleChange(q.questionid, rating)}
                                        >
                                            {rating}
                                        </button>
                                    ))}
                                </div>
                            )}


                            {/* Text Field */}
                            {q.questiontype === "text" && (
                                <textarea
                                    rows="3"
                                    value={answers[q.questionid] || ""}
                                    onChange={(e) => handleChange(q.questionid, e.target.value)}
                                    placeholder="Write your feedback here..."
                                    required={q.istextfieldrequired}
                                />
                            )}
                        </div>
                    ))}

                <button type="submit">Submit Feedback</button>
            </form>
        </div>
    );
}


