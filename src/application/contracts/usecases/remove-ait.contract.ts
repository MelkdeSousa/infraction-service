import { AIT } from '../../../domain';

interface RemoveAITRequest {
  id: string;
}

export abstract class IRemoveAITContract {
  abstract removeById(request: RemoveAITRequest): Promise<AIT>;
}
