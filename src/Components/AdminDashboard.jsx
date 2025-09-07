import React, { useEffect, useState } from "react";
import QuestionItem from "./QuestionItem.jsx";
import ResponsesPanel from "./ResponsesPanel.jsx";
import EditQuestionModal from "./EditQuestionModal.jsx";
import NewQuestionModal from "./NewQuestionModal.jsx";
import "../Styles/AdminDashboard.css"

export default function AdminDashboard() {
    const [questions, setQuestions] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [showNewModal, setShowNewModal] = useState(false);
    const [updateResponse, setUpdateResponse] = useState(false);

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
    }, []);

    useEffect(() => {
        const eventSource = new EventSource("http://localhost:4000/api/events", {
            withCredentials: true,
        });

        eventSource.onmessage = (event) => {
            try {
                const newData = JSON.parse(event.data);
                console.log("SSE event:", newData);

                if (newData.type === "NEW_QUESTION") {
                    setQuestions((prev) => [...prev, newData.payload]);
                }

                if (newData.type === "UPDATE_QUESTION") {
                    setQuestions((prev) =>
                        prev.map((q) =>
                            q.questionid === newData.payload.questionid
                                ? { ...q, ...newData.payload }
                                : q
                        )
                    );
                }

                if (newData.type === "UNPUBLISH_QUESTION") {
                    setQuestions((prev) =>
                        prev.map((q) =>
                            q.questionid === newData.payload.questionid
                                ? { ...q, status: "unpublished" }
                                : q
                        )
                    );
                }

                if (newData.type === "NEW_RESPONSE" && selectedQuestion) {
                    if (newData.payload.questionid === selectedQuestion.questionid) {
                        setSelectedQuestion((q) => ({ ...q }));
                    }
                }

                if(newData.type === "USER_RESPONSE") {
                    setUpdateResponse(prev => !prev);
                }
            } catch (err) {
                console.error("Error parsing SSE message:", err);
            }
        };

        eventSource.onerror = (err) => {
            console.error("SSE error:", err);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [selectedQuestion]);

    const handleUnpublish = async (id, status) => {
        try {
            await fetch(`http://localhost:4000/api/questions/${id}/status`, {
                method: "PATCH",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status: !status ? "published" : "unpublished" })
            });
            setQuestions((prev) =>
                prev.map((q) =>
                    q.questionid === id ? { ...q, status: !status ? "published" : "unpublished" } : q
                )
            );
        } catch (err) {
            console.error("Error unpublishing question:", err);
        }
    };

    const handleSaveEdit = async (id, newText) => {
        try {
            await fetch(`http://localhost:4000/api/questions/${id}`, {
                method: "PUT",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ questionText: newText }),
            });
            setQuestions((prev) =>
                prev.map((q) =>
                    q.questionid === id ? { ...q, questiontext: newText } : q
                )
            );
            setEditingQuestion(null);
        } catch (err) {
            console.error("Error editing question:", err);
        }
    };

    const handleCreateQuestion = async (newQ) => {
        try {
            const res = await fetch("http://localhost:4000/api/questions", {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newQ),
            });
            const data = await res.json();
            if (data.message === "success") {
                setQuestions((prev) => [...prev, data.question]);
            }
            setShowNewModal(false);
        } catch (err) {
            console.error("Error creating question:", err);
        }
    };

    return (
        <div className="dashboard">
            <div className="header">
                <h2 className="poppins-regular">Manage Questions</h2>
                <button className="new-btn" onClick={() => setShowNewModal(true)}>
                    + New Question
                </button>
            </div>

            <div className="content">
                <div className="questions-list">
                    {questions && questions.length && questions.map((q) => (
                        (q?.questionid && <QuestionItem
                            key={q?.questionid}
                            question={q}
                            onClick={() => setSelectedQuestion(q)}
                            onEdit={() => setEditingQuestion(q)}
                            onUnpublish={(id, status) => handleUnpublish(q?.questionid, status)}
                        />)
                    ))}
                </div>

                <div className="responses-panel">
                    {selectedQuestion ? (
                        <ResponsesPanel question={selectedQuestion} updateResponse={updateResponse}/>
                    ) : (
                        <p>Select a question to view responses</p>
                    )}
                </div>
            </div>

            {editingQuestion && (
                <EditQuestionModal
                    question={editingQuestion}
                    onClose={() => setEditingQuestion(null)}
                    onSave={handleSaveEdit}
                />
            )}

            {showNewModal && (
                <NewQuestionModal
                    onClose={() => setShowNewModal(false)}
                    onSave={handleCreateQuestion}
                />
            )}
        </div>
    );
}