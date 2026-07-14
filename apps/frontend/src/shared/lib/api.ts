import { authStorage } from "../auth/authStorage";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("La URL base de la API (VITE_API_URL) no está configurada.");
}

export interface ApiError extends Error {
  statusCode?: number;
  body?: unknown;
}

interface FetchOptions extends RequestInit {
  timeout?: number;
}

type UnknownRecord = Record<string, unknown>;

const isRecord = (v: unknown): v is UnknownRecord =>
  typeof v === "object" && v !== null;

const getMessageFromBody = (body: unknown): string | undefined => {
  if (!isRecord(body)) return undefined;
  const msg = body["message"];
  return typeof msg === "string" ? msg : undefined;
};

export const apiFetch = async <T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> => {
  const { timeout = 10000, ...fetchOptions } = options;

  const controller = new AbortController();
  const signal = controller.signal;

  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const token = authStorage.getToken();

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...fetchOptions,
      signal,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(fetchOptions.headers || {}),
      },
    });

    if (response.status === 401) {
      authStorage.clearSession();
      window.dispatchEvent(new Event("auth:logout"));
    }

    clearTimeout(timeoutId);

    if (response.status === 204) {
      if (!response.ok) {
        const apiError: ApiError = new Error(
          `Error en la petición: ${response.status} ${response.statusText}`,
        ) as ApiError;
        apiError.statusCode = response.status;
        throw apiError;
      }
      return undefined as T;
    }

    const contentType =
      response.headers.get("content-type")?.toLowerCase() ?? "";
    const isJson = contentType.includes("application/json");

    let body: unknown = null;

    if (isJson) {
      body = await response.json().catch(() => null);
    } else {
      body = await response.text().catch(() => null);
    }
    if (!response.ok) {
      const messageFromJson = getMessageFromBody(body);

      const message =
        messageFromJson ??
        (typeof body === "string" && body.trim()
          ? body
          : `Error en la petición: ${response.status} ${response.statusText}`);

      const apiError: ApiError = new Error(message) as ApiError;
      apiError.statusCode = response.status;
      apiError.body = body;

      throw apiError;
    }
    return body as T;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === "AbortError") {
      const timeoutError: ApiError = new Error(
        "La solicitud tardó demasiado",
      ) as ApiError;
      timeoutError.statusCode = 408;
      throw timeoutError;
    }

    throw err;
  }
};

export const apiFetchBlob = async (
  endpoint: string,
  options: FetchOptions = {},
): Promise<Blob> => {
  const { timeout = 10000, ...fetchOptions } = options;

  const controller = new AbortController();
  const signal = controller.signal;

  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const token = authStorage.getToken();

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...fetchOptions,
      signal,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(fetchOptions.headers || {}),
      },
    });

    if (response.status === 401) {
      authStorage.clearSession();
      window.dispatchEvent(new Event("auth:logout"));
    }

    clearTimeout(timeoutId);

    if (!response.ok) {
      const contentType =
        response.headers.get("content-type")?.toLowerCase() ?? "";
      const isJson = contentType.includes("application/json");

      let body: unknown = null;
      if (isJson) {
        body = await response.json().catch(() => null);
      } else {
        body = await response.text().catch(() => null);
      }

      const messageFromJson = getMessageFromBody(body);
      const message =
        messageFromJson ??
        (typeof body === "string" && body.trim()
          ? body
          : `Error en la petición: ${response.status} ${response.statusText}`);

      const apiError: ApiError = new Error(message) as ApiError;
      apiError.statusCode = response.status;
      apiError.body = body;
      throw apiError;
    }

    return await response.blob();
  } catch (err) {
    clearTimeout(timeoutId);

    if (err instanceof Error && err.name === "AbortError") {
      const timeoutError: ApiError = new Error(
        "La solicitud tardó demasiado",
      ) as ApiError;
      timeoutError.statusCode = 408;
      throw timeoutError;
    }

    throw err;
  }
};
