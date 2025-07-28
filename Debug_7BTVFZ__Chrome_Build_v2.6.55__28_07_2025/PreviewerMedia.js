 



// ============ модуль PreviewerMedia.js  =============== //
//  ======== код (content.js) относится к контент-скрипту, потому что ============ // 

(function() {
    'use strict';
    // Инициализация глобальной переменной для исключенных доменов 
    const excludedDomains = new Set(['jiggie.fun']); // Начальный список исключений
    
    const urlCache = new Map();

    // Поддерживаемые типы файлов
   const fileTypes = {
    image: ['.png', '.jpg', '.jpeg', '.JPEG',  '.gif', '.webp', '.avif'],
    video: ['.mp4', '.webm', '.mov'] // Добавляем .mov, если нужно
};


    // Поддерживаемые платформы эмодзи и изображений
    const emotePlatforms = {
  '7tv.app': (url) => {
            const emoteIdMatch = url.match(/7tv\.app\/emotes\/([a-zA-Z0-9]+)/);
            return emoteIdMatch ? `https://cdn.7tv.app/emote/${emoteIdMatch[1]}/2x.webp` : url;
        },
  'frankerfacez.com': (url) => {
            const emoteIdMatch = url.match(/frankerfacez\.com\/emoticon\/(\d+)/);
            return emoteIdMatch ? `https://cdn.frankerfacez.com/emoticon/${emoteIdMatch[1]}/2` : url;
        },
  'betterttv.com': (url) => {
            const emoteIdMatch = url.match(/betterttv\.com\/emotes\/([a-zA-Z0-9]+)/);
            return emoteIdMatch ? `https://cdn.betterttv.net/emote/${emoteIdMatch[1]}/2x` : url;
        },
  'imgur.com': (url) => {
            const albumMatch = url.match(/imgur\.com\/a\/([a-zA-Z0-9]+)/);
            const imageMatch = url.match(/imgur\.com\/([a-zA-Z0-9]+)$/);
            if (albumMatch) return `https://i.imgur.com/${albumMatch[1]}.jpg`;
            if (imageMatch) return `https://i.imgur.com/${imageMatch[1]}.jpg`;
            return url;
        },

 'kappalol.fun': async (url) => {
    const albumMatch = url.match(/kappalol\.fun\/a\/([a-zA-Z0-9]+)/);
    const imageMatch = url.match(/kappalol\.fun\/([a-zA-Z0-9]+)\.(png|jpg|jpeg|gif|webp|avif)$/i);
    const videoMatch = url.match(/kappalol\.fun\/([a-zA-Z0-9]+)\.(mp4|webm)$/i);
    const shortIdMatch = url.match(/kappalol\.fun\/([a-zA-Z0-9]+)(\?.*)?$/);

    if (videoMatch) return `https://kappalol.fun/${videoMatch[1]}.${videoMatch[2]}`;
    if (albumMatch) return `https://kappalol.fun/${albumMatch[1]}.jpg`;
    if (imageMatch) return `https://kappalol.fun/${imageMatch[1]}.${imageMatch[2]}`;
    if (shortIdMatch) {
        const id = shortIdMatch[1];
        const tokenMatch = url.match(/token=([a-f0-9]+)/);
        const token = tokenMatch ? tokenMatch[1] : '';
        let mediaUrl = token ? `https://kappalol.fun/?id=${id}&token=${token}` : `https://kappalol.fun/?id=${id}`;

        // Проверяем доступность с cookies
        const testResult = await testImage(mediaUrl);
        if (testResult.valid) {
            console.debug(`Valid kappalol.fun image: ${mediaUrl}`);
            return mediaUrl;
        }

        // Пробуем извлечь из страницы
        const pageMediaUrl = await extractImageFromPage(url);
        if (pageMediaUrl) {
            console.debug(`Extracted media from kappalol.fun page: ${pageMediaUrl}`);
            return pageMediaUrl;
        }

        console.debug(`No valid media found for kappalol.fun: ${url}`);
        return url;
    }
    console.debug(`No valid media found for kappalol.fun: ${url}`);
    return url;
},

'segs.lol': async (url) => {
    const albumMatch = url.match(/segs\.lol\/a\/([a-zA-Z0-9]+)/);
    const imageMatch = url.match(/segs\.lol\/([a-zA-Z0-9]+)\.(png|jpg|jpeg|gif|webp|avif)$/i);
    const videoMatch = url.match(/segs\.lol\/([a-zA-Z0-9]+)\.(mp4|webm)$/i);
    const shortIdMatch = url.match(/segs\.lol\/([a-zA-Z0-9]+)$/);

    if (videoMatch) return `https://segs.lol/${videoMatch[1]}.${videoMatch[2]}`;
    if (albumMatch) return `https://segs.lol/${albumMatch[1]}.jpg`;
    if (imageMatch) return `https://segs.lol/${imageMatch[1]}.${imageMatch[2]}`;
    if (shortIdMatch) {
        const mediaUrl = await extractImageFromPage(url);
        if (mediaUrl) return mediaUrl;
    }
    return url;
},

    'i.nuuls.com': (url) => {
            const albumMatch = url.match(/nuuls\.com\/a\/([a-zA-Z0-9]+)/);
            const imageMatch = url.match(/nuuls\.com\/([a-zA-Z0-9]+)$/);
            if (albumMatch) return `https://i.nuuls.com/${albumMatch[1]}.jpg`;
            if (imageMatch) return `https://i.nuuls.com/${imageMatch[1]}.jpg`;
            return url;
        },
    'blogger.googleusercontent.com': (url) => {
            // Проверяем, является ли URL прямой ссылкой на изображение
            const extensionMatch = url.match(/(\.[a-z0-9]+)(?:\/|$|\?)/i);
            if (extensionMatch && fileTypes.image.includes(extensionMatch[1])) {
                // Можно изменить размер, если требуется (например, заменить /s680/ на /s0/ для оригинального размера)
                const resizedUrl = url.replace(/\/s\d+\//, '/s0/');
                console.debug(`Transformed Blogger URL: ${url} -> ${resizedUrl}`);
                return resizedUrl;
            }
            return url;
        },
  'postimg.cc': async (url) => {
        const extensionMatch = url.match(/(\.[a-z0-9]+)(?:\/|$|\?)/i);
        if (extensionMatch && fileTypes.image.includes(extensionMatch[1])) {
            console.debug(`Direct image URL detected for postimg.cc: ${url}`);
            return url; // Прямая ссылка на изображение
        }
        // Если это страница, извлекаем прямую ссылку из метаданных
        console.debug(`Fetching page metadata for postimg.cc: ${url}`);
        const imageUrl = await extractImageFromPage(url);
        if (imageUrl && fileTypes.image.includes(imageUrl.match(/(\.[a-z0-9]+)(?:\/|$|\?)/i)?.[1] || '')) {
            console.debug(`Transformed postimg.cc URL: ${url} -> ${imageUrl}`);
            return imageUrl;
        }
        console.debug(`No valid image found for postimg.cc: ${url}`);
        return url; // Возвращаем исходный URL, если не удалось извлечь
    },
 'postimages.org': async (url) => {
        const extensionMatch = url.match(/(\.[a-z0-9]+)(?:\/|$|\?)/i);
        if (extensionMatch && fileTypes.image.includes(extensionMatch[1])) {
            console.debug(`Direct image URL detected for postimages.org: ${url}`);
            return url; // Прямая ссылка на изображение
        }
        // Если это страница, извлекаем прямую ссылку из метаданных
        console.debug(`Fetching page metadata for postimages.org: ${url}`);
        const imageUrl = await extractImageFromPage(url);
        if (imageUrl && fileTypes.image.includes(imageUrl.match(/(\.[a-z0-9]+)(?:\/|$|\?)/i)?.[1] || '')) {
            console.debug(`Transformed postimages.org URL: ${url} -> ${imageUrl}`);
            return imageUrl;
        }
        console.debug(`No valid image found for postimages.org: ${url}`);
        return url; // Возвращаем исходный URL, если не удалось извлечь
    },
 'static-cdn.jtvnw.net': (url) => {
        const extensionMatch = url.match(/(\.[a-z0-9]+)(?:\/|$|\?)/i);
        const extension = extensionMatch ? extensionMatch[1].toLowerCase() : '';
        if (fileTypes.image.includes(extension)) {
            console.debug(`Twitch emote URL detected: ${url}`);
            return url; // Прямая ссылка на изображение
        }
        console.debug(`Invalid Twitch emote URL: ${url}`);
        return url; // Возвращаем исходный URL, если расширение не поддерживается
    },
 'fxtwitter.com': (url) => {
            // Проверяем, является ли URL прямой ссылкой на изображение
            const extensionMatch = url.match(/(\.[a-z0-9]+)(?:\/|$|\?)/i);
            if (extensionMatch && fileTypes.image.includes(extensionMatch[1])) {
                // Можно изменить размер, если требуется (например, заменить /s680/ на /s0/ для оригинального размера)
                const resizedUrl = url.replace(/\/s\d+\//, '/s0/');
                console.debug(`Transformed fxtwitter URL: ${url} -> ${resizedUrl}`);
                return resizedUrl;
            }
            return url;
        },

  'x.com': async (url) => {
    const statusMatch = url.match(/x\.com\/[^/]+\/status\/(\d+)/);
    if (!statusMatch) {
        console.debug(`Not a valid X post URL: ${url}`);
        return url;
    }

    // Извлекаем медиа из метаданных страницы
    const mediaUrl = await extractImageFromPage(url);
    if (mediaUrl) {
        console.debug(`Extracted media from X post: ${url} -> ${mediaUrl}`);
        return mediaUrl;
    }

    console.debug(`No media found for X post: ${url}`);
    return url;
},
'youtube.com': async (url) => {
    const videoIdMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (videoIdMatch) {
        const videoId = videoIdMatch[1];
        const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`;
        const testResult = await testImage(thumbnailUrl);
        if (testResult.valid) {
            console.debug(`YouTube thumbnail available: ${thumbnailUrl}`);
            return thumbnailUrl;
        }
        // Fallback на hqdefault
        const fallbackUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
        console.debug(`Falling back to hqdefault for YouTube video: ${videoId}`);
        return fallbackUrl;
    }
    console.debug(`No valid YouTube video ID found in: ${url}`);
    return url;
},
'youtu.be': async (url) => {
    const videoIdMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-`Z0-9_-]{11})/);
    if (videoIdMatch) {
        const videoId = videoIdMatch[1];
        const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`;
        const testResult = await testImage(thumbnailUrl);
        if (testResult.valid) {
            console.debug(`YouTube thumbnail available: ${thumbnailUrl}`);
            return thumbnailUrl;
        }
        // Fallback на hqdefault
        const fallbackUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
        console.debug(`Falling back to hqdefault for YouTube video: ${videoId}`);
        return fallbackUrl;
    }
    console.debug(`No valid YouTube video ID found in: ${url}`);
    return url;
},
    };




  // ------ Определение типа файла ------- //
function getFileType(url) {
    if (!url) {
        console.debug('URL is null or undefined');
        return null;
    }
    const cleanUrl = url.split('?')[0].toLowerCase();
    const extensionMatch = cleanUrl.match(/\.([a-z0-9]+)$/i);
    const extension = extensionMatch ? `.${extensionMatch[1]}` : '';

    // Проверка на исключенные домены
    const urlObj = new URL(url);
    const domain = urlObj.hostname.toLowerCase();
    if (excludedDomains.has(domain)) {
        console.debug(`URL excluded due to domain: ${domain}`);
        return null;
    }

    console.debug(`Checking file type for URL: ${url}, extension: ${extension}`);
    if (fileTypes.image.includes(extension)) {
        console.debug(`Extension matched: ${extension} (image)`);
        return 'image';
    }
    if (fileTypes.video.includes(extension)) {
        console.debug(`Extension matched: ${extension} (video)`);
        return 'video';
    }
    if (
        url.includes('cdn.7tv.app') ||
        url.includes('7tv.app/emotes') ||
        url.includes('i.imgur.com') ||
        url.includes('kappalol.fun') ||
        url.includes('segs.lol') ||
        url.includes('yandex.net') ||
        url.includes('susanin.news') ||
        url.includes('pbs.twimg.com') ||
        url.includes('ir-5.ozone.ru') ||
        url.includes('ya.ru') ||
        url.includes('i.ytimg.com') ||
        url.includes('postimg.cc') ||
        url.includes('postimages.org') ||
        url.includes('i.postimg.cc') ||
        url.includes('i.nuuls.com') ||
        url.includes('cdn.discordapp.com') ||
        url.includes('media.discordapp.net') ||
        url.includes('tenor.com') ||
        url.includes('media.tenor.com') ||
        url.includes('blogger.googleusercontent.com') ||
        url.includes('x.com') ||
        url.includes('fxtwitter.com') ||
         url.includes('kappalol.fun') ||
        url.includes('static-cdn.jtvnw.net')
    ) {
        if (!extension) {
            console.debug(`No extension found, assuming page with media: ${url}`);
            return 'page';
        }
        if (fileTypes.video.includes(extension)) {
            console.debug(`Domain matched with video extension: ${url}`);
            return 'video';
        }
        console.debug(`Domain matched with image extension: ${url}`);
        return 'image';
    }
    if (url.includes('pbs.twimg.com') && url.match(/format=(jpg|jpeg|png|gif|webp|mp4|webm|avif)/i)) {
        const format = url.match(/format=(jpg|jpeg|png|gif|webp|mp4|webm|avif)/i)[1].toLowerCase();
        console.debug(`Twitter format matched: ${url}, format: ${format}`);
        return fileTypes.video.includes(`.${format}`) ? 'video' : 'image';
    }
    return null;
}


     // Определение типа по Content-Type
    function getFileTypeFromContentType(contentType) {
        if (!contentType) {
            console.debug('No Content-Type received');
            return null;
        }
        if (contentType.includes('image')) {
            console.debug(`Content-Type is image: ${contentType}`);
            return 'image';
        }
        if (contentType.includes('text/html')) {
            console.debug(`Content-Type is HTML: ${contentType}`);
            return 'html';
        }
        return null;
    }

    // Функция для управления списком исключений
function manageExcludedDomains(action, domain) {
    if (action === 'add') {
        excludedDomains.add(domain.toLowerCase());
        console.debug(`Domain added to exclusions: ${domain}`);
    } else if (action === 'remove') {
        excludedDomains.delete(domain.toLowerCase());
        console.debug(`Domain removed from exclusions: ${domain}`);
    } else {
        console.error(`Invalid action: ${action}. Use 'add' or 'remove'.`);
    }
    return excludedDomains;
}

// Доступ к функции через window
window.manageExcludedDomains = manageExcludedDomains;



    // Трансформация URL для эмодзи и Imgur
   async function transformEmoteUrl(url) {
    for (const [platform, transformer] of Object.entries(emotePlatforms)) {
        if (url.includes(platform)) {
            const transformed = await transformer(url); // Добавляем await
            console.debug(`Transformed URL: ${url} -> ${transformed}`);
            return transformed;
        }
    }
    return url;
}



       // Извлечение изображения из метаданных страницы
async function extractImageFromPage(url) {
    try {
        // Прокси не поддерживает cookies, поэтому пробуем прямой запрос
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include', // Включаем cookies
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; PreWatcher/1.2.4)',
                'Accept': 'text/html'
            }
        });
        if (!response.ok) {
            console.debug(`Failed to fetch page: ${url}, status: ${response.status}`);
            // Fallback на прокси
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
            const proxyResponse = await fetch(proxyUrl, {
                headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PreWatcher/1.2.4)' }
            });
            if (!proxyResponse.ok) {
                console.debug(`Proxy fetch failed: ${url}, status: ${proxyResponse.status}`);
                return null;
            }
            const text = await proxyResponse.text();
            const doc = new DOMParser().parseFromString(text, 'text/html');
            return extractMediaFromDoc(doc, url);
        }

        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, 'text/html');
        const mediaUrl = extractMediaFromDoc(doc, url);
        if (mediaUrl) {
            // Добавляем токен из исходного URL
            const tokenMatch = url.match(/token=([a-f0-9]+)/);
            if (tokenMatch && !mediaUrl.includes('token=')) {
                mediaUrl += (mediaUrl.includes('?') ? '&' : '?') + `token=${tokenMatch[1]}`;
            }
            const testResult = await testImage(mediaUrl);
            if (testResult.valid) {
                console.debug(`Extracted valid media from page: ${url} -> ${mediaUrl}`);
                return mediaUrl;
            }
        }
        console.debug(`No valid media URL found for: ${url}`);
        return null;
    } catch (error) {
        console.error(`Error fetching page metadata for ${url}:`, error.message);
        return null;
    }
}

function extractMediaFromDoc(doc, url) {
    let mediaUrl = doc.querySelector('meta[property="og:image"]')?.content ||
                   doc.querySelector('meta[name="twitter:image"]')?.content ||
                   doc.querySelector('.image-preview img[src]')?.getAttribute('src') ||
                   doc.querySelector('img[src]')?.getAttribute('src');
    if (mediaUrl && !mediaUrl.startsWith('http')) {
        mediaUrl = new URL(mediaUrl, url).href;
    }
    return mediaUrl;
}

    // Разрешение коротких URL и Imgur альбомов
    async function resolveShortUrl(url) {
        if (urlCache.has(url)) {
            console.debug(`Using cached URL: ${url}`);
            return urlCache.get(url);
        }

        try {
            const response = await fetch(url, {
                method: 'HEAD',
                headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PreWatcher/1.2.4)' }
            });
            const finalUrl = response.url || url;
            const contentType = response.headers.get('content-type');
            const result = { resolvedUrl: finalUrl, contentType };
            urlCache.set(url, result);
            console.debug(`Resolved URL: ${url} -> ${finalUrl}, Content-Type: ${contentType}`);
            return result;
        } catch (error) {
            console.error(`Error resolving URL ${url}:`, error);
         // Проверяем, является ли URL изображением напрямую
            const fileType = getFileType(url);
            if (fileType === 'image') {
                const result = { resolvedUrl: url, contentType: 'image' };
                urlCache.set(url, result);
                return result;
            }
            // Пробуем извлечь изображение из метаданных страницы
            const imageUrl = await extractImageFromPage(url);
            const result = { resolvedUrl: imageUrl || url, contentType: imageUrl ? 'image' : null };
            urlCache.set(url, result);
            return result;
        }
    }

    // Извлечение прямой ссылки на изображение из Imgur
    async function extractImgurImage(url) {
        if (!url.includes('imgur.com/a/')) {
            console.debug(`Not an Imgur album: ${url}`);
            return url;
        }
        try {
            const response = await fetch(url);
            const text = await response.text();
            const doc = new DOMParser().parseFromString(text, 'text/html');
            const img = doc.querySelector('img[src*="i.imgur.com"]');
            const directUrl = img ? img.getAttribute('src') : url;
            console.debug(`Extracted Imgur image: ${url} -> ${directUrl}`);
            return directUrl;
        } catch (error) {
            console.error(`Imgur extraction error for ${url}:`, error);
            return url;
        }
    }

    // Проверка доступности изображения и получение размеров
  async function testImage(url) {
    try {
        const img = new Image();
        img.src = url;
        await new Promise((resolve, reject) => {
            img.onload = () => resolve({ valid: true, width: img.width, height: img.height });
            img.onerror = () => reject(new Error(`Image load failed: ${url}`));
        });
        console.debug(`Image test successful: ${url}`);
        return { valid: true, width: img.width, height: img.height };
    } catch (error) {
        console.debug(`Image test failed: ${url}, error: ${error.message}`);
        // Пробуем запрос с cookies через fetch
        try {
            const response = await fetch(url, {
                method: 'HEAD',
                credentials: 'include', // Включаем cookies
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; PreWatcher/1.2.4)'
                }
            });
            if (response.ok && response.headers.get('content-type')?.includes('image')) {
                console.debug(`Image test with cookies successful: ${url}`);
                return { valid: true, width: 0, height: 0 }; // Размеры можно получить позже
            }
            console.debug(`Image test with cookies failed: ${url}, status: ${response.status}`);
            return { valid: false };
        } catch (fetchError) {
            console.debug(`Image test with cookies failed: ${url}, error: ${fetchError.message}`);
            return { valid: false };
        }
    }
}


  // Обработка ссылок
   async function processLinks() {
    const chatContainer = document.querySelector('.chat-scrollable-area__message-container');
    if (!chatContainer) {
        console.debug('Chat container not found');
        return;
    }

    const messages = chatContainer.querySelectorAll('.chat-line__message');
    for (const message of messages) {
        const links = message.querySelectorAll('a[href]:not([data-processed]), a.ffz-tooltip.link-fragment:not([data-processed])');
        if (links.length > 0) {
            for (const link of links) {
                await replaceLinkWithMedia(link);
            }
            message.dataset.processed = 'true';
        }
    }
}
    
   // Замена ссылки на изображение с сохранением URL и адаптивным размером
async function replaceLinkWithMedia(link) {
    let url = link.getAttribute('href');

    // Проверка исключённых доменов
    try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname.toLowerCase();
        if (excludedDomains.has(domain)) {
            console.debug(`Skipping URL due to excluded domain: ${url} (${domain})`);
            link.dataset.processed = 'true';
            return;
        }
    } catch (error) {
        console.debug(`Invalid URL format, skipping: ${url}`);
        return;
    }

    let fileType = getFileType(url);
    let mediaUrl = url;

    console.debug(`Processing link: ${url}`);

    if (!fileType || url.match(/t\.co|bit\.ly|imgur\.com|pbs.twimg.com/) || fileType === 'page') {
        mediaUrl = await transformEmoteUrl(url);
        fileType = mediaUrl ? getFileType(mediaUrl) : null;
        if (!fileType || fileType === 'page') {
            const { resolvedUrl, contentType } = await resolveShortUrl(url);
            mediaUrl = resolvedUrl;
            fileType = mediaUrl ? getFileType(mediaUrl) || getFileTypeFromContentType(contentType) : null;
            console.debug(`After resolve: ${mediaUrl}, fileType: ${fileType}`);
        }
    }

    if (mediaUrl && mediaUrl.includes('imgur.com/a/')) {
        mediaUrl = await extractImgurImage(mediaUrl);
        fileType = mediaUrl ? getFileType(mediaUrl) : null;
        console.debug(`After Imgur extraction: ${mediaUrl}`);
    }

    if (fileType === 'page' && mediaUrl) {
        mediaUrl = await extractImageFromPage(url);
        fileType = mediaUrl ? getFileType(mediaUrl) : null;
        console.debug(`After page extraction: ${mediaUrl}, fileType: ${fileType}`);
    }

    if (!fileType || !mediaUrl) {
        const testResult = await testImage(url);
        if (testResult.valid) {
            mediaUrl = url;
            fileType = 'image';
            console.debug(`Fallback: Using original URL as image: ${url}`);
        } else {
            console.debug(`Skipping non-media URL: ${url}`);
            return;
        }
    }

    const mediaInfo = fileType === 'video' ? await testVideo(mediaUrl) : await testImage(mediaUrl);
    if (!mediaInfo.valid) {
        console.debug(`Media not valid: ${mediaUrl}`);
        // Добавляем placeholder для kappalol.fun, если требуется авторизация
        if (mediaUrl.includes('kappalol.fun')) {
            const placeholder = document.createElement('div');
            placeholder.textContent = 'Требуется авторизация для просмотра';
            placeholder.style.color = ' #ff4444';
            placeholder.style.padding = '5px';
            link.replaceWith(placeholder);
            link.dataset.processed = 'true';
            return;
        }
        return;
    }

    const maxSize = 512;
    let width = mediaInfo.width || 320;
    let height = mediaInfo.height || 620;
    if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
    }

    let mediaElement;
    if (fileType === 'image') {
        if (mediaUrl.includes('i.ytimg.com')) {
            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            wrapper.style.display = 'inline-block';

            mediaElement = document.createElement('img');
            Object.assign(mediaElement, {
                src: mediaUrl,
                alt: link.textContent,
                draggable: false
            });

            const playIcon = document.createElement('div');
            playIcon.className = 'ffz--overlay__bit';
            playIcon.style.position = 'absolute';
            playIcon.style.top = '50%';
            playIcon.style.left = '50%';
            playIcon.style.transform = 'translate(-50%, -50%)';
            playIcon.innerHTML = '<span class="ffz-i-play"></span>';

            wrapper.appendChild(mediaElement);
            wrapper.appendChild(playIcon);

            const linkWrapper = document.createElement('a');
            linkWrapper.href = url;
            linkWrapper.target = '_blank';
            linkWrapper.rel = 'noopener noreferrer';
            linkWrapper.appendChild(wrapper);

            mediaElement = linkWrapper;
        } else if (mediaUrl.includes('kappalol.fun')) {
            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            wrapper.style.display = 'inline-block';

            mediaElement = document.createElement('img');
            Object.assign(mediaElement, {
                src: mediaUrl,
                alt: link.textContent,
                draggable: false
            });

            const linkWrapper = document.createElement('a');
            linkWrapper.href = url;
            linkWrapper.target = '_blank';
            linkWrapper.rel = 'noopener noreferrer';
            linkWrapper.dataset.tooltip = mediaUrl; // Для тултипа
            linkWrapper.appendChild(wrapper);
            wrapper.appendChild(mediaElement);

            mediaElement = linkWrapper;
        } else {
            mediaElement = document.createElement('img');
            Object.assign(mediaElement, {
                src: mediaUrl,
                alt: link.textContent,
                draggable: false
            });
        }
    } else if (fileType === 'video') {
        mediaElement = document.createElement('video');
        Object.assign(mediaElement, {
            src: mediaUrl,
            controls: true,
            muted: true,
            loop: true,
            playsInline: true
        });
    }

    Object.assign(mediaElement.style, {
        width: `620px `,
        height: `320px`,
        objectFit: 'contain',
        borderRadius: '8px'
    });

    link.replaceWith(mediaElement);
    link.dataset.processed = 'true';
    console.debug(`Replaced link with ${fileType}: ${url} -> ${mediaUrl}`);
}

async function testVideo(url) {
    if (urlCache.has(url)) {
        console.debug(`Using cached video test for ${url}`);
        return urlCache.get(url);
    }

    return new Promise((resolve) => {
        const video = document.createElement('video');
        let timedOut = false;

        const timeout = setTimeout(() => {
            timedOut = true;
            urlCache.set(url, { valid: false });
            console.debug(`Video test timeout for ${url}`);
            resolve({ valid: false });
        }, 5000); // Таймаут 5 секунд

        video.onloadedmetadata = () => {
            if (!timedOut) {
                clearTimeout(timeout);
                urlCache.set(url, { valid: true, width: video.videoWidth, height: video.videoHeight });
                console.debug(`Video loaded: ${url}, size: ${video.videoWidth}x${video.videoHeight}`);
                resolve({ valid: true, width: video.videoWidth, height: video.videoHeight });
            }
        };
        video.onerror = () => {
            if (!timedOut) {
                clearTimeout(timeout);
                urlCache.set(url, { valid: false });
                console.debug(`Video failed to load: ${url}`);
                resolve({ valid: false });
            }
        };
        video.src = url;
    });
}

  

async function processMediaElement(media) {
    let mediaUrl, fileType;

    if (media.tagName.toLowerCase() === 'video') {
        // Для видео берем источник из <source> или poster
        const source = media.querySelector('source');
        mediaUrl = source ? source.src : media.poster;
        fileType = source ? 'video' : 'image';
    } else if (media.tagName.toLowerCase() === 'img') {
        // Для изображений берем src
        mediaUrl = media.src;
        fileType = 'image';
    }

    if (!mediaUrl) {
        console.debug('No media URL found for element:', media);
        return;
    }

    console.debug(`Processing media: ${mediaUrl}, type: ${fileType}`);

    // Проверяем доступность медиа
    const mediaInfo = fileType === 'video' ? await testVideo(mediaUrl) : await testImage(mediaUrl);
    if (!mediaInfo.valid) {
        console.debug(`Media not valid: ${mediaUrl}`);
        return;
    }

    // Определяем размеры медиа
    const maxSize = 512;
    let width = mediaInfo.width || 320;
    let height = mediaInfo.height || 620;
    if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
    }

    // Создаем новый элемент медиа
    let mediaElement;
    if (fileType === 'image') {
        mediaElement = document.createElement('img');
        Object.assign(mediaElement, {
            src: mediaUrl,
            alt: media.alt || 'Media from post',
            draggable: false
        });
    } else if (fileType === 'video') {
        mediaElement = document.createElement('video');
        Object.assign(mediaElement, {
            src: mediaUrl,
            poster: media.poster || '',
            controls: true,
            muted: true,
            loop: true,
            playsInline: true
        });
    }

    // Устанавливаем стили
    Object.assign(mediaElement.style, {
        width: `320px`,
        height: `620px `,
        objectFit: 'contain'
    });

    // Заменяем или добавляем элемент
    media.replaceWith(mediaElement);
    media.dataset.processed = 'true';
    console.debug(`Processed media: ${mediaUrl} as ${fileType}`);
}

// Пример вызова:
processMediaElement(document.querySelector('img'));

    // Дебаунс функция
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    const debouncedProcessLinks = debounce(processLinks, 100); // 100 мс для быстрой обработки

    // Инициализация
    document.addEventListener('DOMContentLoaded', debouncedProcessLinks);
    new MutationObserver(debouncedProcessLinks).observe(document.body, { childList: true, subtree: true });

    window.previewLinks = debouncedProcessLinks;

    // Добавление стилей
    const style = document.createElement('style');
    style.textContent = `
  .chat-line__message img, .chat-line__message video,
    [data-testid="tweet"] img, [data-testid="tweet"] video {
        display: inline-block;
        vertical-align: middle;
        max-width: 320px;
        max-height: 620px;
        object-fit: contain;
        border-radius: 8px;
    }
  .chat-line__message a, [data-testid="tweet"] a {
        display: inline-block;
        vertical-align: middle;
    }

`;
    document.head.appendChild(style);
})();


// Глобальные функции в window 
window.stopPreviewLinks = () => {
    if (observer) {
        observer.disconnect();
        console.debug('MutationObserver stopped');
    }
};
window.clearUrlCache = () => {
    urlCache.clear();
    console.debug('URL cache cleared');
};
window.togglePreview = () => {
    isPreviewEnabled = !isPreviewEnabled;
    if (isPreviewEnabled && observer) {
        observer.observe(document.querySelector('.chat-scrollable-area__message-container') || document.body, { childList: true, subtree: true });
        console.debug('Preview enabled');
    } else if (observer) {
        observer.disconnect();
        console.debug('Preview disabled');
    }
};
 