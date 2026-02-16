/**
 * Download Utilities
 * File download helpers for the browser.
 * Ported from qr-code-frontend/src/core/helpers.js (downloadBlob, openLinkInNewTab)
 */

/** Download arbitrary content as a file */
export function downloadBlob(
    content: string | Blob,
    filename: string,
    contentType = "application/octet-stream"
): void {
    const blob =
        content instanceof Blob ? content : new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

/** Download CSV from object array */
export function downloadCsv(
    data: Record<string, any>[],
    filename = "export.csv"
): void {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]);
    const rows = data.map((row) =>
        headers.map((h) => JSON.stringify(row[h] ?? "")).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    downloadBlob(csv, filename, "text/csv");
}

/** Download a remote file by URL (fetches and triggers download) */
export async function downloadUrl(
    url: string,
    filename?: string
): Promise<void> {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const resolvedFilename =
            filename || url.split("/").pop() || "download";
        downloadBlob(blob, resolvedFilename);
    } catch {
        // Fallback: open in new tab for same-origin issues
        openInNewTab(url);
    }
}

/** Open a link in a new tab */
export function openInNewTab(url: string): void {
    const win = window.open(url, "_blank");
    if (win) win.focus();
}
