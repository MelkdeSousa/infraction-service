import { AIT } from '@/domain/ait.entity';

interface RemoveAITRequest {
  id: string;
}

export abstract class IRemoveAITContract {
  abstract removeById(request: RemoveAITRequest): Promise<AIT>;
}
