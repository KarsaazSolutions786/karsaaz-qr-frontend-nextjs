export class ApiError extends Error {
  public response: Response;
  public request: Request;

  constructor(details: { response: Response; request: Request }) {
    super(`API Error: ${details.response.status} ${details.response.statusText}`);
    this.name = 'ApiError';
    this.response = details.response;
    this.request = details.request;
  }

  async json() {
    try {
      return await this.response.clone().json();
    } catch {
      return null;
    }
  }
}

export class ValidationError extends Error {
  public response: Response;
  public request: Request;
  public jsonResponse: Record<string, unknown>;

  constructor(details: { response: Response; request: Request; jsonResponse: Record<string, unknown> }) {
    super('Validation Error');
    this.name = 'ValidationError';
    this.response = details.response;
    this.request = details.request;
    this.jsonResponse = details.jsonResponse;
  }

  errors() {
    return { ...this.jsonResponse.validationErrors };
  }
}
