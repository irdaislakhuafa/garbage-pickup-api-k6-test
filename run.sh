HOST="http://10.10.164.40:8080"
k6 run \
	--env REST_URL=$HOST/api/rest \
	--env GQL_URL=$HOST/api/gql/graphql \
	--env USER_ID=xxx \
	--env OPTS="$(cat options.jsonc)" \
	$(fzf)
