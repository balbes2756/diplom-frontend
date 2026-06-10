const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const getToken = () => localStorage.getItem("auth_token");

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const token = getToken();

    // ❌ НЕ ставим Content-Type автоматически — браузер сам определит
    const headers: HeadersInit = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    // Если это НЕ FormData и заголовок не передан явно — добавляем JSON
    if (
        !(options.body instanceof FormData) &&
        !options.headers?.["Content-Type"]
    ) {
        headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${API_URL}${url}`, { ...options, headers });

    // 1️⃣ Обработка ошибок от сервера (4xx, 5xx)
    if (!res.ok) {
        const text = await res.text();
        let errorMessage = `Ошибка сервера: ${res.status}`;
        try {
            const data = JSON.parse(text);
            errorMessage = data.detail || data.message || errorMessage;
        } catch {
            /* если ответ не JSON, оставляем стандартное сообщение */
        }
        throw new Error(errorMessage);
    }

    // 2️⃣ Если ответ пустой (например, DELETE возвращает 204 No Content)
    const text = await res.text();
    if (!text) return undefined as T;

    // 3️⃣ Парсим JSON
    try {
        return JSON.parse(text) as T;
    } catch {
        throw new Error("Сервер вернул некорректный JSON");
    }
}

export const api = {
    // ✅ Обычный POST для JSON
    post: <T>(url: string, body: any) =>
        request<T>(url, { method: "POST", body: JSON.stringify(body) }),

    get: <T>(url: string) => request<T>(url, { method: "GET" }),
    delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),
    patch: <T>(url: string, body: any) =>
        request<T>(url, { method: "PATCH", body: JSON.stringify(body) }),

    // 🆕 Новый метод для загрузки файлов (FormData)
    upload: <T>(url: string, formData: FormData) =>
        request<T>(url, {
            method: "POST",
            body: formData,
            // Content-Type НЕ указываем — браузер сам поставит с boundary
        }),
};
