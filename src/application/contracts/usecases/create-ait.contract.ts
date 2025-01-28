import { AIT } from '../../../domain';

export abstract class ICreateAITContract {
  abstract execute(request: AIT);
}
