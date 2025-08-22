import { ENUM_SOCIALS } from "./enums"
import { MenuOption } from "./types"



export interface MetaDataProps {
    SEO: {
        MetaTitle: string
        MetaDescription: string
        OpenGraphImage: {
            url: string
        }
    }
}
export interface CategoryCardProps {
    title: string,
    url: string,
    imageUrl: string
}
export interface MenuProps {
    title: string,
    menu_options: MenuOption[]
}
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
export interface CardProps {
    Cards: {
        Text: string
        Icon: {
            url: string
        }
    }[]
}
export interface MenuProps {
    Title: string
    pages: {
        Title: string, Slug: string
    }[]
}
export interface HomePageProps {
    data: {
        attributes: {
            Hero: {
                Title: string;
                Subtitle: string;
                Image: {
                    data: {
                        attributes: {
                            url: string
                            alternativeText: string | null
                        }
                    }
                }
            }
        }
    }
}
export interface HomePosts {
    Title: string
    slug: string
    publishedAt: string
    Listing: {
        Title: string
        Image: {
            url: string
        }
    }
    blog_categories: {
        name: string
        slug: string
    }[]
}
export interface CategoryDataProps {
    name: string,
    slug: string
    Content: string
    SEO: {
        MetaTitle: string
        MetaDescription: string
        OpenGraphImage: null | { url: string }
        Schemas: {
            Markup: string
        }[]
    }
    image: {
        url: string
    }
    posts: {
        Title: string
        slug: string
        readingTime: number
        publishedAt: string
        Listing: {
            Title: string
            Content: string
            Image: {
                url: string
            }
        }
        blog_categories: {
            name: string
            slug: string
        }[]
    }[]
    top_posts: {
        title: string;
        subtitle: string;
        posts: {
            Title: string;
            slug: string;
            publishedAt: string;
            blog_categories: {
                name: string;
                slug: string;
            }[];
            Listing: {
                Title: string;
                Image: { url: string }
            };
        }[]
    }
}
export interface PostDataProps {
    Title: string,
    slug: string,
    readingTime: number,
    tags: {
        name: string
    }[]
    Heading: {
        Title: string,
        Subtitle: string,
        Image: {
            url: string
        }
    }
    Listing: {
        Title: string
        Content: string
        Image: {
            url: string
        }
    }
    Content: {
        '__component': 'blog.text' | 'blog.media'
        Title?: null
        Content?: string
        CTA?: null | {
            Text: string
            URL: string
            NewWindow: boolean
        }
        Images?: null | {
            url: string
        }[]
    }[]
    Related: null | {
        Title: string | null
        posts: {
            slug: string
            Title: string
            publishedAt: string
            Listing: {
                Title: string
                Content: string
                Image: {
                    url: string
                }
            }
        }[]
    }
    blog_categories: {
        name: string
        slug: string
    }[]
    destination_city: {
        Name: string,
        PriceFrom: number
        Currency: {
            Code: string,
        },
    }
    publishedAt: string
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
export interface ReviewPageProps {
    title: string,
    description: string,
    reviews: ReviewProps[]

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
  icon?: string | null;  // πχ string URL ή null
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

export interface Category {
  id: number;
  category_name: string;
  parent_id?: number;
  image_url?: string; // optional now
}


export interface ContactPageProps {
    Contact: {
        Telephone: string
        Email: string
    }
}

