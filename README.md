## Getting Started | Setup Instructions

To set up your environment for local development, make sure Node and all its
dependencies are installed, as well as the two testing suites.

Note, this project is using an RC candidate of react 19

```bash
npm install --legacy-peer-deps
 npx playwright install
```

In order to run the tests, it is critical that the development server is up
first:

```bash
npm run dev & npx wait-on http://localhost:3000
```

You may view and interact with the application at
[http://localhost:3000](http://localhost:3000) on your browser. To run the test
suites separately:

```bash
npm run test # This command runs the Vite unit tests, specified in package.json.
npx playwriight test
```
CI Pipeline :
The CI pipeline is configured using GitHub Actions to automate the process of building, testing, and verifying the application. 
The pipeline performs the following tasks:

Checks out the code from the repository.
Sets up the Node.js environment.
Installs project dependencies.
Clears and reinstalls Playwright browsers.
Builds the application.
Runs unit tests using Vitest.
Starts a local server and runs end-to-end (E2E) tests using Playwright.
Uploads the Playwright test report as an artifact.

1. Checkout Code

- name: Checkout Code
  uses: actions/checkout@v2
This step retrieves the latest version of the code from the main branch.

2. Set up Node.js

- name: Set up Node.js
  uses: actions/setup-node@v3
  with:
    node-version: '20'
The pipeline uses Node.js version 20, which is specified here. This step ensures the proper environment is set up to build and run the application.

3. Install Dependencies

- name: Install Dependencies
  run: npm install --legacy-peer-deps
All required project dependencies are installed using npm install. The --legacy-peer-deps flag ensures compatibility with older peer dependencies that may conflict.

4. Clear Playwright Browser Cache

- name: Clear Playwright browser cache
  run: rm -rf /home/runner/.cache/ms-playwright
This step clears the cached Playwright browsers to ensure that fresh dependencies are used during the E2E tests.

5. Install Playwright Browsers

- name: Install Playwright browsers again
  run: npx playwright install --with-deps
This step installs the required browsers for Playwright testing along with their dependencies.

6. Build the Project

- name: Build the project
  run: npm run build
The npm run build command compiles the application and prepares it for deployment.

7. Run Unit Tests (Vitest)
- name: Run Tests
  run: npm test
The npm test command runs the unit tests using Vitest, the testing framework used in this project. Unit tests validate the functionality of individual components and ensure the application behaves as expected.



8. Serve the App

- name: Serve the app
  run: |
    npx serve out &
    sleep 10
This step starts a local server to host the built application. The server is essential for running end-to-end (E2E) tests.

9. Run End-to-End Tests (Playwright)

- name: Run Playwright Tests
  run: |
    npm run test:e2e --reporter=html --output=playwright-report || true
  env:
    CI: true
The Playwright E2E tests simulate user interactions with the application in a browser to ensure it functions as expected in real-world scenarios.

10. Upload Playwright Test Report

- name: Upload Playwright Test Report
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
The Playwright test report is uploaded as an artifact so developers can review the results, including screenshots and logs.

11. Stop the Server

- name: Stop server
  run: kill $(lsof -t -i:3000) || true
Once the tests are complete, the local server is stopped to free up resources.

Nextjs.yml:

Deploy Next.js site to Pages
The workflow is responsible for automating the build and deployment process for your Next.js application to GitHub Pages.

push: The workflow runs automatically whenever a push is made to the main branch.
workflow_dispatch: The workflow can also be triggered manually from the GitHub Actions tab.
Permissions

permissions:
  contents: read
  pages: write
  id-token: write
contents: read: Allows the workflow to read the contents of the repository.
pages: write: Grants permission to deploy to GitHub Pages.
id-token: write: Enables secure authentication for GitHub Pages deployment.

concurrency:
  group: "pages"
  cancel-in-progress: false
This ensures only one deployment runs at a time for the pages group:
cancel-in-progress: false: Allows ongoing deployments to finish, even if new ones are queued.


Checkout Repository

- name: Checkout
  uses: actions/checkout@v4
Pulls the code from the main branch into the runner.

Detect Package Manager
- name: Detect package manager
  id: detect-package-manager
  run: |
    if [ -f "${{ github.workspace }}/yarn.lock" ]; then
      echo "manager=yarn" >> $GITHUB_OUTPUT
      echo "command=install" >> $GITHUB_OUTPUT
      echo "runner=yarn" >> $GITHUB_OUTPUT
      exit 0
    elif [ -f "${{ github.workspace }}/package.json" ]; then
      echo "manager=npm" >> $GITHUB_OUTPUT
      echo "command=ci" >> $GITHUB_OUTPUT
      echo "runner=npx --no-install" >> $GITHUB_OUTPUT
      exit 0
    else
      echo "Unable to determine package manager"
      exit 1
    fi
Dynamically identifies whether to use npm or yarn as the package manager, depending on the repository's configuration.

Setup Node.js
- name: Setup Node
  uses: actions/setup-node@v4
  with:
    node-version: "20"
    cache: ${{ steps.detect-package-manager.outputs.manager }}
Installs Node.js version 20 and sets up caching for the detected package manager (npm or yarn).

Setup Pages for Next.js
- name: Setup Pages
  uses: actions/configure-pages@v5
  with:
    static_site_generator: next
Configures the workflow for GitHub Pages deployment.
Automatically modifies the next.config.js to:
Inject the correct basePath.
Disable server-side image optimization.

Install Dependencies
- name: Install dependencies 🥑
  run: npm install --legacy-peer-deps
Installs all project dependencies using npm. The --legacy-peer-deps flag resolves conflicts with older peer dependencies.

Build the Project

yaml
Copy code
- name: Build with Next.js
  run: ${{ steps.detect-package-manager.outputs.runner }} next build
Compiles the Next.js project into static files for production deployment.

Upload Build Artifacts
- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: ./out
Uploads the generated static site from the ./out directory as an artifact.
These artifacts will be passed to the deploy job.

Define Environment
environment:
  name: github-pages
  url: ${{ steps.deployment.outputs.page_url }}
Specifies that the deployment is for the github-pages environment.
The URL of the deployed site will be made available in the workflow logs.


Run Deployment
- name: Deploy to GitHub Pages
  id: deployment
  uses: actions/deploy-pages@v4
Publishes the artifacts (from the build job) to GitHub Pages.



Workflow Name (terraform.yml)
name:  Creating Infrastructure using Terraform
This workflow automates infrastructure management and deployment to GCP using Terraform as an Infrastructure as Code (IaC) tool.


on:
  push:
    branches:
      - main
The workflow runs whenever code is pushed to the main branch.
This ensures that any updates to the Terraform code in the repository automatically trigger infrastructure deployment.

Set Up Terraform
- name: Set up Terraform
  uses: hashicorp/setup-terraform@v2
  with:
    terraform_version: 1.5.0
Installs the specified version of Terraform (1.5.0) on the runner.
This step ensures that Terraform is ready to manage the infrastructure.

Authenticate to GCP
- name: Authenticate to GCP
  uses: google-github-actions/auth@v1
  with:
    credentials_json: ${{ secrets.GCP_CREDENTIALS }}
Purpose: This step authenticates the workflow to Google Cloud using a service account.
credentials_json: The JSON key for the GCP service account is stored as a GitHub secret named GCP_CREDENTIALS.
This allows secure access to GCP resources without hardcoding sensitive credentials in the repository.

Initialize Terraform

- name: Initialize Terraform
  run: terraform -chdir=terraform init
Initializes the Terraform configuration located in the terraform directory.
Downloads necessary provider plugins (like the GCP provider).
Prepares the Terraform working directory for further operations.

Plan Terraform Changes

- name: Terraform Plan
  run: terraform -chdir=terraform plan
Creates a detailed execution plan.
Determines what changes Terraform will apply to the infrastructure without making any modifications.

 Apply Terraform Changes
- name: Terraform Apply
  run: terraform -chdir=terraform apply -auto-approve
Applies the changes specified in the Terraform configuration.
-auto-approve: Automatically approves the changes, skipping the manual confirmation step.




Workflow Name
name: Pipeline to Build Docker Image and Deploy to GCP VM
The workflow automates the process of:

Building a Docker image.
Pushing it to Docker Hub (or any other container registry).
Deploying it to a GCP VM.
Performing smoke tests to ensure the deployment is successful.
Sending deployment notifications to Slack.
Triggers
yaml
Copy code
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
Push to Main Branch: The workflow is triggered automatically whenever code is pushed to the main branch.
Pull Requests: The workflow also triggers on pull requests targeting the main branch, allowing testing before merging.
Jobs Breakdown
Job: build_and_deploy
yaml
Copy code
runs-on: ubuntu-latest
The job runs on a fresh Ubuntu virtual machine provided by GitHub Actions.

Steps
1. Checkout Code

- name: Checkout code
  uses: actions/checkout@v2
Fetches the latest version of the repository so the pipeline can access the codebase, including the Dockerfile.
2. Set Up Docker Buildx

- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v1
Purpose: Sets up Docker Buildx, an extended Docker CLI plugin, to build multi-platform images.
3. Build Docker Image

- name: Build Docker image
  run: |
    docker build -t ${{ secrets.DOCKER_USERNAME }}/report-app:${{ github.sha }} .
Builds a Docker image using the Dockerfile in the root of the repository.
Tags the image with a unique identifier based on the Git commit hash (${{ github.sha }}).
4. Authenticate with Docker Hub

- name: Log in to Docker Hub
  uses: docker/login-action@v2
  with:
    username: ${{ secrets.DOCKER_USERNAME }}
    password: ${{ secrets.DOCKER_PASSWORD }}
Logs into Docker Hub (or any container registry) using the credentials stored as GitHub Secrets.
DOCKER_USERNAME and DOCKER_PASSWORD should be stored in your repository's secret settings.
5. Push Docker Image to Docker Hub

- name: Push Docker image to Docker Hub
  run: |
    docker push ${{ secrets.DOCKER_USERNAME }}/report-app:${{ github.sha }}
Pushes the built Docker image to the Docker Hub registry.
This makes the image accessible to the GCP VM for deployment.
6. Authenticate with Google Cloud

- name: Authenticate with Google Cloud
  uses: google-github-actions/auth@v1
  with:
    credentials_json: ${{ secrets.GCP_CREDENTIALS }}
Authenticates to Google Cloud using a service account key stored in GitHub Secrets as GCP_CREDENTIALS.
7. Set Up Google Cloud CLI

- name: Set up Google Cloud CLI
  uses: google-github-actions/setup-gcloud@v1
  with:
    project_id: ${{ secrets.GCP_PROJECT_ID }}
Configures the Google Cloud CLI to interact with the specified GCP project.
The GCP Project ID is stored in a secret named GCP_PROJECT_ID.
8. Deploy Docker Image to GCP VM

- name: Deploy Docker image to GCP VM
  run: |
    gcloud compute ssh docker-vm1 --zone=${{ secrets.GCP_ZONE }} --command="
      sudo docker pull ${{ secrets.DOCKER_USERNAME }}/report-app:${{ github.sha }} &&
      sudo docker run -d -p 3000:3000 ${{ secrets.DOCKER_USERNAME }}/report-app:${{ github.sha }}"
Connects to the target GCP VM (docker-vm1) using the gcloud compute ssh command.
Pulls the Docker image from Docker Hub.
Runs the Docker container on the VM, exposing port 3000 for the application.
GCP Secrets:

GCP_ZONE: The zone where the GCP VM is deployed (e.g., us-central1-a).
DOCKER_USERNAME: Docker Hub username.
GCP_CREDENTIALS: Service account key for GCP.
9. Smoke Tests
yaml
Copy code
- name: Run Smoke Tests (Check if app is up)
  run: |
    IP_ADDRESS=$(gcloud compute instances describe docker-vm1 --zone=${{ secrets.GCP_ZONE }} --format="get(networkInterfaces[0].accessConfigs[0].natIP)")
    echo "Checking if app is running at http://$IP_ADDRESS"

    for i in {1..10}; do
      if curl --silent --fail http://$IP_ADDRESS:3000; then
        echo "App is running!"
        exit 0
      else
        echo "App is not ready yet. Retrying in 5 seconds..."
        sleep 5
      fi
    done

    echo "App failed to respond after multiple attempts."
    exit 1
Performs a health check to ensure the application is running on the GCP VM:
Fetches the public IP address of the VM using gcloud compute instances describe.
Sends HTTP requests to the app's endpoint (http://IP_ADDRESS:3000).
Retries up to 10 times (with a 5-second delay) before declaring a failure.
10. Notify Slack
Success Notification:
yaml
Copy code
- name: Notify Slack (Deployment Success)
  if: ${{ success() }}
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
  run: |
    curl -X POST -H 'Content-type: application/json' \
      --data '{"text":"✅ Deployment Successful! The app has been deployed to GCP VM. 🚀"}' \
      $SLACK_WEBHOOK_URL
Failure Notification:
yaml
Copy code
- name: Notify Slack (Deployment Failed)
  if: ${{ failure() }}
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
  run: |
    curl -X POST -H 'Content-type: application/json' \
      --data '{"text":"❌ Deployment Failed. Please check the logs for details. 😞"}' \
      $SLACK_WEBHOOK_URL
Sends a notification to a Slack channel using a Slack Webhook URL stored in the secret SLACK_WEBHOOK_URL.
Notifies whether the deployment succeeded or failed.
Purpose and Advantages
