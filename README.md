

# **Project Documentation**

## **Setup Instructions for Running Locally**

1. **Prerequisites**:
   - Install **Node.js** (version 20 or later).
   - Install **npm** (comes with Node.js).
   - Optional: Install **Playwright** if you plan to run end-to-end tests locally.

2. **Steps**:
   - Clone the repository:
     ```bash
     git clone https://github.com/yeamoon/next_reoprt_apps.git
     cd next-report-app
     ```
   - Install dependencies:
     ```bash
     npm install --legacy-peer-deps
     ```
   - Build the project:
     ```bash
     npm run build
     ```
   - Start the development server:
     ```bash
     npm run dev
     ```
   - Open the app in your browser at `http://localhost:3000/next_report_apps`.

3. **Running Tests**:
   - **Unit Tests**:
     ```bash
     npm test
     ```
   - **End-to-End Tests** (Playwright):
     ```bash
     npm run test:e2e
     ```



## **Pipeline Configuration Explanation**

### **CI Pipeline for Building and Running Tests**
- **Trigger**:
  - Runs on **push** events to the `main` branch and **pull requests** targeting the `main` branch.
  
- **Steps**:
  1. **Checkout Code**: Retrieves the repository code.
  2. **Set Up Node.js**: Configures Node.js version 20.
  3. **Install Dependencies**: Runs `npm install --legacy-peer-deps`.
  4. **Clear Playwright Browser Cache**: Prevents cache-related issues.
  5. **Install Playwright Browsers**: Reinstalls Playwright dependencies.
  6. **Build the Project**: Ensures the application builds without errors.
  7. **Run Unit Tests**: Executes `npm test`.
  8. **Serve the App**: Serves the app locally for end-to-end testing.
  9. **Run Playwright Tests**: Runs Playwright end-to-end tests and generates an HTML report.
  10. **Upload Playwright Test Report**: Saves the test report as an artifact.
  11. **Stop the Server**: Stops the local test server running on port `3000`.


### **Deployment to GitHub Pages**
- **Trigger**:
  - Runs on **push** events to the `main` branch and on manual triggers via `workflow_dispatch`.

- **Steps**:
  1. **Detect Package Manager**: Automatically detects if the project uses npm or yarn.
  2. **Install Dependencies**: Installs dependencies using `npm install --legacy-peer-deps`.
  3. **Build the App**: Builds the Next.js project with `next build`.
  4. **Upload Artifact**: Uploads the built project (`./out`) for deployment.
  5. **Deploy to GitHub Pages**: Deploys the app to GitHub Pages.

- **Access**: The app is accessible at:  
  **https://yeamoon.github.io/next_reoprt_apps/**.



### **Terraform Infrastructure as Code**
- **Trigger**:
  - Runs on **push** events to the `main` branch.

- **Steps**:
  1. **Set Up Terraform**: Installs and initializes Terraform.
  2. **Authenticate with Google Cloud**: Authenticates with GCP using GitHub Secrets.
  3. **Terraform Plan**: Generates a plan for infrastructure changes.
  4. **Terraform Apply**: Deploys resources using Terraform.






### **Docker Deployment to Google Cloud VM**
- **Trigger**:
  - Runs on **push** events to the `main` branch and **pull requests** targeting `main`.

- **Steps**:
  1. **Set Up Docker Buildx**: Configures Docker Buildx for multi-platform builds.
  2. **Build Docker Image**: Builds the app's Docker image.
  3. **Push Docker Image**: Pushes the image to a container registry (e.g., Docker Hub).
  4. **Authenticate with Google Cloud**: Authenticates with GCP using GitHub Secrets.
  5. **Deploy to GCP VM**:
     - Pulls and runs the Docker image on a GCP VM.
     - The app is served on port `3000`.
  6. **Run Smoke Tests**:
     - Verifies the app is running and accessible at the VM's public IP.
  7. **Slack Notifications**:
     - Sends a success message if the deployment is successful.
     - Sends a failure message if the deployment fails.






## **Deployment Process Overview**

### **To GitHub Pages**:
1. Commit and push changes to the `main` branch.
2. GitHub Actions builds and deploys the app automatically.
3. Access the app at:  
   **https://yeamoon.github.io/next_reoprt_apps/**.

### **To Google Cloud VM**:
1. Commit and push changes to the `main` branch.
2. GitHub Actions builds the Docker image, pushes it to Docker Hub, and deploys it to a GCP VM.
3. Access the app at:  
   **http://34.132.122.250:3000/**

5. Run smoke tests to confirm the app is live.



## **Known Limitations and Issues**

 **Playwright Test Failures**:
   - Some tests related to the "Download Report" button fail during CI runs.
   - Further troubleshooting is required to fix the issue and ensure the feature works as expected.







  

