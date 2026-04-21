"""KarsaazQR Python SDK — Org API client."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Optional
import json
import urllib.request
import urllib.error

DEFAULT_BASE_URL = "https://api.karsaazqr.com"


class ApiError(Exception):
    def __init__(self, status: int, body: Any, message: str) -> None:
        super().__init__(message)
        self.status = status
        self.body = body


@dataclass
class QRCode:
    id: str
    type: str
    content: str
    scan_count: int
    is_active: bool
    created_at: str
    updated_at: str
    name: Optional[str] = None
    design: dict = field(default_factory=dict)


@dataclass
class CreditsBalance:
    balance: float
    lifetime_purchased: float
    lifetime_spent: float


@dataclass
class PaginatedResponse:
    data: list[dict]
    meta: dict


class _QRCodes:
    def __init__(self, client: "KarsaazQr") -> None:
        self._c = client

    def list(
        self,
        page: int = 1,
        limit: int = 20,
        keyword: Optional[str] = None,
    ) -> PaginatedResponse:
        params: dict[str, Any] = {"page": page, "page_size": limit}
        if keyword:
            params["keyword"] = keyword
        raw = self._c._request("GET", "/qrcodes", params=params)
        return PaginatedResponse(data=raw.get("data", []), meta=raw.get("meta", {}))

    def create(
        self,
        type: str,
        content: str,
        name: Optional[str] = None,
        design: Optional[dict] = None,
    ) -> QRCode:
        body: dict[str, Any] = {"type": type, "content": content}
        if name is not None:
            body["name"] = name
        if design is not None:
            body["design"] = design
        d = self._c._request("POST", "/qrcodes", body=body)
        return QRCode(**{k: d[k] for k in QRCode.__dataclass_fields__ if k in d})

    def get(self, id: str) -> QRCode:
        d = self._c._request("GET", f"/qrcodes/{id}")
        return QRCode(**{k: d[k] for k in QRCode.__dataclass_fields__ if k in d})

    def update(self, id: str, **kwargs: Any) -> QRCode:
        d = self._c._request("PATCH", f"/qrcodes/{id}", body=kwargs)
        return QRCode(**{k: d[k] for k in QRCode.__dataclass_fields__ if k in d})

    def delete(self, id: str) -> None:
        self._c._request("DELETE", f"/qrcodes/{id}")


class _Credits:
    def __init__(self, client: "KarsaazQr") -> None:
        self._c = client

    def balance(self) -> CreditsBalance:
        d = self._c._request("GET", "/credits")
        return CreditsBalance(
            balance=float(d.get("balance", 0)),
            lifetime_purchased=float(d.get("lifetime_purchased", 0)),
            lifetime_spent=float(d.get("lifetime_spent", 0)),
        )


class KarsaazQr:
    """Org API client for KarsaazQR.

    Usage::

        client = KarsaazQr("kq_your_api_key")
        balance = client.credits.balance()
        qr = client.qrcodes.create(type="url", content="https://example.com", name="My QR")
    """

    def __init__(self, api_key: str, base_url: str = DEFAULT_BASE_URL) -> None:
        if not api_key:
            raise ValueError("api_key is required")
        self._api_key = api_key
        self._base_url = base_url.rstrip("/")
        self.qrcodes = _QRCodes(self)
        self.credits = _Credits(self)

    def _request(
        self,
        method: str,
        path: str,
        body: Optional[dict] = None,
        params: Optional[dict] = None,
    ) -> Any:
        url = f"{self._base_url}/api/v1/org{path}"
        if params:
            qs = "&".join(f"{k}={v}" for k, v in params.items() if v is not None)
            url = f"{url}?{qs}"

        data = json.dumps(body).encode() if body is not None else None
        req = urllib.request.Request(
            url,
            data=data,
            method=method,
            headers={
                "Authorization": f"Bearer {self._api_key}",
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        )

        try:
            with urllib.request.urlopen(req) as resp:
                raw = json.loads(resp.read())
                return raw.get("data", raw)
        except urllib.error.HTTPError as exc:
            try:
                body_json = json.loads(exc.read())
            except Exception:
                body_json = {}
            raise ApiError(
                exc.code,
                body_json,
                body_json.get("error") or body_json.get("message") or f"HTTP {exc.code}",
            ) from exc


__all__ = ["KarsaazQr", "ApiError", "QRCode", "CreditsBalance", "PaginatedResponse"]
