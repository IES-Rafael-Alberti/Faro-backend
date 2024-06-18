import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export abstract class BaseImpersonationProtectionGuard implements CanActivate {
  constructor(protected jwtService: JwtService) {}

  /**
   * An array of fields to check in the request. These fields are used to determine if a user is trying to access another user's data.
   */
  abstract fieldsToCheck: string[];

  /**
   * Determines whether the current user can activate the route or not.
   * @param {ExecutionContext} context - The execution context.
   * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the user can activate the route or not.
   * @throws {UnauthorizedException} - Throws an exception if the user is not authorized.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const userSesion = await this.jwtService.verifyAsync(token, {
        secret: `${process.env.JWT_KEY}`,
      });
      let validRequest;
      const httpVerb = request.method;
      if (httpVerb === 'GET' || httpVerb === 'DELETE') {
        validRequest = this.checkParametersFromURL(
          this.fieldsToCheck,
          request,
          userSesion,
        );
      } else if (
        httpVerb === 'POST' ||
        httpVerb === 'PUT' ||
        httpVerb === 'PATCH'
      ) {
        validRequest = this.checkParametersFromBody(
          this.fieldsToCheck,
          request,
          userSesion,
        );
      }

      if (!validRequest) {
        throw new UnauthorizedException("You can't access other user's data");
      }
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
    return true;
  }

  /**
   * Extracts the token from the request header.
   * @param {Request} request - The request object.
   * @returns {string | undefined} - The extracted token or undefined if the token is not found.
   */
  protected extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  /**
   * Checks the parameters from the URL against the user's session.
   * @param {string[]} fieldsToCheck - The fields to check.
   * @param {Request} request - The request object.
   * @param {any} userSesion - The user's session.
   * @returns {boolean} - Returns true if the parameters match the user's session, false otherwise.
   */
  protected checkParametersFromURL(
    fieldsToCheck: string[],
    request: Request,
    userSesion: any,
  ) {
    let valid = true;
    fieldsToCheck.forEach((field_name) => {
      const param_value = request.params[field_name];
      if (!param_value) {
        return;
      }
      if (param_value !== userSesion['id']) {
        valid = false;
      }
    });
    return valid;
  }

  /**
   * Checks the parameters from the body against the user's session.
   * @param {string[]} fieldsToCheck - The fields to check.
   * @param {Request} request - The request object.
   * @param {any} userSesion - The user's session.
   * @returns {boolean} - Returns true if the parameters match the user's session, false otherwise.
   */
  protected checkParametersFromBody(
    fieldsToCheck: string[],
    request: Request,
    userSesion: any,
  ) {
    let valid = true;
    fieldsToCheck.forEach((field_name) => {
      const body_value = request.body[field_name];
      if (!body_value) {
        return;
      }
      if (body_value !== userSesion['id']) {
        valid = false;
      }
    });
    return valid;
  }
}
