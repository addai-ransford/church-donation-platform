gcloud run deploy caci-antwerp \
  --source . \
  --region europe-west1 \
  --allow-unauthenticated \
  --env-vars-file env.yaml