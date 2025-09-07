import React, { useState } from "react";

export default function NewQuestionModal({ onClose, onSave }) {
    const [text, setText] = useState("");
    const [type, setType] = useState("yesno");
    const [isTextRequired, setIsTextRequired] = useState(false);

    const handleSubmit = () => {
        if (!text.trim()) return alert("Question text is required");

        const newQ = {
            questionText: text,
            questionType: type == "yesno" ? "radioBtn" : "rating",
            istextfieldrequired: isTextRequired,
            status: "published", // default
        };
        onSave(newQ);
    };

    return (
        <div className="modal-backdrop">
            <div className="modal flex-col">
                <h3>Post Question</h3>

                <div className="flex-col">
                    <div className="post-question-text">
                        <textarea
                            placeholder="Enter your question..."
                            value={text}
                            rows={4}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-sm">
                            Type:{" "}
                            <select value={type} onChange={(e) => setType(e.target.value)}>
                                <option value="yesno">Yes / No</option>
                                <option value="rating">Rating (1-5)</option>
                            </select>
                        </label>
                    </div>

                    <div className="my-1">
                        <label className="textFieldRequired" htmlFor="textFieldRequired">
                            Text Field Required
                        </label>
                        <input
                            type="checkbox"
                            name="textFieldRequired"
                            checked={isTextRequired}
                            onChange={(e) => setIsTextRequired(e.target.checked)}
                        />
                    </div>

                    <div className="modal-actions">
                        <button className="btn-red" onClick={onClose}>Cancel</button>
                        <button className="btn-success" onClick={handleSubmit}>Create</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
