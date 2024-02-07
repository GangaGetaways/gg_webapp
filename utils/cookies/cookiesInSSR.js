import { cookies } from 'next/headers'

const getCookieInSSR = (name) => {
	const cookiesList = cookies()

	if (name) {
		const cookieValue = cookiesList?.get(name)
		return cookieValue?.value
	} else {
		// return all cookies
		const allCookiesList = cookiesList.getAll()
		return allCookiesList
			.map((cookie) => `${cookie.name}=${cookie.value}`)
			.join('; ')
	}
}

const setCookieInSSR = (name , value, expires, options={}) => {
	const today = new Date();
    today.setTime(today.getTime());
    if (expires) {
        expires = expires * 1000 * 60 * 60 * 24;
    }
    const expires_date = new Date(today.getTime() + expires);
  	cookies().set(name, value, { expires: expires_date.toGMTString(), ...options})
}

export { getCookieInSSR, setCookieInSSR };
