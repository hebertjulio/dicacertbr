import { IAppAccessors, IConfigurationExtend, ILogger } from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { SettingType } from '@rocket.chat/apps-engine/definition/settings';

import { DicaCertBrProcessor } from './DicaCertBrProcessor';


export class DicaCertBrApp extends App {

    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    public async extendConfiguration(configuration: IConfigurationExtend) {
        await configuration.settings.provideSetting({
            id: 'room_name',
            type: SettingType.STRING,
            packageValue: 'general',
            required: true,
            public: false,
            i18nLabel: 'room_name_label',
        });

        await configuration.settings.provideSetting({
            id: 'sender_username',
            type: SettingType.STRING,
            packageValue: '',
            required: false,
            public: false,
            i18nLabel: 'sender_username_label',
        });

        await configuration.settings.provideSetting({
            id: 'consumer_key',
            type: SettingType.STRING,
            packageValue: '',
            required: true,
            public: false,
            i18nLabel: 'consumer_key_label',
        });

        await configuration.settings.provideSetting({
            id: 'consumer_secret',
            type: SettingType.STRING,
            packageValue: '',
            required: true,
            public: false,
            i18nLabel: 'consumer_secret_label',
        });

        await configuration.scheduler.registerProcessors([
            new DicaCertBrProcessor()
        ]);
    }
}
