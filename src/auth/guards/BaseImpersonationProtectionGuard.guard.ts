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

  abstract fieldsToCheck: string[];

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

  protected extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

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
