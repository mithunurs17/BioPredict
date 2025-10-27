const API_BASE_URL = '';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
  method: RequestMethod;
  headers?: Record<string, string>;
  body?: any;
}

export async function apiRequest(
  method: RequestMethod,
  endpoint: string,
  data?: any
): Promise<Response> {
  const token = localStorage.getItem('token');
  
  const options: RequestOptions = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    };
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  // Ensure endpoint starts with /api if it doesn't already
  const fullEndpoint = endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`;
  console.log(`Making ${method} request to ${API_BASE_URL}${fullEndpoint}`);

  try {
    const response = await fetch(`${API_BASE_URL}${fullEndpoint}`, options);
    
    // Log response details for debugging
    console.log(`Response status: ${response.status}`);
    console.log(`Response headers:`, response.headers);

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json();
        throw new Error(error.message || 'Request failed');
      } else {
        const text = await response.text();
        console.error('Non-JSON error response:', text);
        throw new Error('Server returned an invalid response');
      }
    }

    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Convenience methods for common HTTP methods
export const api = {
  get: (endpoint: string) => apiRequest('GET', endpoint),
  post: (endpoint: string, data: any) => apiRequest('POST', endpoint, data),
  put: (endpoint: string, data: any) => apiRequest('PUT', endpoint, data),
  delete: (endpoint: string) => apiRequest('DELETE', endpoint),
}; 