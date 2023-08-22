// Imports
import FunPayProfile from './API/profile.js';
import FunPayPurchases from './API/purchases.js';

/**
    * @class FunPayAPI
    * @description FunPayAPI class 
    * @param {string} token - FunPay API token
*/
class FunPayAPI {
    public Profile: FunPayProfile;
    public Purchases: FunPayPurchases;

    constructor(private token: string) {
        this.Profile = new FunPayProfile(token);
        this.Purchases = new FunPayPurchases(token);
    };
};

export default FunPayAPI;