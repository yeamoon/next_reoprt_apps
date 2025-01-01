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

  metadata_startup_script = <<-EOT
    #!/bin/bash
    echo "Infrastructure created. Ready for app deployment."
  EOT
}
