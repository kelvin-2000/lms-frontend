export const adminLogin = async (email: string, password: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log('Admin login API response:', data);

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Admin login failed');
    }

    // Ensure we return the expected structure
    return {
      success: data.success,
      message: data.message,
      data: data.data,
      // For backwards compatibility
      token: data.data?.access_token,
      user: data.data?.user,
    };
  } catch (error) {
    console.error('Admin login error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Admin login failed');
  }
};
