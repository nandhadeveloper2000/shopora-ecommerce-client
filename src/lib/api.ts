import type { User } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";
const ACCESS_TOKEN_KEY = "shopora.accessToken";
const REFRESH_TOKEN_KEY = "shopora.refreshToken";
const USER_KEY = "shopora.user";
const AUTH_CHANGE_EVENT = "shopora-auth-change";
let cachedUserString: string | null | undefined;
let cachedUserValue: User | null = null;

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

type AuthSession = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

function isFormDataBody(body: unknown): body is FormData {
  return typeof FormData !== "undefined" && body instanceof FormData;
}

function getStoredAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

function setCachedUserSnapshot(rawUser: string | null, user: User | null) {
  cachedUserString = rawUser;
  cachedUserValue = user;
}

export function getStoredUser() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawUser = window.localStorage.getItem(USER_KEY);

  if (rawUser === cachedUserString) {
    return cachedUserValue;
  }

  if (!rawUser) {
    setCachedUserSnapshot(null, null);
    return null;
  }

  try {
    const parsedUser = JSON.parse(rawUser) as User;
    setCachedUserSnapshot(rawUser, parsedUser);
    return parsedUser;
  } catch {
    setCachedUserSnapshot(rawUser, null);
    return null;
  }
}

function notifyAuthChange() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function isSessionErrorMessage(message: string) {
  const normalizedMessage = message.toLowerCase();

  return (
    normalizedMessage.includes("invalid or expired token") ||
    normalizedMessage.includes("expired token") ||
    normalizedMessage.includes("invalid token") ||
    normalizedMessage.includes("unauthorized")
  );
}

export function subscribeToAuthChange(listener: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleChange = () => listener();

  window.addEventListener(AUTH_CHANGE_EVENT, handleChange);
  window.addEventListener("storage", handleChange);

  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, handleChange);
    window.removeEventListener("storage", handleChange);
  };
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;
  const accessToken = getStoredAccessToken();
  const isFormData = isFormDataBody(body);

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    credentials: "include",
    headers: {
      ...(body !== undefined && !isFormData ? { "Content-Type": "application/json" } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(headers as Record<string, string>),
    },
    body:
      body === undefined
        ? undefined
        : isFormData
          ? body
          : JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message ?? "Request failed");
  }

  return data;
}

export const authStorage = {
  get accessToken() {
    if (typeof window === "undefined") {
      return null;
    }

    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  get refreshToken() {
    if (typeof window === "undefined") {
      return null;
    }

    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  get user(): User | null {
    return getStoredUser();
  },
  save(session: AuthSession) {
    if (typeof window === "undefined") {
      return;
    }

    const serializedUser = JSON.stringify(session.user);
    window.localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
    window.localStorage.setItem(USER_KEY, serializedUser);
    setCachedUserSnapshot(serializedUser, session.user);
    notifyAuthChange();
  },
  clear() {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
    setCachedUserSnapshot(null, null);
    notifyAuthChange();
  },
};

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { method: "GET", ...options }),
  post: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, { method: "POST", body, ...options }),
  put: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, { method: "PUT", body, ...options }),
  patch: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, { method: "PATCH", body, ...options }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { method: "DELETE", ...options }),
};
