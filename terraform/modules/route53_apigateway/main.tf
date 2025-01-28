# Route 53 DNS Zone
#resource "aws_route53_zone" "main" {
#  name = var.domain_name
# }

# Subdomain Record for Frontend
resource "aws_route53_record" "frontend" {
  zone_id = var.route53_zone_id
  name    = var.frontend_subdomain
  type    = "A"
  alias {
    name                   = var.alb_dns_name
    zone_id                = var.alb_zone_id
    evaluate_target_health = true
  }
}


# API Gateway (Backend)
resource "aws_route53_record" "backend" {
  zone_id = aws_route53_zone_id
  name    = var.backend_subdomain
  type    = "CNAME"
  ttl     = 60
  records = [aws_api_gateway_rest_api.backend.id]
}

# API Gateway
resource "aws_api_gateway_rest_api" "backend" {
  name        = "NodeJSBackendAPI"
  description = "API Gateway for Node.js backend"
}

# API Gateway Resource
resource "aws_api_gateway_resource" "root" {
  rest_api_id = aws_api_gateway_rest_api.backend.id
  parent_id   = aws_api_gateway_rest_api.backend.root_resource_id
  path_part   = "{proxy+}"
}

# API Gateway Method
resource "aws_api_gateway_method" "proxy" {
  rest_api_id   = aws_api_gateway_rest_api.backend.id
  resource_id   = aws_api_gateway_resource.root.id
  http_method   = "ANY"
  authorization = "NONE"
}

# API Gateway Integration
resource "aws_api_gateway_integration" "proxy" {
  rest_api_id = aws_api_gateway_rest_api.backend.id
  resource_id = aws_api_gateway_resource.root.id
  http_method = aws_api_gateway_method.proxy.http_method
  integration_http_method = "ANY"
  type                    = "HTTP_PROXY"
  uri                     = var.backend_service_url
}

# Deploy the API Gateway
resource "aws_api_gateway_deployment" "backend" {
  rest_api_id = aws_api_gateway_rest_api.backend.id
  depends_on  = [aws_api_gateway_integration.proxy]

  lifecycle {
    create_before_destroy = true
  }
}

# API Gateway Stage
resource "aws_api_gateway_stage" "prod" {
  deployment_id = aws_api_gateway_deployment.backend.id
  rest_api_id   = aws_api_gateway_rest_api.backend.id
  stage_name    = "prod"
}
