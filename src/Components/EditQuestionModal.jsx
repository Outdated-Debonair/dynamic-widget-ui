import React, { useState } from "react";

export default function EditQuestionModal({ question, onClose, onSave }) {
    const [newText, setNewText] = useState(question.questiontext);

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h3>Edit Question!</h3>
                <textarea
                    value={newText}
                    rows={4}
                    onChange={(e) => setNewText(e.target.value)}
                />
                <div className="modal-actions">
                    <button className="btn-red" onClick={onClose}>Cancel</button>
                    <button className="btn-success" onClick={() => onSave(question.questionid, newText)}>Save</button>
                </div>
            </div>
        </div>
    );
}
