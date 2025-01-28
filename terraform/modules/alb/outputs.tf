output "dns_name" {
  value = aws_lb.application.dns_name
}

output "zone_id" {
  value = aws_lb.application.zone_id
}
