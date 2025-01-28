variable "cidr_block" {}
variable "azs" {
  type = list(string)
}
variable "public_subnets" {
  type = list(string)
}
variable "private_subnets" {
  type = list(string)
}
variable "enable_nat_gateway" {
  default = true
}
variable "single_nat_gateway" {
  default = true
}
