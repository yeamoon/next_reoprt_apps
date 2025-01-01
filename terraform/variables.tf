variable "docker_image" {
  description = "Docker image to deploy"
  default     = "sultana730/report_app:main-bc859b2"
}

variable "region" {
  description = "GCP region"
  default     = "us-central1"
}

variable "zone" {
  description = "GCP zone"
  default     = "us-central1-a"
}
