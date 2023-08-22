// Imports
import axios from 'axios';
import { APIFunPayUrls } from '../enums/funpay.js';
import { FunPayProfileType } from '../@types/profile.js';

/**
    * @class FunPayProfile
    * @description A class that allows you to get information about your profile
    * @param {string} token - FunPay API token
*/
class FunPayProfile {
    private headers: object;

    constructor(private token: string) {
        this.token = token;
        this.headers = {
            Cookie: `golden_key=${this.token}`
        };
    };

    /**
        * @method getProfile
        * @description Get your profile
        * @returns {Promise<FunPayProfileType>} Profile
    **/
    public async getProfile(): Promise<FunPayProfileType> {
        const { data } = await axios.get(APIFunPayUrls.getIdProfile, {
            headers: {
                ...this.headers
            }
        });

        const id = +data.match(/<a href="https:\/\/funpay.com\/users\/(.*)\/" class="user-link-dropdown">/g)[0].match(/\/users\/(.*)\//g)[0].replace(/\/users\/|\/|"/g, '');
        const name = data.match(/<div class="user-link-name">(.*)<\/div>/g)[0].match(/>(.*)</g)[0].replace(/<|>/g, '');
        
        const getProfile = await axios.get(`${APIFunPayUrls.getProfile}${id}/`);
        const profileData = getProfile.data;

        return {
            id,
            name,
            avatarPhoto: profileData.match(/<div class="avatar-photo" style="background-image: url\((.*)\);"><\/div>/g)[0].match(/url\((.*)\)/g)[0].replace(/url\(|\)/g, ''),
            rating: +profileData.match(/<span class="big">(.*)<\/span>/g)[0].match(/>(.*)</)[1][0],
            totalReviews: +profileData.match(/<div class="text-mini text-light mb5">(.*)<\/div>/g)[0].match(/>(.*?)</)[1].match(/\d+/)[0]
        };
    };

    /**
        * @method getUnreadMessages
        * @description Get your unread messages
        * @returns {Promise<number>} Unread messages
    **/
    public async getUnreadMessages(): Promise<number> {
        const { data } = await axios.get(APIFunPayUrls.getIdProfile, {
            headers: {
                ...this.headers
            }
        });

        const unreadedMessages = data.match(/<span class="badge badge-chat">(.*?)<\/span>/);

        return unreadedMessages ? +unreadedMessages[1] : 0;
    };

    /**
        * @method getBalance
        * @description Get your balance
        * @returns {Promise<string>} Balance
    **/
    public async getBalance(): Promise<string> {
        const { data } = await axios.get(APIFunPayUrls.getBalance, {
            headers: {
                ...this.headers
            }
        });
        
        return data.match(/<span class="badge badge-balance">(.*)<\/span>/g)[0].match(/>(.*)</g)[0].replace(/<|>/g, '');
    };
};

export default FunPayProfile;