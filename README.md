# Dokploy preview manager
API to create Dokploy previews from merge request using Docker as provider.
Uses Node and SQLite.

## Steps:
1. Send create preview request. Params:
   - Source project name.
   - Source project id.
   - Branch name.
3. If the app is already registered in the DB, then manually deploy the preview project (By using the Dokploy API).
4. If the app doesn't exist, then :
   - Create new app using Dokploy API, retrieve the appId.
   - Register the new app in the DB:
     - Project Name: {{Source project-name}}-{{Branch-name}}-preview
     - Source App Id. (The source/base project app id)
     - Project Id. (The preview app id)
   - Set up the Docker provider of the new app by using the Dolkploy API.
     - Use the project name as the docker image tag within the provider.
   - Launch Manual deploy (By using the Dokploy API).
