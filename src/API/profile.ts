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

    private async isTokenValid(): Promise<boolean> {
        const { data } = await axios.get(APIFunPayUrls.getIdProfile, {
            headers: {
                ...this.headers
            }
        });

        const hasId = data.match(/<a href="https:\/\/funpay.com\/users\/(.*)\/" class="user-link-dropdown">/g);
        return !!hasId;
    };

    /**
        * @method getProfile
        * @description Get your profile
        * @returns {Promise<FunPayProfileType>} Profile
    **/
    public async getProfile(): Promise<FunPayProfileType> {
        const tokenValid = await this.isTokenValid();
        if (!tokenValid)
            throw new Error('Invalid token');

        const { data } = await axios.get(APIFunPayUrls.getIdProfile, {
            headers: {
                ...this.headers
            }
        });
        
        const id = data.match(/<a href="https:\/\/funpay.com\/users\/(.*)\/" class="user-link-dropdown">/g)[0].match(/\/users\/(.*)\//g)[0].replace(/\/users\/|\/|"/g, '');
        const link = `https://funpay.com/users/${id}/`;
        const name = data.match(/<div class="user-link-name">(.*)<\/div>/g)[0].match(/>(.*)</g)[0].replace(/<|>/g, '');
        
        const getProfile = await axios.get(`${APIFunPayUrls.getProfile}${id}/`);
        const profileData = getProfile.data;

        const hasRating = profileData.match(/<span class="big">(.*)<\/span>/g);
        const rating = hasRating ? +hasRating[0].match(/>(.*)</)[1][0] : 0;

        const hasReviews = profileData.match(/<div class="text-mini text-light mb5">(.*)<\/div>/g);
        const totalReviews = hasReviews ? +hasReviews[0].match(/>(.*?)</)[1].match(/\d+/)[0] : 0;

        return {
            id,
            link,
            name,
            avatarPhoto: profileData.match(/<div class="avatar-photo" style="background-image: url\((.*)\);"><\/div>/g)[0].match(/url\((.*)\)/g)[0].replace(/url\(|\)/g, ''),
            rating: rating,
            totalReviews: totalReviews
        };
    };

    /**
        * @method getUnreadMessages
        * @description Get your unread messages
        * @returns {Promise<number>} Unread messages
    **/
    public async getUnreadMessages(): Promise<number> {
        const tokenValid = await this.isTokenValid();
        if (!tokenValid)
            throw new Error('Invalid token');

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
        * @returns {Promise<number>} Balance
    **/
    public async getBalance(): Promise<number> {
        const tokenValid = await this.isTokenValid();
        if (!tokenValid)
            throw new Error('Invalid token');

        const { data } = await axios.get(APIFunPayUrls.getBalance, {
            headers: {
                ...this.headers
            }
        });

        const hasBalance = data.match(/<span class="badge badge-balance">(.*)<\/span>/);
        const balance = hasBalance ? parseInt(hasBalance[1].replace(/\s+/g, ''), 10) : 0;
        
        return balance;
    };
};

export default FunPayProfile;