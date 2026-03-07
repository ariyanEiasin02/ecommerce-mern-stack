'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAdminAuth } from '@/context/AdminAuthContext';

const AdminLoginPage = () => {
  const router = useRouter();
  const { login } = useAdminAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = (): boolean => {
    const newErrors = { email: '', password: '' };
    let valid = true;

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email address';
      valid = false;
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await login(form.email.trim(), form.password);
      toast.success('Welcome back! Redirecting…');
      setTimeout(() => router.push('/'), 800);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Login failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-card">
        {/* Header */}
        <div className="login-card__header">
          <i className="fi fi-rr-rocket-lunch" />
          <h2>Admin Login</h2>
          <p>Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label" htmlFor="login-email">
              Email address
            </label>
            <div className="position-relative">
              <span
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: errors.email ? '#ef4444' : '#94a3b8',
                  pointerEvents: 'none',
                  display: 'flex',
                  fontSize: 16,
                }}
              >
                <i className="fi fi-rr-envelope" />
              </span>
              <input
                id="login-email"
                name="email"
                type="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                autoComplete="email"
                disabled={loading}
                style={{
                  paddingLeft: 42,
                  borderColor: errors.email ? '#ef4444' : undefined,
                  boxShadow: errors.email
                    ? '0 0 0 3px rgba(239,68,68,0.1)'
                    : undefined,
                }}
              />
            </div>
            {errors.email && (
              <p
                style={{
                  marginTop: 6,
                  fontSize: 12,
                  color: '#ef4444',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <i className="fi fi-rr-exclamation" style={{ fontSize: 12 }} />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="form-label" htmlFor="login-password">
              Password
            </label>
            <div className="position-relative">
              <span
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: errors.password ? '#ef4444' : '#94a3b8',
                  pointerEvents: 'none',
                  display: 'flex',
                  fontSize: 16,
                }}
              >
                <i className="fi fi-rr-lock" />
              </span>
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={loading}
                style={{
                  paddingLeft: 42,
                  paddingRight: 44,
                  borderColor: errors.password ? '#ef4444' : undefined,
                  boxShadow: errors.password
                    ? '0 0 0 3px rgba(239,68,68,0.1)'
                    : undefined,
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  display: 'flex',
                  fontSize: 17,
                  padding: 2,
                }}
              >
                <i
                  className={showPassword ? 'fi fi-rr-eye-crossed' : 'fi fi-rr-eye'}
                />
              </button>
            </div>
            {errors.password && (
              <p
                style={{
                  marginTop: 6,
                  fontSize: 12,
                  color: '#ef4444',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <i className="fi fi-rr-exclamation" style={{ fontSize: 12 }} />
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />
                Signing in…
              </>
            ) : (
              <>
                <i className="fi fi-rr-sign-in-alt me-2" />
                Sign In
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;

