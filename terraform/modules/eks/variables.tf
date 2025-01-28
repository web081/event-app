variable "cluster_name" {
  type = string
}

variable "cluster_version" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "private_subnets" {
  type = list(string)
}

variable "eks_managed_node_groups" {
  type = map(object({
    instance_type    = string
    desired_size     = number
    max_size         = number
    min_size         = number
  }))
}

variable "key_name" {
  type = string
}