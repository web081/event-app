module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  cluster_name    = var.cluster_name
  cluster_version = var.cluster_version
  subnet_ids      = var.private_subnets
  vpc_id         = var.vpc_id

  eks_managed_node_groups = var.eks_managed_node_groups

  tags = {
    Name = var.cluster_name
  }
}