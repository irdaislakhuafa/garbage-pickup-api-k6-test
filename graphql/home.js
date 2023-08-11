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
				findById(id: "${userId}") { name point }
			}
			pickup {
				findAllByUserIdWithRangeDate(request: {
					userId: "${userId}"
					start: "08/08/2023 00:00:00"
					end: "08/09/2023 00:00:00"
				}) {
					status
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
		"get all data for home page success": (r) => {
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