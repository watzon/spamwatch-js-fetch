// tslint:disable: max-classes-per-file

export class SpamWatchError extends Error {
  public message: string;
  public response: Response;

  constructor(response: Response, message: string) {
    super(message);
    this.message = message;
    this.response = response;
  }
}

export class UnauthorizedError extends SpamWatchError {}

export class NotFoundError extends SpamWatchError {
  constructor(response: Response) {
    super(response, "Resource not found");
  }
}

interface BadRequest {
  reason: string;
}

export class BadRequestError extends SpamWatchError {
  constructor(response: Response, json: BadRequest) {
    super(response, json.reason);
  }
}

export class ForbiddenError extends SpamWatchError {
  public token: string;

  constructor(response: Response, token: string) {
    super(response, "Token is not authorized for this operation.");
    this.token = token;
  }
}

interface TooManyRequests {
  until?: number;
}

export class TooManyRequestsError extends SpamWatchError {
  public waitUntil: Date;
  public method: string;

  constructor(response: Response, json: TooManyRequests) {
    const method = new URL(response.url).pathname.slice(1);
    const until = new Date((json.until || 0) * 1000);

    super(response, `Too Many Requests for method '${method}'`);
    this.waitUntil = until;
    this.method = method;
  }
}

export class ServerError extends SpamWatchError {}
