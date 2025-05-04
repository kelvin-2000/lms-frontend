export const adminLogin = async (email: string, password: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    },
  );

  if (!response.ok) {
    throw new Error('Admin login failed');
  }

  return response.json();
};
