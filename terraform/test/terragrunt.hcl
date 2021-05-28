terraform {
  source = "git::https://github.com/bcgov/parks_reso-admin-terraform.git//?ref=v0.0.0"
}

include {
  path = find_in_parent_folders()
}

generate "test_tfvars" {
  path              = "test.auto.tfvars"
  if_exists         = "overwrite"
  disable_signature = true
  contents          = <<-EOF
service_names = ["ssp"]
EOF
}
