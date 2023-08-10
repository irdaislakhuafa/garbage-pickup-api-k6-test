import http from 'k6/http';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { check, group, sleep } from 'k6';

const env = JSON.parse(__ENV.OPTS)
const url = `${env.api.host + env.api.basePath.graphql}`
const userId = env.variables.user.id

export const options = function () { return env.options }()

export default function () {
	const query = `
		query {
			user {
				findById(id: "${userId}") {
					name, address, phone, email
				}
			}
		}
	`
	const body = JSON.stringify({ query: query })
	const headers = {
		'Content-Type': 'application/json'
	}
	const res = http.post(url, body, { headers: headers })
	check(res, {
		"get user is success": (r) => {
			const body = JSON.parse(r.body)
			let isTrue = (body.errors == null)
			if (!isTrue) {
				console.log(body.errors)
			}
			return isTrue
		}
	})
	sleep(1)
};