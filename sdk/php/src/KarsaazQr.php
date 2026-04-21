<?php

declare(strict_types=1);

namespace KarsaazQr;

class ApiError extends \RuntimeException
{
    public function __construct(
        public readonly int $statusCode,
        public readonly mixed $body,
        string $message
    ) {
        parent::__construct($message);
    }
}

class KarsaazQr
{
    private const DEFAULT_BASE_URL = 'https://api.karsaazqr.com';

    private string $apiKey;
    private string $baseUrl;

    public function __construct(string $apiKey, string $baseUrl = self::DEFAULT_BASE_URL)
    {
        if ($apiKey === '') {
            throw new \InvalidArgumentException('apiKey is required');
        }
        $this->apiKey  = $apiKey;
        $this->baseUrl = rtrim($baseUrl, '/');
    }

    // ── QR Codes ────────────────────────────────────────────────────────────

    public function listQrcodes(int $page = 1, int $limit = 20, ?string $keyword = null): array
    {
        $params = ['page' => $page, 'page_size' => $limit];
        if ($keyword !== null) {
            $params['keyword'] = $keyword;
        }
        return $this->request('GET', '/qrcodes', queryParams: $params);
    }

    public function createQrcode(string $type, string $content, ?string $name = null, ?array $design = null): array
    {
        $body = ['type' => $type, 'content' => $content];
        if ($name !== null)   $body['name']   = $name;
        if ($design !== null) $body['design'] = $design;
        return $this->request('POST', '/qrcodes', body: $body)['data'];
    }

    public function getQrcode(string $id): array
    {
        return $this->request('GET', "/qrcodes/{$id}")['data'];
    }

    public function updateQrcode(string $id, array $fields): array
    {
        return $this->request('PATCH', "/qrcodes/{$id}", body: $fields)['data'];
    }

    public function deleteQrcode(string $id): void
    {
        $this->request('DELETE', "/qrcodes/{$id}");
    }

    // ── Credits ─────────────────────────────────────────────────────────────

    public function creditsBalance(): array
    {
        return $this->request('GET', '/credits')['data'];
    }

    // ── HTTP ────────────────────────────────────────────────────────────────

    private function request(
        string $method,
        string $path,
        array $body = [],
        array $queryParams = []
    ): array {
        $url = $this->baseUrl . '/api/v1/org' . $path;
        if ($queryParams !== []) {
            $url .= '?' . http_build_query($queryParams);
        }

        $ch = curl_init($url);
        $headers = [
            'Authorization: Bearer ' . $this->apiKey,
            'Content-Type: application/json',
            'Accept: application/json',
        ];

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);

        if ($body !== [] && in_array($method, ['POST', 'PUT', 'PATCH'], true)) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
        }

        $raw    = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error  = curl_error($ch);
        curl_close($ch);

        if ($error !== '') {
            throw new \RuntimeException("cURL error: {$error}");
        }

        $json = json_decode($raw, true) ?? [];

        if ($status >= 400) {
            $message = $json['error'] ?? $json['message'] ?? "HTTP {$status}";
            throw new ApiError($status, $json, $message);
        }

        return $json;
    }
}
