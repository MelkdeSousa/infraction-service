import { AIT } from '@/domain/ait.entity';

export abstract class ICreateAITContract {
  abstract execute(request: AIT);
}
