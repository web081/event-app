provider "aws" {
  region = "us-east-1"
}

module "vpc" {
  source = "./modules/vpc"

  cidr_block           = "10.0.0.0/16"
  azs                  = ["us-east-1a", "us-east-1b", "us-east-1c"]
  public_subnets       = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  private_subnets      = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
  enable_nat_gateway   = true
  single_nat_gateway   = true
}

module "eks" {
  source          = "./modules/eks"
  cluster_name    = "interview-secure-eks-cluster"
  cluster_version = "1.27"
  vpc_id         = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnets

  eks_managed_node_groups = {
    eks_nodes = {
      instance_type    = "t3.medium"
      desired_size     = 3
      max_size         = 5
      min_size         = 2
    }
  }

  key_name = "invite" # kindly change ssh_key 
}

module "alb" {
  source       = "./modules/alb"
  vpc_id       = module.vpc.vpc_id
  subnets      = module.vpc.public_subnets
  cluster_name = module.eks.cluster_name
}

module "route53_apigateway" {
  source              = "./modules/route53_apigateway"
  domain_name         = "event.com"
  frontend_subdomain  = "front.event.com"
  backend_subdomain   = "api.event.com"
  backend_service_url = "http://backend-service.default.svc.cluster.local:3000"
  vpc_id             = module.vpc.vpc_id  # Remove quotes
  alb_dns_name       = module.alb.dns_name
  alb_zone_id        = module.alb.zone_id
  route53_zone_id    = var.route53_zone_id
}

output "eks_cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "alb_dns_name" {
  value = module.alb.dns_name
}
