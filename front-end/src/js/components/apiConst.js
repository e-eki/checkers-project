
const api_url = 'http://localhost:3000/api';

const vk_client_id = '6711833';
const fb_client_id = '455348051621476';
const google_client_id = '100666725887-otk617ad9448ec49096hufs8001hhel3.apps.googleusercontent.com';

module.exports = {

	vkApi: `https://oauth.vk.com/authorize?client_id=${vk_client_id}&display=page&scope=email&redirect_uri=${api_url}/login&response_type=code&v=5.85&state=vk`,
	googleApi: `https://accounts.google.com/o/oauth2/auth?redirect_uri=${api_url}/login&response_type=code&client_id=${google_client_id}&scope=https://www.googleapis.com/auth/userinfo.email`,

	changePasswordApi: `${api_url}/changepassword/`,
	emailConfirmApi: `${api_url}/emailconfirm/`,
	getLkDataApi: `${api_url}/lkUserData/`,
	login: `${api_url}/login/`,
	registration: `${api_url}/registration/`,
	refreshTokens: `${api_url}/refreshtokens/`,
	logout: `${api_url}/logout/`,
	gameApi: `${api_url}/game/`,
}