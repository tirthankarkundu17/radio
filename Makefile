# ==============================================================================
# NeuroWave AI Radio - Makefile
# ==============================================================================

.PHONY: help install dev build clean deploy deploy-prod status

help:
	@echo "Available commands:"
	@echo "  make dev          - Run development server (localhost:3000)"
	@echo "  make build        - Run production build and type checking"
	@echo "  make deploy       - Deploy preview build to Vercel"
	@echo "  make deploy-prod  - Deploy directly to Vercel Production (--prod)"
	@echo "  make clean        - Clear .next build artifacts and cache"

install:
	npm install

dev:
	npm run dev

build:
	npm run build

clean:
	@if exist .next rmdir /s /q .next 2>nul || rm -rf .next 2>/dev/null || true

deploy: build
	npx vercel

deploy-prod: build
	npx vercel --prod
