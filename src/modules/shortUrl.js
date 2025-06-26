function shortUrl(url) {
    return url.length > 50 ? url.slice(0, 47) + "..." : url;
}

export default shortUrl;