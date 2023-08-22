// Imports
import axios, { toFormData } from 'axios';
import { getAccountCredentials } from '../util.js';
import { RatingReviews } from '../@types/purchases.js';
import { APIFunPayUrls } from '../enums/funpay.js';

/**
    * @class FunPayPurchases
    * @description A class that provides methods for working with purchases
    * @param {string} token - FunPay API token
*/
class FunPayPurchases {
    constructor(private token: string) {
        this.token = token;
    };

    /**
        * @method sendReview
        * @description Change/add review to Purchase
        * @returns {Promise<string>} HTML content
    **/
    public async sendReview(orderId: string, text: string, rating: RatingReviews = 5): Promise<string> {
        const accountCredentials = await getAccountCredentials(this.token);
        const payload = toFormData({
            'authorId': accountCredentials.id,
            'text': text,
            'rating': rating,
            'csrf_token': accountCredentials.csrfToken,
            'orderId': orderId
        });

        const { data } = await axios.post(APIFunPayUrls.SEND_REVIEW, payload, {
            headers: {
                'Accept': '*/*',
                'X-Requested-With': 'XMLHttpRequest',
                'Cookie': `golden_key=${this.token}; PHPSESSID=${accountCredentials.phpSessionId}`,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
            }
        });
        
        return data.content;
    };

    /**
        * @method deleteReview
        * @description Delete review from Purchase
        * @returns {Promise<string>} HTML content
    **/
    public async deleteReview(orderId: string): Promise<string> {
        const accountCredentials = await getAccountCredentials(this.token);
        const payload = toFormData({
            'authorId': accountCredentials.id,
            'csrf_token': accountCredentials.csrfToken,
            'orderId': orderId
        });

        const { data } = await axios.post(APIFunPayUrls.DELETE_REVIEW, payload, {
            headers: {
                'Accept': '*/*',
                'X-Requested-With': 'XMLHttpRequest',
                'Cookie': `golden_key=${this.token}; PHPSESSID=${accountCredentials.phpSessionId}`,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
            }
        });
        
        return data.content;
    };
};

export default FunPayPurchases;