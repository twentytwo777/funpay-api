# FUNPAY-API | [FunPay](https://funpay.com/) API
## Installation
```bash
npm i funpay-api
```
## Usage
```ts
import FunPayAPI from 'funpay-api';

const API = new FunPayAPI('YOUR_GOLDEN_KEY');
const profile = await API.Profile.getProfile();

console.log(`ID ${profile.id}`);
console.log(`NAME ${profile.name}`);
console.log(`AvatarPhoto ${profile.avatarPhoto}`);
console.log(`Rating ${profile.rating}`);
console.log(`Total Reviews ${profile.totalReviews}`);
console.log(`Link ${profile.totalReviews}`);
```

# Output
```
-> % npm start
ID 6213754
NAME twentytwo777
AvatarPhoto https://s.funpay.com/s/avatar/hw/lu/hwlu87y7ya5n1lao0p7v.jpg
Rating 0
Total Reviews 0
Link https://funpay.com/users/6213754/
```

## Some info
At the moment, the library is under development, so not all methods available in the FUNPAY-API.

The library documentation is also under development, but you can always participate in its development by simply creating a PR with documentation for the method.