import { ENUM_SOCIALS } from "./enums";
export interface SocialProps {
  name: ENUM_SOCIALS;
  url: string;
  icon: ImageProps;
  Social: {
    Facebook: string | null;
    Instagram: string | null;
    Linkedin: string | null;
  };
}
export interface ForgotPasswordProps extends BackendError {
  forgotPassword: string;
  description: string;
}
export interface CreateAccountProps extends BackendError {
  CreateAccount: string;
  description: string;
}
export interface SignUpPageProps extends BackendError {
  SingUp: string;
  description: string;
}
export interface BackendError {
  error?: undefined;
}
export interface VideoPlayButtonSVGProps {
  circleColor?: string;
  pathColor?: string;
  size?: string | number;
  className?: string;
  onClick?: () => void;
  videoUrl?: string;
}
export interface DiagonalArrowSVGProps {
  className: string;
  size?: string | number;
  color: string;
}

export interface ImageProps {
  url?: string;
  icon?: string | null;
}

export interface VideoPlayButtonSVGProps {
  circleColor?: string;
  pathColor?: string;
  size?: string | number;
  className?: string;
  onClick?: () => void;
  videoUrl?: string;
}
export interface DiagonalArrowSVGProps {
  className: string;
  size?: string | number;
  color: string;
}
export interface CreateAccountProps extends BackendError {
  CreateAccount: string;
  description: string;
}
export interface ForgotPasswordProps extends BackendError {
  forgotPassword: string;
  description: string;
}
export interface SignUpPageProps extends BackendError {
  SingUp: string;
  description: string;
}
export interface ContactPageProps {
  Contact: {
    Telephone: string;
    Email: string;
  };
}
export type CategoryPageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export interface MetadataProps {
  MetaTitle?: string;
  MetaDescription?: string;
  canonical?: string;
  OpenGraphImageUrl?: string;
  robots?: { index?: boolean; follow?: boolean };
  other?: Record<string, string>;
  alternates?: Record<string, string>;
  product?: {
    price?: string;
    availability?: string;
    brand?: string;
  };
}

 export interface ProductMetadataProps extends MetadataProps {
  name: string;
  description?: string;
  slug: string;
  imageUrl?: string;
  price?: number;
  currency?: string;
  inStock?: boolean;
}