#!/bin/bash

# E-Commerce Product Details - Quick Setup Script
# This script helps you verify that all files are in place

echo "╔════════════════════════════════════════════════════╗"
echo "║  E-Commerce Product Details - Setup Verification  ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""

# Check if we're in the right directory
if [ ! -d "ecommerce-frontend" ]; then
  echo "❌ Error: Please run this script from the project root directory"
  exit 1
fi

echo "✅ Project root directory found"
echo ""

# Check for required files
echo "Checking component files..."

files=(
  "ecommerce-frontend/types/product.ts"
  "ecommerce-frontend/components/productDetails/ProductBanner.tsx"
  "ecommerce-frontend/components/productDetails/ProductImage.tsx"
  "ecommerce-frontend/components/productDetails/ProductContent.tsx"
  "ecommerce-frontend/components/productDetails/ProductTabs.tsx"
  "ecommerce-frontend/components/productDetails/RelatedProducts.tsx"
  "ecommerce-frontend/app/product/[slug]/page.tsx"
  "ecommerce-frontend/styles/_productDetails.scss"
)

all_exist=true
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file (missing)"
    all_exist=false
  fi
done

echo ""

if [ "$all_exist" = true ]; then
  echo "✅ All component files are in place!"
else
  echo "❌ Some files are missing. Please check the installation."
  exit 1
fi

echo ""
echo "╔════════════════════════════════════════════════════╗"
echo "║              Next Steps                            ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""
echo "1. Navigate to the frontend directory:"
echo "   cd ecommerce-frontend"
echo ""
echo "2. Install dependencies (if not already done):"
echo "   npm install"
echo ""
echo "3. Run the development server:"
echo "   npm run dev"
echo ""
echo "4. Open your browser and visit:"
echo "   http://localhost:3000/product/[any-slug]"
echo ""
echo "5. Replace mock data with your API:"
echo "   Edit app/product/[slug]/page.tsx"
echo "   Update getProduct() and getRelatedProducts() functions"
echo ""
echo "╔════════════════════════════════════════════════════╗"
echo "║           Setup Complete! 🎉                       ║"
echo "╚════════════════════════════════════════════════════╝"
