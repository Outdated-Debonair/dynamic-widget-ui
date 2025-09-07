export async function getQuestions() {
    const url = `http://localhost:4000/api/getQuestions`;
    const res = await fetch(url, {
        method: "GET",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        }
    });
    const data = await res.json();
    return data;
}