'use client';

import React, { useState } from 'react';
import { Product, ProductReview, ProductSpecification } from '@/types/product';

interface ProductTabsProps {
  product: Product;
}

const ProductTabs: React.FC<ProductTabsProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <i
        key={index}
        className={index < Math.floor(rating) ? 'fi fi-ss-star' : 'fi fi-rr-star'}
      ></i>
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="product-tabs">
      {/* Tab Navigation */}
      <ul className="nav nav-tabs product-tabs__nav" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link product-tabs__nav-link ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
            type="button"
            role="tab"
            aria-selected={activeTab === 'description'}
          >
            Description
          </button>
        </li>
        
        {product.specifications && product.specifications.length > 0 && (
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link product-tabs__nav-link ${activeTab === 'specifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('specifications')}
              type="button"
              role="tab"
              aria-selected={activeTab === 'specifications'}
            >
              Specifications
            </button>
          </li>
        )}
        
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link product-tabs__nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
            type="button"
            role="tab"
            aria-selected={activeTab === 'reviews'}
          >
            Reviews ({product.reviewCount})
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content product-tabs__content">
        {/* Description Tab */}
        {activeTab === 'description' && (
          <div className="product-tabs__pane product-tabs__pane--description">
            <div className="product-tabs__description">
              <h3 className="product-tabs__section-title">Product Description</h3>
              <div 
                className="product-tabs__description-text"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
              
              {/* Key Features */}
              {product.specifications && product.specifications.length > 0 && (
                <div className="product-tabs__key-features mt-4">
                  <h4 className="product-tabs__subtitle">Key Features</h4>
                  <ul className="product-tabs__features-list">
                    {product.specifications.slice(0, 5).map((spec: ProductSpecification, index: number) => (
                      <li key={index} className="product-tabs__feature-item">
                      <i className="fi fi-rr-check product-tabs__feature-icon"></i>
                        <strong>{spec.label}:</strong> {spec.value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Specifications Tab */}
        {activeTab === 'specifications' && product.specifications && (
          <div className="product-tabs__pane product-tabs__pane--specifications">
            <h3 className="product-tabs__section-title">Technical Specifications</h3>
            <div className="table-responsive">
              <table className="table table-striped product-tabs__specs-table">
                <tbody>
                  {product.specifications.map((spec: ProductSpecification, index: number) => (
                    <tr key={index}>
                      <td className="product-tabs__spec-label">{spec.label}</td>
                      <td className="product-tabs__spec-value">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="product-tabs__pane product-tabs__pane--reviews">
            <div className="product-tabs__reviews">
              {/* Reviews Summary */}
              <div className="product-tabs__reviews-summary">
                <div className="product-tabs__rating-overview">
                  <div className="product-tabs__rating-score">
                    <span className="product-tabs__rating-number">{product.rating.toFixed(1)}</span>
                    <div className="product-tabs__rating-stars">
                      {renderStars(product.rating)}
                    </div>
                    <p className="product-tabs__rating-text">
                      Based on {product.reviewCount} reviews
                    </p>
                  </div>
                  
                  {/* Rating Distribution */}
                  <div className="product-tabs__rating-distribution">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const percentage = Math.floor(Math.random() * 100); // Mock data
                      return (
                        <div key={stars} className="product-tabs__rating-bar">
                          <span className="product-tabs__rating-bar-label">{stars} stars</span>
                          <div className="progress product-tabs__progress">
                            <div 
                              className="progress-bar bg-warning" 
                              style={{ width: `${percentage}%` }}
                              role="progressbar"
                              aria-valuenow={percentage}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            />
                          </div>
                          <span className="product-tabs__rating-bar-count">{percentage}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="product-tabs__reviews-list">
                <h4 className="product-tabs__subtitle">Customer Reviews</h4>
                
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((review: ProductReview) => (
                    <div key={review.id} className="product-tabs__review-item">
                      <div className="product-tabs__review-header">
                        <div className="product-tabs__reviewer">
                          <div className="product-tabs__reviewer-avatar">
                            {review.userAvatar ? (
                              <img src={review.userAvatar} alt={review.userName} />
                            ) : (
                              <span>{review.userName.charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                          <div className="product-tabs__reviewer-info">
                            <h5 className="product-tabs__reviewer-name">
                              {review.userName}
                              {review.verified && (
                                <span className="badge bg-success ms-2">
                                  <i className="fi fi-rr-check"></i> Verified Purchase
                                </span>
                              )}
                            </h5>
                            <div className="product-tabs__review-meta">
                              <div className="product-tabs__review-stars">
                                {renderStars(review.rating)}
                              </div>
                              <span className="product-tabs__review-date">
                                {formatDate(review.date)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="product-tabs__review-content">
                        {review.title && (
                          <h6 className="product-tabs__review-title">{review.title}</h6>
                        )}
                        <p className="product-tabs__review-text">{review.comment}</p>
                        
                        {review.images && review.images.length > 0 && (
                          <div className="product-tabs__review-images">
                            {review.images.map((image, index) => (
                              <img 
                                key={index}
                                src={image} 
                                alt={`Review image ${index + 1}`}
                                className="product-tabs__review-image"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="product-tabs__review-footer">
                        <button className="btn btn-sm btn-outline-secondary product-tabs__helpful-btn">
                          <i className="fi fi-rr-thumbs-up me-1"></i>
                          Helpful ({review.helpful})
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="product-tabs__no-reviews">
                    <p className="text-muted">No reviews yet. Be the first to review this product!</p>
                    <button className="btn btn-primary mt-3">Write a Review</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
