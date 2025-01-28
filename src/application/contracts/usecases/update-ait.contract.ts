import { AIT } from '../../../domain';

export abstract class IUpdateAITContract {
  abstract execute(request: AIT);
}
