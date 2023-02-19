export function toArabicNumber(strNum) {
    let ar = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    let cache = String(strNum);
    for (let i = 0; i < 10; i++)
        cache = cache.replace(cache[i], ar[Number(cache[i])]);
    return cache;
}
