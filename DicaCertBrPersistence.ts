import { IPersistence, IPersistenceRead } from "@rocket.chat/apps-engine/definition/accessors";
import { RocketChatAssociationModel, RocketChatAssociationRecord } from "@rocket.chat/apps-engine/definition/metadata";

export class DicaCertBrPersistence {

    constructor(
        private read: IPersistenceRead,
        private write: IPersistence
    ) {

    }

    public async messageAlreadySent(id: number): Promise<any> {
        const association = new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, 'last_status');
        const statuses = await this.read.readByAssociation(association);
        if (statuses.length === 0) {
            this.write.createWithAssociation({id}, association);
        } else {
            if (statuses[0]['id'] === id) {
                return true;
            } else {
                this.write.updateByAssociation(association, {id});
            }
        }
        return false;
    }
}
