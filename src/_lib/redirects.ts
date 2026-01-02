// lib/redirects.ts

export type Redirect = {
  source: string;
  destination: string;
  permanent: boolean;
};

export const redirectsArr: Redirect[] = [
  {
    source: '/help',
    destination: '/help',
    permanent: true,
  },
  {
    source: '/about',
    destination: '/about',
    permanent: true,
  },
  {
    source: '/',
    destination: '/',
    permanent: false, 
  },
  
];