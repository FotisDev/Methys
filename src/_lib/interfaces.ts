import { ENUM_SOCIALS } from "./enums"
export interface SocialProps {
    name: ENUM_SOCIALS,
    url: string,
    icon: ImageProps,
    Social: {
        Facebook: string | null
        Instagram: string | null
        Linkedin: string | null
    }

}
export interface ReviewProps extends BackendError {
    id: number,
    slug: string,
    comment: string,
    name: string,
    rating: number,
    image?: {
        url: string
    }
}
export interface SearchInputProps {
    selectedRatings: number[];
    toggleRating: (rating: number) => void;
}

export interface MetadataProps {
    MetaTitle: string,
    MetaDescription: string,
    OpenGraphImageUrl: string,
    canonical: string,
}
export interface ForgotPasswordProps extends BackendError {
    forgotPassword: string,
    description: string
}
export interface CreateAccountProps extends BackendError {
    CreateAccount: string,
    description: string
}
export interface SignUpPageProps extends BackendError {
    SingUp: string,
    description: string,
}
export interface BackendError {
    error?: undefined
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
export interface ClassNameProps {
    className?: string
}
export interface RegionProps {
    Name: string
}
export interface ImageProps {
  url?: string;
  icon?: string | null; 
}
export interface ClassNameProps {
    className?: string
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
    CreateAccount: string,
    description: string
}
export interface ForgotPasswordProps extends BackendError {
    forgotPassword: string,
    description: string
}
export interface SignUpPageProps extends BackendError {
    SingUp: string,
    description: string,

}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image_url: string;
  created_at: string;
  categories: {
    id: string;
    category_name: string;
    image_url: string;
  }[];
  users: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    telephone: string;
    birthday: string;
  }[];
}


export interface CategoryBackendType {
  id: number;
  category_name: string;
  parent_id?: number;
  image_url?: string | undefined; // optional now
}


export interface ContactPageProps {
    Contact: {
        Telephone: string
        Email: string
    }
}
export interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}
