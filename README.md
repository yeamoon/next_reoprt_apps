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

### 2. Pipeline Configuration Explanation
The CI/CD pipeline is implemented using GitHub Actions and includes workflows for building, testing, and deploying the application. Below is a breakdown of the workflows configured:

Workflow 1: CI Pipeline for Building and Running Tests
File Name: .github/workflows/ci.yml
Workflow Steps:
1. Trigger Events:
The pipeline is triggered on:

Push events to the main branch.
Pull requests targeting the main branch.
Jobs:

Build Job:

Checkout Code:

Retrieves the repository's code using the actions/checkout@v2 action.

Set Up Node.js:

Installs Node.js v20 and sets up the environment.

Install Dependencies:

Runs npm install --legacy-peer-deps to install all necessary dependencies.

Clear Playwright Browser Cache:

Removes old Playwright browser cache to prevent issues.

Install Playwright Browsers:

Re-installs Playwright browsers with dependencies using npx playwright install --with-deps.

Build the Project:

Ensures the application builds successfully by running npm run build.

Run Unit Tests:

Executes the test suite using npm test.

Serve the App Locally for E2E Tests:

Starts the app using npx serve out and allows it to run in the background.

Run Playwright Tests:

Executes Playwright end-to-end tests and generates a detailed HTML report.

Note: This step is configured to continue even if tests fail using || true for debugging purposes.

Upload Playwright Test Report:

Saves the Playwright HTML test report as an artifact for later review.

Stop the Server:

Stops the local server running on port 3000.

Workflow 2: Deployment to GitHub Pages
File Name: .github/workflows/deploy.yml
Workflow Steps:
Trigger Events:
The workflow is triggered on:

Push events to the main branch.
Manual triggers using workflow_dispatch.
Jobs:

Build Job:

Detect Package Manager:
Automatically determines whether to use npm or yarn for building the project.
Install Dependencies:
Runs npm install --legacy-peer-deps to install the required dependencies.
Build with Next.js:
Builds the application using next build.
Upload Artifact:
Uploads the built project (./out) as an artifact for deployment.
Deploy Job:

Deploys the built project to GitHub Pages using actions/deploy-pages@v4.
The app is accessible at:
https://your-username.github.io/next-report-app.
Workflow 3: Docker Deployment to Google Cloud VM
File Name: .github/workflows/docker-deploy.yml
Workflow Steps:
Trigger Events:
This workflow is triggered on:

Push events to the main branch.
Pull requests targeting the main branch.
Jobs:

Build and Deploy Job:
Set Up Docker Buildx:
Configures Docker Buildx for multi-platform builds.
Build Docker Image:
Builds the Docker image with the application code.
Push Docker Image:
Pushes the Docker image to a container registry like Docker Hub using your credentials.
Authenticate with GCP:
Authenticates with Google Cloud using the google-github-actions/auth@v1 action.
Deploy to GCP VM:
Pulls and runs the Docker image on the VM instance using gcloud compute ssh.
Post-Deployment Checks:

Smoke Tests:
Runs a health check to ensure the app is accessible at the VM's public IP.
Slack Notifications:
Sends a success message if the deployment is successful.
Sends a failure message if the deployment fails, prompting further investigation.
Workflow 4: Terraform Infrastructure as Code
File Name: .github/workflows/terraform.yml
Workflow Steps:
Trigger Events:
Triggered on push events to the main branch.

Jobs:

Deploy Job:
Set Up Terraform:
Configures Terraform using the hashicorp/setup-terraform@v2 action.
Authenticate with GCP:
Uses the google-github-actions/auth@v1 action to authenticate with Google Cloud.
Initialize Terraform:
Initializes the Terraform configuration with terraform init.
Plan Infrastructure:
Generates a plan for the infrastructure changes using terraform plan.
Apply Infrastructure Changes:
Deploys the resources using terraform apply -auto-approve.
Key Notes
Artifacts: The Playwright test reports are stored as artifacts for debugging.
Environment Variables: Sensitive credentials, such as Docker registry keys and GCP credentials, are securely stored in GitHub Secrets.
Public Access Costs: The GCP VM deployment incurs costs for public accessibility. Currently, it is private, but can be made public upon confirmation.
This explanation provides a comprehensive overview of your pipeline configuration and should meet the documentation requirements. Let me know if you'd like any further refinements!
3. Deployment Process Overview
GitHub Pages
Steps:
The GitHub Actions workflow includes a deploy step that uses the gh-pages package.
Upon successful testing, the app is deployed to GitHub Pages and accessible at:
https://your-username.github.io/next-report-app
GCP VM Deployment
Setup:
A Google Cloud Platform VM instance is created using a pre-configured image with Node.js.
The app is cloned and built using npm install and npm run build.
A process manager like pm2 is used to ensure the app runs continuously.
Public Accessibility:
Note: The instance incurs charges when publicly accessible. Currently, the app is live, but public access is disabled to avoid unnecessary charges. Documentation of the setup process is included below:
VM Setup:
css
Copy code
gcloud compute instances create [INSTANCE_NAME] --machine-type=f1-micro --zone=[ZONE]
Deploy App:
bash
Copy code
git clone https://github.com/your-username/next-report-app.git
cd next-report-app
npm install
npm run build
pm2 start npm -- start
To make the app accessible:
lua
Copy code
gcloud compute firewall-rules create allow-http --allow tcp:80
4. Known Limitations or Issues
Playwright Tests
Issue: During Playwright testing, the "Download Report" button test fails as the button does not perform the expected action to download the file.
Status: The issue is being investigated. The root cause could be related to:
Incorrect implementation of the download feature.
A possible bug in the test case or Playwright configuration.
Resolution Options:
Troubleshooting and debugging the button's behavior.
Updating the test configuration to account for any environment-specific behavior.
GCP VM Costs
Limitation: The GCP VM incurs charges for public accessibility. Currently, the app is live on the VM but private. A decision is pending on whether to make it publicly accessible.



  

