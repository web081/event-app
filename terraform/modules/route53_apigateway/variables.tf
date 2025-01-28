variable "domain_name" {
  description = "The root domain name "
}

variable "frontend_subdomain" {
  description = "Subdomain for React.js frontend"
}

variable "backend_subdomain" {
  description = "Subdomain for Node.js backend API"
}

variable "backend_service_url" {
  description = "The backend service URL (e.g., http://nodejs-backend-service:3000)"
}

variable "vpc_id" {
  description = "VPC ID where resources are deployed"
}

variable "alb_dns_name" {
  description = "The DNS name of the Application Load Balancer"
}

variable "alb_zone_id" {
  description = "The Zone ID of the Application Load Balancer"
}
