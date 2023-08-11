import http from 'k6/http';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { check, group, sleep } from 'k6';

const env = JSON.parse(__ENV.OPTS)
const url = `${env.api.host + env.api.basePath.graphql}`

export const options = function () { return env.options }()

export default function () {
	const mutation = `
		mutation {
			user {
				login(
					request: {
						email: "${env.variables.user.email}"
						password: "${env.variables.user.password}"
						lat: ${env.variables.user.lat}
						lng: ${env.variables.user.lng}
					}
					) {
						token
					}
				}
		}
	`

	const headers = {
		'Content-Type': 'application/json'
	}

	const body = JSON.stringify({ query: mutation })
	let res = http.post(url, body, { headers: headers })
	check(res, {
		"login success": (r) => {
			const body = JSON.parse(r.body)
			const isOk = (body.errors == null)
			if (!isOk) {
				console.log(body.errors)
			}
			return isOk
		},
	})

	sleep(Number(env.runner.sleep))
};