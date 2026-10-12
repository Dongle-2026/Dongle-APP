export interface OAuthLoginRequest {
  idToken: string;
  nonce?: string;
}
export interface AuthTokensResponse {
  accessToken: string;
  refreshToken: string;
  nickname: string;
}
export interface OAuthLoginResponse extends AuthTokensResponse {
  newUser: boolean;
}
export interface EmailLoginRequest {
  email: string;
  password: string;
}
export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  nickname: string;
}
