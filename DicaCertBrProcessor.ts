import { IJobContext, IProcessor } from '@rocket.chat/apps-engine/definition/scheduler';
import { IRead, IModify, IHttp, IPersistence } from '@rocket.chat/apps-engine/definition/accessors';
import { DicaCertBrRecurringStartup } from './DicaCertBrRecurringStartup';

import { DicaCertBrTwitter } from './DicaCertBrTwitter';
import { DicaCertBrPersistence } from './DicaCertBrPersistence';
import { IMessage } from '@rocket.chat/apps-engine/definition/messages';


export class DicaCertBrProcessor implements IProcessor {

    id = 'DicaCertBrProcessor';
    startupSetting = new DicaCertBrRecurringStartup();

    public async processor(jobContext: IJobContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence) {
        const settings = read.getEnvironmentReader().getSettings();
        const consumer_key = await settings.getValueById('consumer_key');
        const consumer_secret = await settings.getValueById('consumer_secret');
        const roomName = await settings.getValueById('room_name');
        const senderUsername = await settings.getValueById('sender_username');
        const userReader = read.getUserReader();
        const roomReader = read.getRoomReader();
        const sender = await userReader.getByUsername(senderUsername);
        const room = await roomReader.getByName(roomName);
        if (consumer_key && consumer_secret && room) {
            try {
                const api = new DicaCertBrTwitter(http, consumer_key, consumer_secret);
                const status = await api.getLastTip();
                if (status) {
                    const persistenceReader = read.getPersistenceReader();
                    const db = new DicaCertBrPersistence(persistenceReader, persis);
                    const text = 'Dica de Segurança:\n\n' + status['text'] + '\n\nhttps://cartilha.cert.br/'
                    const messageAlreadySent = await db.messageAlreadySent(status['id']);
                    if (!messageAlreadySent) {
                        const message: IMessage = {
                            text, room, sender, alias: 'CERT.br',
                            emoji: ':lock:', parseUrls: true
                        }
                        const messageBuild = modify.getCreator().startMessage(message)
                        modify.getCreator().finish(messageBuild);
                    }
                }
            } catch(error) {
                console.log('Err: ', error);
            }
        }
    }
}
