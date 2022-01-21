import { IHttp, IHttpRequest } from "@rocket.chat/apps-engine/definition/accessors";
import { Buffer } from 'buffer';


export class DicaCertBrTwitter {

    constructor(
        private http: IHttp,
        private consumer_key: string,
        private consumer_secret: string) {
    }

    public async getLastTip(): Promise<any> {
        const url = 'https://api.twitter.com/1.1/statuses/user_timeline.json';
        const access = await this.getAccess();
        const options: IHttpRequest = {
            headers: {
                'Authorization': 'Bearer ' + access
            },
            query: 'screen_name=certbr&count=5'
        };
        const resp = await this.http.get(url, options);
        for (let status of resp['data']) {
            for (let hashtag of status['entities']['hashtags']) {
                if (hashtag['text'] === 'dicacertbr') {
                    return status;
                }
            }
        }
    }

    private async getAccess(): Promise<string> {
        const url = 'https://api.twitter.com/oauth2/token';
        const consumer = encodeURIComponent(this.consumer_key) + ':' + encodeURIComponent(this.consumer_secret);
        const token = Buffer.from(consumer).toString('base64');
        const options: IHttpRequest = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'Authorization': 'Basic ' + token
            },
            params: { grant_type: 'client_credentials' }
        }
        const resp = await this.http.post(url, options);
        return resp['data']['access_token'];
    }
}
