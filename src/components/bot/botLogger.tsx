// 'use client';

// import { useState, useEffect } from 'react';
// import { redirectsArr } from '@/_lib/redirects';

// const BOT_REGEX =
//     /(googlebot|bingbot|slurp|screaming|duckduckbot|baiduspider|yandexbot|semrushbot|ahrefsbot|petalbot|facebookexternalhit|twitterbot|linkedinbot|applebot|bytespider|sogou|mj12bot|dotbot|gptbot|chatgpt-user|anthropic|claude|perplexitybot|ccbot)/i;

// const firedKeys = new Set<string>();

// export const BotLogger = () => {
//     const [alreadySent, setAlreadySent] = useState<boolean>(false);

//     useEffect(() => {
//         const userAgent = navigator.userAgent;
//         const isNotFound = document.getElementById('NotFoundID');
//         if (BOT_REGEX.test(userAgent) && !alreadySent && !isNotFound) {
//             const referrer = document.referrer;
//             const pathname = window.location.pathname;
//             const fullUrl = window.location.href;
//             const onceKey = userAgent + pathname + String(new Date());
//             if (firedKeys.has(onceKey)) {
//                 return;
//             }
//             firedKeys.add(onceKey);

//             let matched: boolean = false;
//             let permRedirect: boolean | null = null;

//             let sourceURL: string | null = null;

//             for (const redirectPattern of redirectsArr) {
//                 if (pathname === redirectPattern.destination) {
//                     sourceURL = redirectPattern.source;
//                     matched = true;
//                     permRedirect = redirectPattern.permanent;
//                     console.log('matched!: ', permRedirect);
//                 }
//             }

//             const statusCode = matched ? (permRedirect ? 301 : 302) : 200;

//             setAlreadySent(true);
//             fetch('/api/bot-log', {
//                 method: 'POST',
//                 body: JSON.stringify({
//                     statusCode: statusCode,
//                     sourceURL: sourceURL,
//                 }),
//                 headers: {
//                     'x-original-page-url': fullUrl,
//                     'x-client-user-agent': userAgent,
//                 },
//             }).catch(() => {});
//         }
//     }, []);

//     return null;
// };