resource "google_compute_instance" "vm_instance" {
  name         = "docker-vm"
  machine_type = "e2-medium"
  zone         = var.zone

  # Disk and image configuration
  boot_disk {
    initialize_params {
      image = "cos-cloud/cos-stable" # Container-Optimized OS
    }
  }

  network_interface {
    network    = "default"
    access_config {
      # Assign public IP
    }
  }

  metadata = {
    "gce-container-declaration" = <<EOF
spec:
  containers:
    - name: report-app
      image: ${var.docker_image}
      ports:
        - containerPort: 3000
          hostPort: 80
  restartPolicy: Always
EOF
  }
}

