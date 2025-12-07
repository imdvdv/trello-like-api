import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context) as Promise<boolean>;
  }

  handleRequest(err: any, user: any, info: any) {

    if (err || !user) {

      if (info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Токен истек');
      }

      if (info?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Невалидный токен');
      }
      
      if (info?.name === 'NotBeforeError') {
        throw new UnauthorizedException('Токен еще не активен');
      }

      throw err || new UnauthorizedException('Требуется аутентификация');
    }
    return user;
  }
}
