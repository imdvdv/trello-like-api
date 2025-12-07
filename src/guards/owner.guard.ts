import { 
    Injectable, 
    CanActivate, 
    ExecutionContext, 
    ForbiddenException,
  } from '@nestjs/common';
  import { Reflector, ModuleRef } from '@nestjs/core';
  import { OWNER_KEY, OwnerConfig } from '../decorators/owner.decorator';
  import { CardsService } from '../cards/cards.service';
  import { ColumnsService } from '../columns/columns.service';
  import { CommentsService } from '../comments/comments.service';
  
  @Injectable()
  export class OwnerGuard implements CanActivate {
    constructor(
      private reflector: Reflector,
      private moduleRef: ModuleRef,
    ) {}
  
    private getService(paramName: string): CardsService | ColumnsService | CommentsService | null {
      switch (paramName) {
        case 'cardId':
            return this.moduleRef.get(CardsService, { strict: false });
        case 'columnId':
            return this.moduleRef.get(ColumnsService, { strict: false });
        case 'commentId':
            return this.moduleRef.get(CommentsService, { strict: false });
        default:
          return null; 
      }
    }
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const config = this.reflector.get<OwnerConfig>(
        OWNER_KEY,
        context.getHandler(),
      );
      const request = context.switchToHttp().getRequest();
      const user = request.user;

      if (!config) {
        throw new Error('При использовании OwnerGuard необходимо настроить Owner decorator');
      }

      if (config.paramName === 'userId') {
        const userId = parseInt(request.params['userId']);

        if (userId !== user.id) {
            throw new ForbiddenException('Доступ запрещен');
        }

        return true;
      }

      const entityId = parseInt(request.params[config.paramName]);
      const service = this.getService(config.paramName);
      const serviceMethod = config.serviceMethod ?? 'findById';
      const entityName = config.entityName ?? 'Сущность';
      
      if (!service) {
        throw new Error(`Сервис для параметра ${config.paramName} не найден`);
      }
  
      if (typeof (service as any)[serviceMethod] !== 'function') {
        throw new Error(`Метод ${serviceMethod} не найден в сервисе для параметра ${config.paramName}`);
      }
  
      const entity = await (service as any)[serviceMethod](entityId);
  
      if (!('user_id' in entity) || entity.user_id !== user.id) {
        throw new ForbiddenException(
          `${entityName} вам не принадлежит`
        );
      }
  
      return true;
    }
  }
