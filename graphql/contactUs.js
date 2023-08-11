import http from 'k6/http';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { check, group, sleep } from 'k6';

const env = JSON.parse(__ENV.OPTS)
const url = `${env.api.host + env.api.basePath.graphql}`

export const options = function () { return env.options }()

export default function () {
	const query = `
		query {
			contactUs {
				findAll { image, title, value }
			}
		}
	`
	const body = JSON.stringify({ query: query })
	let headers = {
		'Content-Type': 'application/json'
	}
	const res = http.post(url, body, { headers: headers })
	check(res, {
		"get all data for page is success": (r) => {
			const body = JSON.parse(r.body)
			const isOk = (body.errors == null)
			if (!isOk) {
				console.log(r.body)
			}
			return isOk
		}
	})
	sleep(Number(env.runner.sleep))
};