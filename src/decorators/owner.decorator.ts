import { SetMetadata } from '@nestjs/common';

export const OWNER_KEY = 'owner';
export interface OwnerConfig {
  paramName: string; 
  entityName?: string; 
  serviceMethod?: string;
}

export const Owner = (config: OwnerConfig) => 
  SetMetadata(OWNER_KEY, config);

