import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  /**
   * Checks if the request is authorized by validating the JWT token.
   *
   * @public
   * @async
   * @function
   * @name canActivate
   * @param {ExecutionContext} context - The execution context.
   * @returns {Promise<boolean>} - Returns true if the request is authorized, otherwise throws an UnauthorizedException.
   * @throws {UnauthorizedException} - If the JWT token is invalid or not provided.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: `${process.env.JWT_KEY}`,
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  /**
   * Extracts the JWT token from the request header.
   *
   * @private
   * @function
   * @name extractTokenFromHeader
   * @param {Request} request - The request object.
   * @returns {string | undefined} - Returns the JWT token if it exists and is of type 'Bearer', otherwise returns undefined.
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
