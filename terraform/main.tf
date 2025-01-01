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

  # Network configuration
  network_interface {
    network    = "default"
    access_config {
      # Assign public IP
    }
  }

  # Metadata without Docker container deployment
  metadata = {
    "startup-script" = <<EOF
    #!/bin/bash
    echo "Infrastructure created. VM is ready for app deployment."
    EOF
  }
}

# Firewall rule to allow HTTP traffic
resource "google_compute_firewall" "default" {
  name    = "allow-http"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["80"]
  }

  source_ranges = ["0.0.0.0/0"]
}
