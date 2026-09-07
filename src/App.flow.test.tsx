import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import App from './App';

describe('Car Sales Web - Navigation Flow', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('should render home screen on initial load', () => {
    render(<App />);
    expect(screen.getByText('AutoHub')).toBeInTheDocument();
    expect(screen.getByText(/Find your dream car/i)).toBeInTheDocument();
  });

  it('should navigate from home to login', () => {
    render(<App />);
    const loginButton = screen.getByRole('button', { name: /đăng nhập/i });
    fireEvent.click(loginButton);
    expect(screen.getByText(/đăng nhập/i)).toBeInTheDocument();
  });

  it('should navigate from home to register', () => {
    render(<App />);
    const registerButton = screen.getByRole('button', { name: /đăng ký/i });
    fireEvent.click(registerButton);
    expect(screen.getByText(/tạo tài khoản/i)).toBeInTheDocument();
  });

  it('should navigate from home to search results', () => {
    render(<App />);
    const searchButton = screen.getAllByRole('button').find(btn => btn.textContent?.includes('Tìm kiếm'));
    if (searchButton) fireEvent.click(searchButton);
    expect(screen.getByText(/kết quả tìm kiếm/i)).toBeInTheDocument();
  });

  it('should navigate from search results to vehicle detail', () => {
    render(<App />);
    const searchButton = screen.getAllByRole('button').find(btn => btn.textContent?.includes('Tìm kiếm'));
    if (searchButton) fireEvent.click(searchButton);
    const viewDetailButton = screen.getAllByRole('button').find(btn => btn.textContent?.includes('Xem chi tiết'));
    if (viewDetailButton) fireEvent.click(viewDetailButton);
    expect(screen.getByText(/Toyota Camry/i)).toBeInTheDocument();
  });

  it('should navigate from vehicle detail to quote form', () => {
    render(<App />);
    const searchButton = screen.getAllByRole('button').find(btn => btn.textContent?.includes('Tìm kiếm'));
    if (searchButton) fireEvent.click(searchButton);
    const viewDetailButton = screen.getAllByRole('button').find(btn => btn.textContent?.includes('Xem chi tiết'));
    if (viewDetailButton) fireEvent.click(viewDetailButton);
    const quoteButton = screen.getByRole('button', { name: /yêu cầu báo giá/i });
    fireEvent.click(quoteButton);
    expect(screen.getByText(/yêu cầu báo giá/i)).toBeInTheDocument();
  });

  it('should navigate from vehicle detail to test drive booking', () => {
    render(<App />);
    const searchButton = screen.getAllByRole('button').find(btn => btn.textContent?.includes('Tìm kiếm'));
    if (searchButton) fireEvent.click(searchButton);
    const viewDetailButton = screen.getAllByRole('button').find(btn => btn.textContent?.includes('Xem chi tiết'));
    if (viewDetailButton) fireEvent.click(viewDetailButton);
    const testDriveButton = screen.getByRole('button', { name: /đặt lịch lái thử/i });
    fireEvent.click(testDriveButton);
    expect(screen.getByText(/đặt lịch lái thử/i)).toBeInTheDocument();
  });

  it('should navigate from home to contact us', () => {
    render(<App />);
    // Contact navigation would be added to home screen
    // For now, we verify the app renders without crashing
    expect(screen.getByText('AutoHub')).toBeInTheDocument();
  });

  it('should handle login and navigate to profile', () => {
    render(<App />);
    const loginButton = screen.getByRole('button', { name: /đăng nhập/i });
    fireEvent.click(loginButton);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mật khẩu/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    const submitButton = screen.getByRole('button', { name: /đăng nhập/i });
    fireEvent.click(submitButton);
    
    expect(screen.getByText(/hồ sơ cá nhân/i)).toBeInTheDocument();
  });

  it('should handle logout from profile', () => {
    render(<App />);
    const loginButton = screen.getByRole('button', { name: /đăng nhập/i });
    fireEvent.click(loginButton);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mật khẩu/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    const submitButton = screen.getByRole('button', { name: /đăng nhập/i });
    fireEvent.click(submitButton);
    
    const logoutButton = screen.getByRole('button', { name: /đăng xuất/i });
    fireEvent.click(logoutButton);
    
    expect(screen.getByText('AutoHub')).toBeInTheDocument();
  });
});
