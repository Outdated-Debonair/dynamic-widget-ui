import "../Styles/QuestionList.css";

export default function QuestionItem({ question, onClick, onEdit, onUnpublish }) {
    const status = question?.status?.toUpperCase();
    return (
        <div className="question-item" onClick={onClick}>
            {/* <div className="left">
                <span className="responses-count">{question.responses || 0}</span>
            </div> */}
            <div className="justify-between">
                <div className="middle flex-col">
                    <div className="">
                        <h4>{question.questiontext}</h4>
                    </div>
                    <div className="flex-row-btn">
                        <button onClick={(e) => { e.stopPropagation(); onEdit(); }}>Edit</button>
                        {question.status === "published" ?
                            <button onClick={(e) => { e.stopPropagation(); onUnpublish(question.questionid, true); }}>Unpublish</button> :
                            <button onClick={(e) => { e.stopPropagation(); onUnpublish(question.questionid, false); }}>Publish</button>
                        }

                    </div>
                </div>
                <div className="right">
                    <p className={question.status == "published" ? "publish-btn" : "unpublish-btn"}> {status}</p>
                </div>
            </div>
        </div>
    );
}
