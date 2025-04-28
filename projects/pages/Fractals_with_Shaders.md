---
layout: single
title: "Fractals with Shaders"
nav_exclude: true
---

Fractals are sets in Euclidean space with infinitely fine details (or, really, just any subset of the Euclidean space!) A computer only has hope of representing approximations of algorithmically-specifiable fractals. I used shaders and GLSL (the language that computes using your computer's GPU) to visualize them. 

<iframe id="fractalsFrame"
        src="{{ site.baseurl }}/my_assets/html/Fractals_with_Shaders.html"
        style="width:100%;border:none;display:block;"></iframe>
<script>
    function setIframeHeight(iframe) {
    const doc = iframe.contentWindow?.document;
    if (!doc) return;           // still cross-origin?  bail out
    const body  = doc.body,
            html  = doc.documentElement,
            fullH = Math.max(
                    body.scrollHeight, body.offsetHeight,
                    html.scrollHeight, html.offsetHeight
                    );
    iframe.style.height = fullH + 'px';
    }
    // run once when the iframe’s HTML parses…
    const frame = document.getElementById('fractalsFrame');
    frame.addEventListener('load', function () {
    // …and keep checking a few times in case late assets extend the page
    let attempts = 0, id = setInterval(() => {
        setIframeHeight(frame);
        if (++attempts > 10) clearInterval(id);   // ~3 s total
    }, 300);
    });
    // optional: resize again if the parent page itself gets wider
    window.addEventListener('resize', () => setIframeHeight(frame));
</script>

## Controls
- **Click**: zoom in
- **`Shift`+`Click`**: zoom out
- **Drag**: pan
- **Mouse wheel**: zoom
- **Arrow keys**: pan $10%$
- **`+`/`–` keys**: zoom
- **Reset 🔄**: back to full view
- **Download PNG**: save snapshot

## Implementation
I don't make use of any external libraries. Below is a summary of the codebase.

| Tech | Notes |
|------|-------|
| **HTML 5** | one flex-box layout (`index.html`) |
| **JavaScript (ES modules)** | `main.js` handles the UI |
| **WebGL2 + GLSL ES 3.00** | `fractalRenderer.js` compiles shaders, uploads uniforms; `fractal.frag` computes the fractals |

### How it works

1. **initFractalRenderer** gets a WebGL2 context, compiles shaders, stores uniform locations, and returns `{ draw(), resize() }`.
2. **Vertex shader** draws a fullscreen quad; fragment shader maps each pixel to a complex coordinate `(x,y)` = `center + uv * scale`, then iterates $z \mapsto z^2 + C$ until escape or `maxIter`.
3. Smooth iteration count is turned into an HSV palette; Mandelbrot, Julia, and Fatou share one shader via a `u_fractalType` switch.
4. **main.js** maintains reactive state (`center`, `scale`, `c`, `maxIter`, `B`) and sends it to `draw()` on every animation frame.
5. Mouse-wheel / click / drag + keyboard arrows & ± update the state; a **Reset** button restores defaults; **Download PNG** saves the current framebuffer to disk; **Dark mode** toggles a CSS class.

## GitHub Repository

![Readme Card](https://github-readme-stats.vercel.app/api/pin/?username=RaymondTana&repo=shaders)

[![Last Commit](https://img.shields.io/github/last-commit/RaymondTana/Lights_Out)](https://github.com/RaymondTana/shaders) [![GitHub Stars](https://img.shields.io/github/stars/RaymondTana/Lights_Out?style=social)](https://github.com/RaymondTana/shaders)

[👉 View the full repository on GitHub](https://github.com/RaymondTana/shaders/tree/main/fractals)