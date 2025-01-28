output "frontend_dns" {
  description = "The frontend DNS record FQDN"
  value       = aws_route53_record.frontend.fqdn
}

output "backend_dns" {
  description = "The backend DNS record FQDN"
  value       = aws_route53_record.backend.fqdn
}

output "api_gateway_endpoint" {
  description = "The API Gateway endpoint URL"
  value       = aws_api_gateway_stage.prod.invoke_url
}
