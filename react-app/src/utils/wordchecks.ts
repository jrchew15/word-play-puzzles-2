export async function checkWordsTable(word: string) {

    const res = await fetch(`/api/words/${word}`);

    return res.ok
}
