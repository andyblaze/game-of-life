export function resizeCanvas() {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const sz = { w: window.innerWidth, h: window.innerHeight };
    onscreen.width  = Math.round(sz.w * dpr);
    onscreen.height = Math.round(sz.h * dpr);
    onscreen.style.width  = sz.w + "px";
    onscreen.style.height = sz.h + "px";  
}