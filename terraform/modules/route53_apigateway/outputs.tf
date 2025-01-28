output "frontend_dns" {
  value = aws_route53_record.frontend.fqdn
}

output "backend_dns" {
  value = aws_route53_record.backend.fqdn
}

output "api_gateway_endpoint" {
  value = aws_api_gateway_stage.prod.invoke_url
}

output "zone_id" {
  value = aws_lb.application.zone_id
}

output "dns_name" {
  value = aws_lb.application.dns_name
}
