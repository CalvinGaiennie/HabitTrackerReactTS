const BASE_URL = "http://localhost:8000";

export async function createLinkToken() {
    const res = await fetch(`${BASE_URL}/create_link_token`);
    return res.json();
}

export async function exchangePublicToken(public_token: string) {
    const res = await fetch(`${BASE_URL}/exchange_token`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ public_token}),
    });
    return res.json();
}

export async function getTransactions() {
    const res = await fetch(`${BASE_URL}/transactions`);
    return res.json();
}