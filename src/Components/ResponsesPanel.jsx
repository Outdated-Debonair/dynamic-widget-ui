import { useEffect, useState } from "react";

export default function ResponsesPanel({ question }) {
    const [responses, setResponses] = useState([]);

    useEffect(() => {
        const fetchResponses = async () => {
            try {
                const res = await fetch(
                    `http://localhost:4000/api/getResponses/${question.questionid}`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                    }
                );
                const data = await res.json();
                setResponses(data.data || []);
            } catch (err) {
                console.error("Error fetching responses:", err);
            }
        };
        fetchResponses();
    }, [question]);

    if (!responses.length) return <p>No responses yet.</p>;

    // ✅ YES/NO
    if (question.questiontype === "yesno" || question.questiontype === "radioBtn") {
        const yes = responses.filter((r) => r.radiobtn === true).length;
        const no = responses.filter((r) => r.radiobtn === false).length;
        return (
            <div>
                <h3>{question.questiontext}</h3>
                <p>Yes: {((yes / responses.length) * 100).toFixed(1)}%</p>
                <p>No: {((no / responses.length) * 100).toFixed(1)}%</p>
                <p>Total responses: {responses.length}</p>
            </div>
        );
    }

    if (question.questiontype === "rating") {
        const counts = [1, 2, 3, 4, 5].map(
            (r) => responses.filter((res) => res.ratingscale === r).length
        );
        return (
            <div>
                <h3>{question.questiontext}</h3>
                {counts.map((c, i) => (
                    <p key={i}>
                        {i + 1}: {c} response{c !== 1 ? "s" : ""}
                    </p>
                ))}
                <p>Total responses: {responses.length}</p>
            </div>
        );
    }

    if (question.questiontype === "text" || question.istextfieldrequired) {
        const textResponses = responses.filter((r) => r.textfield && r.textfield.trim() !== "");
        return (
            <div>
                <h3>{question.questiontext}</h3>
                {textResponses.length ? (
                    <ul>
                        {textResponses.map((r) => (
                            <li key={r.responseid}>{r.textfield}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No text feedback provided.</p>
                )}
            </div>
        );
    }
    return null;
}
