// Imports
import FunPayProfile from './API/profile.js';

/**
    * @class FunPayAPI
    * @description FunPayAPI class 
    * @param {string} token - FunPay API token
*/
class FunPayAPI {
    public Profile: FunPayProfile;

    constructor(token: string) {
        this.Profile = new FunPayProfile(token);
    };
};

export default FunPayAPI;