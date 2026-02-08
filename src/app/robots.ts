import { MetadataRoute } from 'next'



export default function robots():MetadataRoute.Robots {
    const isLive = process.env.NEXT_PUBLIC_IS_LIVE_SITE === 'true';

    return {
        rules:{
            userAgent:'*',
            allow: isLive ? '/' : undefined,
            disallow: isLive? undefined :'/',

        },
        sitemap:`${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
    }
}