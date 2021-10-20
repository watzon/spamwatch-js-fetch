import { SpamWatchError } from '.';
import { BadRequestError, ForbiddenError, NotFoundError, ServerError, TooManyRequestsError, UnauthorizedError } from './Errors';
import { AddBan, Ban, Token, TokenPermission, Stats, Version } from './models';

export class Client {
  private host: string;
  private token: string;

  constructor(token: string, host = 'https://api.spamwat.ch') {
    this.host = host;
    this.token = token;
  }

  /**
   * Retrieves the current Spamwatch API version
   * @returns {Version} Version of the API
   */
  public async getVersion(): Promise<Version> {
    return this._makeRequest<Version>('version');
  }

  /**
   * Retrieves some basic statistics
   * @returns {Stats}
   */
  public async getStats(): Promise<Stats> {
    return this._makeRequest<Stats>('stats');
  }

  /**
   * Adds a new ban to Spamwatch
   * Requires ADMIN permission.
   * @param banInfo user ID and ban reason
   */
  public async addBan(banInfo: AddBan): Promise<void> {
    return this._makeRequest('banlist', 'POST', banInfo);
  }

  /**
   * Removes a ban for a user
   * Requires ADMIN permission.
   * @param userId user ID to unban
   */
  public async deleteBan(userId: number): Promise<void> {
    return this._makeRequest(`banlist/${userId}`, 'DELETE');
  }

  /**
   * Check for a ban
   * @param userId ID of the user
   * @returns {Ban|false} Ban object or false if not found
   */
  public async getBan(userId: number): Promise<Ban | false> {
    try {
      return await this._makeRequest<Ban>(`banlist/${userId}`);
    } catch (e) {
      if (e instanceof NotFoundError) {
        return false;
      }

      throw e;
    }
  }

  /**
   * Retrieve a list of all banned user IDs
   * @returns {number[]} Array of Telegram user IDs
   */
  public async getBanIds(): Promise<number[]> {
    return this._makeRequest<number[]>('banlist/all');
  }

  /**
   * Retrieve a list of all banned user records.
   * Requires ROOT permission.
   * @returns {Ban[]} Array of Ban
   */
  public async getBans(): Promise<Ban[]> {
    return this._makeRequest<Ban[]>('banlist');
  }

  /**
   * Get all tokens.
   * Requires ROOT permission.
   * @returns {Token[]} Array of Token
   */
  public async getTokens() {
    return this._makeRequest<Token[]>('tokens');
  }

  /**
   * Create a token for a user.
   * @param {Number} userid id of the user to create the token for.
   * @param {TokenPermission} permission what permission to apply to the token.
   * @returns {Token} the created Token.
   */
  public async createToken(userid: number, permission: TokenPermission) {
    return this._makeRequestWithFallback<Token>('tokens', 'POST', {
      id: userid,
      permission,
    });
  }

  /**
   * Fetch a Token by id.
   * @param {Number} tokenid the id of the Token to fetch.
   * @returns {Token} a Token.
   */
  public async getToken(tokenid: number) {
    return this._makeRequestWithFallback<Token>(`tokens/${tokenid}`);
  }

  /**
   * Get a list of user Tokens.
   * @param {Number} userid the id of the user who's Tokens you want to fetch.
   * @returns {Token | null} a Token, or null if the user doesn't have a token.
   */
  public async getTokenUser(userid: number) {
    return this._makeRequestWithFallback<Token>(`tokens/userid/${userid}`)
  }

  /**
   * Delete a Token by id.
   * @param {Number} tokenid the id of the Token to delete.
   */
   public async deleteToken(tokenid: number) {
    this._makeRequest<null>(`tokens/${tokenid}`, 'DELETE');
  }

  private async _makeRequestWithFallback<T>(path: string, method = 'GET', kwargs = {}, fallback = null) {
    try {
      return this._makeRequest<T>(path, method, kwargs);
    } catch (e) {
      if (e instanceof SpamWatchError) {
        return fallback
      } else {
        throw e
      }
    }
  }

  private async _makeRequest<T>(path: string, method = 'GET', kwargs = {}): Promise<T> {
    const response = await fetch(
      `${this.host}/${path}`,
      {
        method,
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
        ...kwargs,
      },
    );

    const json = (await response.clone().json()) || {};

    switch (response.status) {
      default:
        return json as T;

      case 400:
        throw new BadRequestError(response, json);

      case 401:
        throw new UnauthorizedError(response, 'Invalid token');

      case 403:
        throw new ForbiddenError(response, this.token);

      case 404:
        throw new NotFoundError(response);

      case 429:
        throw new TooManyRequestsError(response, json);

      case 500:
        throw new ServerError(response, 'api.spamwat.ch Internal Server Error');
    }
  }
}