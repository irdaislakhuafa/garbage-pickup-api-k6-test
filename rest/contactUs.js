import http from 'k6/http';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { check, group, sleep } from 'k6';

const env = JSON.parse(__ENV.OPTS)
const host = `${env.api.host + env.api.basePath.rest}`
export const options = function () { return env.options }()

export default function () {
	let url = `${host}/contactUs`
	let res = http.get(url)
	check(res, {
		"get contact us success": (r) => {
			const isOk = (r.status === 200)
			if (!isOk) {
				console.log(JSON.parse(r.body).errors)
			}
			return isOk
		},
	})
	sleep(1)
};