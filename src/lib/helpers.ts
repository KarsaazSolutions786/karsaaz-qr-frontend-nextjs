/**
 * Shared Helpers
 * Ported from qr-code-frontend/src/core/helpers.js
 * Common utility functions used across the application.
 */

// ─── Type Checks ────────────────────────────────────────

/** Check if a value is empty (null, undefined, empty string, empty array, empty object) */
export function isEmpty(subject: unknown): boolean {
    if (subject === null || subject === undefined) return true;
    if (typeof subject === "string") return subject.trim().length === 0;
    if (Array.isArray(subject)) return subject.length === 0;
    if (typeof subject === "object") return Object.keys(subject).length === 0;
    return false;
}

export function isNotEmpty(v: unknown): boolean {
    return !isEmpty(v);
}

export function isFunction(param: unknown): param is Function {
    return typeof param === "function";
}

export function isPrimitive(val: unknown): boolean {
    return val !== Object(val);
}

export function isArray(value: unknown): value is unknown[] {
    return Array.isArray(value);
}

export function isNotArray(value: unknown): boolean {
    return !Array.isArray(value);
}

export function nullOrUndefined(value: unknown): value is null | undefined {
    return value === null || value === undefined;
}

export function isEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// ─── String Utilities ────────────────────────────────────

export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function ucfirst(str: string): string {
    return capitalize(str);
}

export function ucwords(str: string): string {
    return str
        .split(" ")
        .map((w) => capitalize(w))
        .join(" ");
}

export function kebabCase(str: string, forceLowerCase = true): string {
    let result = str
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/[\s_]+/g, "-");
    return forceLowerCase ? result.toLowerCase() : result;
}

export function slugify(str: string): string {
    return str
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export function studlyCase(str: string): string {
    return str.replace(/(^|[-_ ])(\w)/g, (_, _sep, char) => char.toUpperCase());
}

export function titleCase(str: string): string {
    return str
        .replace(/[-_]/g, " ")
        .split(" ")
        .map((w) => capitalize(w))
        .join(" ");
}

export function escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ─── Number Utilities ────────────────────────────────────

export function random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function range(from: number, to: number): number[] {
    const arr: number[] = [];
    for (let i = from; i <= to; i++) arr.push(i);
    return arr;
}

export function parseNumberValue(value: unknown, defaultValue = 0): number {
    const parsed = Number(value);
    return isNaN(parsed) ? defaultValue : parsed;
}

export function parseBooleanValue(value: unknown): boolean {
    if (value === true || value === "true" || value === "1" || value === 1)
        return true;
    return false;
}

export function numberFormat(
    num: number,
    decimals = 0,
    decSep = ".",
    thousandsSep = ","
): string {
    const fixed = num.toFixed(decimals);
    const [int, dec] = fixed.split(".");
    const formattedInt = int.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);
    return dec ? `${formattedInt}${decSep}${dec}` : formattedInt;
}

// ─── Object Utilities ────────────────────────────────────

/** Pick only specified keys from an object */
export function only<T extends Record<string, any>>(
    obj: T,
    keys: (keyof T)[]
): Partial<T> {
    const result: Partial<T> = {};
    keys.forEach((key) => {
        if (key in obj) result[key] = obj[key];
    });
    return result;
}

/** Deep-equal check */
export function equals(obj: unknown, another: unknown): boolean {
    return JSON.stringify(obj) === JSON.stringify(another);
}

/** Remove keys with empty/null/undefined values */
export function removeEmptyFields<T extends Record<string, any>>(
    obj: T
): Partial<T> {
    const result: Partial<T> = {};
    Object.entries(obj).forEach(([key, value]) => {
        if (!isEmpty(value)) (result as any)[key] = value;
    });
    return result;
}

/** Mix (merge) obj2 into obj1, mutating obj1 */
export function mix<T extends Record<string, any>>(obj1: T, obj2: Partial<T>): T {
    Object.assign(obj1, obj2);
    return obj1;
}

// ─── Color Utilities ─────────────────────────────────────

export function rgbToHex({ r, g, b }: { r: number; g: number; b: number }): string {
    const toHex = (n: number) => n.toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
}

// ─── Storage ─────────────────────────────────────────────

export function loadStoredJson<T = any>(key: string): T | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function storeJson(data: any, key: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(data));
}

// ─── Async & Timing ──────────────────────────────────────

export function debounce<T extends (...args: any[]) => void>(
    cb: T,
    ms = 300
): (...args: Parameters<T>) => void {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => cb(...args), ms);
    };
}

export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Array Utilities ─────────────────────────────────────

export function shuffle<T>(array: T[]): T[] {
    const a = [...array];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ─── Hash ────────────────────────────────────────────────

export function hash(str: string, seed = 0): number {
    let h1 = 0xdeadbeef ^ seed;
    let h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

export function generateUniqueID(length = 10): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// ─── URL & Query ─────────────────────────────────────────

export function queryParam(name: string): string | null {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get(name);
}

export function urlWithQueryString(
    url: string,
    queryString: Record<string, string | number | boolean>
): string {
    const params = new URLSearchParams();
    Object.entries(queryString).forEach(([k, v]) => params.append(k, String(v)));
    return `${url}?${params.toString()}`;
}

// ─── Mobile ──────────────────────────────────────────────

export function isMobile(): boolean {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
}

// ─── CSV Export ──────────────────────────────────────────

export function arrayToCsv(data: Record<string, any>[]): string {
    if (data.length === 0) return "";
    const headers = Object.keys(data[0]);
    const rows = data.map((row) =>
        headers.map((h) => JSON.stringify(row[h] ?? "")).join(",")
    );
    return [headers.join(","), ...rows].join("\n");
}

// ─── SVG Utilities ────────────────────────────────────────

/** Basic SVG sanitization to prevent XSS from script tags */
export function sanitizeSvg(svg: string): string {
    return svg
        .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
        .replace(/on\w+="[^"]*"/gim, "")
        .replace(/on\w+='[^']*'/gim, "");
}
