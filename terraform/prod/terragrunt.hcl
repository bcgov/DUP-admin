terraform {
  source = "git::https://github.com/bcgov/parks_reso-admin-terraform.git//?ref=main"
}

include {
  path = find_in_parent_folders()
}

generate "prod_tfvars" {
  path              = "prod.auto.tfvars"
  if_exists         = "overwrite"
  disable_signature = true
  contents          = <<-EOF
target_env = "prod"
EOF
}
