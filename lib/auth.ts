import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-key'
);

export interface TokenPayload {
  userId: number;
  email: string;
  role: string;
  can_view_dashboard?: boolean;
  can_view_blogs?: boolean;
  can_view_messages?: boolean;
  can_view_qa?: boolean;
  can_view_external_articles?: boolean;
  can_view_home_content?: boolean;
  can_view_appointments?: boolean;
  can_view_admins?: boolean;
  can_view_settings?: boolean;
}

export async function generateToken(payload: TokenPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    console.log('✅ Token verified successfully:', { userId: payload.userId, email: payload.email });
    return payload as TokenPayload;
  } catch (error: any) {
    console.error('❌ Token verification failed:', error.message);
    return null;
  }
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');
  return token?.value || null;
}

export async function getCurrentUser(): Promise<TokenPayload | null> {
  const token = await getAuthToken();
  if (!token) return null;
  return await verifyToken(token);
}
