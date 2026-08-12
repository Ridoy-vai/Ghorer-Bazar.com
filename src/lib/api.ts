/**
 * src/lib/api.ts
 * Shared fetch helper for talking to the Express/Prisma backend.
 *
 * Setup:
 *  1. Create a `.env.local` file in your Next.js project root with:
 *       NEXT_PUBLIC_API_URL=http://localhost:5000
 *  2. Restart `npm run dev` after adding/changing env vars.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface ApiResponseShape<T> {
  success: boolean;
  message: string;
  data: T;
}

export class ApiRequestError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// Unwraps `data` only — use for endpoints that just return { success, message, data }.
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const json = await requestRaw<T>(path, options);
  return json.data;
}

// Returns the full JSON body — use for endpoints that also send extra top-level
// fields like `meta` (pagination) or `filters` (facets), e.g. the products list.
async function requestRaw<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponseShape<T> & Record<string, any>> {
  const token = typeof window !== "undefined" ? window.localStorage.getItem("accessToken") : null;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const json: ApiResponseShape<T> & Record<string, any> = await res.json();

  if (!res.ok || !json.success) {
    throw new ApiRequestError(json.message || "Request failed", res.status);
  }

  return json;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

// ---------------- Users ----------------
// Matches your users.ts router mounted at app.use("/users", userRouter):
// model User {
//   id       String   @id @default(uuid())
//   name     String
//   email    String   @unique
//   password String
//   role     Userrole @default(user)
//   avatar   String?
// }

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  role: string;
}

export interface LoginResult {
  user: AuthUser;
  token: string;
}

export const userApi = {
  register: (payload: { name: string; email: string; password: string; avatar?: string }) =>
    api.post<AuthUser>("/users/register", payload),
  login: (payload: { email: string; password: string }) => api.post<LoginResult>("/users/login", payload),
};

// Stores the session on the client so `request()` above can attach the token automatically.
export const session = {
  save: (token: string, user: AuthUser) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("authUser", JSON.stringify(user));
  },
  getUser: (): AuthUser | null => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("authUser");
    return raw ? JSON.parse(raw) : null;
  },
  clear: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authUser");
  },
};

// ---------------- Products ----------------
// Matches this Prisma model + your product.routes.ts mounted at app.use("/products", productRoutes):
// model Product {
//   id          String   @id @default(uuid())
//   name        String
//   category    String?
//   description String?
//   price       Float
//   unit        String   @default("piece")
//   stock       Int      @default(0)
//   imageUrl    String?
//   createdAt   DateTime @default(now())
//   updatedAt   DateTime @updatedAt
// }

export interface Product {
  id: string;
  name: string;
  category?: string | null;
  description?: string | null;
  price: number;
  unit?: string | null;
  stock: number;
  imageUrl?: string | null;
  // Only present when GET /products?sort=topSelling is used.
  soldCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductPayload {
  name: string;
  category?: string;
  description?: string;
  price: number;
  unit?: string;
  stock: number;
  imageUrl?: string;
}

export interface ProductListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductListFilters {
  priceRange: { min: number; max: number };
  categories: { category: string | null; count: number }[];
}

export interface ProductListResponse {
  success: boolean;
  message: string;
  data: Product[];
  meta: ProductListMeta;
  filters: ProductListFilters;
}

// Query params supported by GET /products (all optional):
//   category, unit, search, minPrice, maxPrice, inStock,
//   sort (newest | oldest | priceLowHigh | priceHighLow | topSelling | nameAZ | nameZA),
//   page, limit
export type ProductQueryParams = Partial<{
  category: string;
  unit: string;
  search: string;
  minPrice: string;
  maxPrice: string;
  inStock: string;
  sort: string;
  page: string;
  limit: string;
}>;

export const productApi = {
  create: (payload: CreateProductPayload) => api.post<Product>("/products", payload),
  getAll: (params?: ProductQueryParams) => {
    const query = params
      ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
      : "";
    return requestRaw<Product[]>(`/products${query}`, { method: "GET" }) as Promise<ProductListResponse>;
  },
  getById: (id: string) => api.get<Product>(`/products/${id}`),
  update: (id: string, payload: Partial<CreateProductPayload>) =>
    api.patch<Product>(`/products/${id}`, payload),
  delete: (id: string) => api.delete<Product>(`/products/${id}`),
};