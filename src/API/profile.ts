// Imports
import axios from 'axios';
import { isTokenValid, getAccountCredentials } from '../util.js';
import { APIFunPayUrls } from '../enums/funpay.js';
import { FunPayProfileType } from '../@types/profile.js';

/**
    * @class FunPayProfile
    * @description A class that allows you to get information about your profile
    * @param {string} token - FunPay API token
*/
class FunPayProfile {
    constructor(private token: string) {
        this.token = token;
    };

    /**
        * @method getProfile
        * @description Get your profile
        * @returns {Promise<FunPayProfileType>} Profile
    **/
    public async getProfile(): Promise<FunPayProfileType> {
        const littleInfo = await getAccountCredentials(this.token);
        const link = `https://funpay.com/users/${littleInfo.id}/`;
        
        const getProfile = await axios.get(`${APIFunPayUrls.GET_PROFILE}${littleInfo.id}/`);
        const profileData = getProfile.data;

        const hasRating = profileData.match(/<span class="big">(.*)<\/span>/g);
        const rating = hasRating ? +hasRating[0].match(/>(.*)</)[1][0] : 0;

        const hasReviews = profileData.match(/<div class="text-mini text-light mb5">(.*)<\/div>/g);
        const totalReviews = hasReviews ? +hasReviews[0].match(/>(.*?)</)[1].match(/\d+/)[0] : 0;

        const avatarPhoto = profileData.match(/<div class="avatar-photo" style="background-image: url\((.*)\);"><\/div>/g)[0].match(/url\((.*)\)/g)[0].replace(/url\(|\)/g, '');

        return {
            id: littleInfo.id,
            link, name: littleInfo.name,
            avatarPhoto, rating: rating,
            totalReviews: totalReviews
        };
    };

    /**
        * @method getUnreadMessages
        * @description Get your unread messages
        * @returns {Promise<number>} Unread messages
    **/
    public async getUnreadMessages(): Promise<number> {
        const tokenValid = await isTokenValid(this.token);
        if (!tokenValid)
            throw new Error('Invalid token');

        const { data } = await axios.get(APIFunPayUrls.GET_ID_PROFILE, {
            headers: {
                Cookie: `golden_key=${this.token}`
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
        const tokenValid = await isTokenValid(this.token);
        if (!tokenValid)
            throw new Error('Invalid token');

        const { data } = await axios.get(APIFunPayUrls.GET_BALANCE, {
            headers: {
                Cookie: `golden_key=${this.token}`
            }
        });

        const hasBalance = data.match(/<span class="badge badge-balance">(.*)<\/span>/);
        const balance = hasBalance ? parseInt(hasBalance[1].replace(/\s+/g, ''), 10) : 0;
        
        return balance;
    };
};

export default FunPayProfile;