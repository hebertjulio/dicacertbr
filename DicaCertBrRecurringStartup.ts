import { IRecurringStartup, StartupType } from '@rocket.chat/apps-engine/definition/scheduler';


export class DicaCertBrRecurringStartup implements IRecurringStartup {
    type: StartupType.RECURRING = StartupType.RECURRING;
    interval = 'one hour';
}
