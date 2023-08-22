// Imports
import axios from 'axios';
import { APIFunPayUrls } from './enums/funpay.js';
// Functions
const isTokenValid = async (token: string): Promise<boolean> => {
    if (!token)
        throw new Error('Token not provided');

    const { data } = await axios.get(APIFunPayUrls.GET_ID_PROFILE, {
        headers: {
            Cookie: `golden_key=${token}`
        }
    });

    const hasId = data.match(/<a href="https:\/\/funpay.com\/users\/(.*)\/" class="user-link-dropdown">/g);
    return !!hasId;
};

const getAccountCredentials = async (token: string): Promise<{ id: number, name: string, csrfToken: string, phpSessionId: string }> => {
    const tokenValid = await isTokenValid(token);
    if (!tokenValid)
        throw new Error('Invalid token');

    const { headers, data } = await axios.get(APIFunPayUrls.GET_ID_PROFILE, {
        headers: {
            Cookie: `golden_key=${token}`
        }
    });
    
    const phpSessionId = headers['set-cookie']!.find(i => i.includes('PHPSESSID'))?.split(';')[0].split('=')[1];;
    if (!phpSessionId)
        throw new Error('PHPSESSID not found');
    
    return {
        id: +data.match(/<a href="https:\/\/funpay.com\/users\/(.*)\/" class="user-link-dropdown">/g)[0].match(/\/users\/(.*)\//g)[0].replace(/\/users\/|\/|"/g, ''),
        name: data.match(/<div class="user-link-name">(.*)<\/div>/g)[0].match(/>(.*)</g)[0].replace(/<|>/g, ''),
        csrfToken: data.match(/data-app-data="(.*)"/g)[0].match(/csrf-token&quot;:&quot;(.*)&quot;,&quot;userId&quot;/g)[0].replace(/csrf-token&quot;:&quot;|&quot;,&quot;userId&quot;/g, ''),
        phpSessionId
    };
};

export { isTokenValid, getAccountCredentials };