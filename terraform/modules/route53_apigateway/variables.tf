variable "domain_name" {
  description = "The root domain name"
  type        = string
}

variable "frontend_subdomain" {
  description = "Subdomain for React.js frontend"
  type        = string
}

variable "backend_subdomain" {
  description = "Subdomain for Node.js backend API"
  type        = string
}

variable "backend_service_url" {
  description = "The backend service URL (e.g., http://nodejs-backend-service:3000)"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID where resources are deployed"
  type        = string
}

variable "alb_dns_name" {
  description = "The DNS name of the Application Load Balancer"
  type        = string
}

variable "alb_zone_id" {
  description = "The Zone ID of the Application Load Balancer"
  type        = string
}

variable "route53_zone_id" {
  description = "The ID of the Route53 zone"
  type        = string
}
