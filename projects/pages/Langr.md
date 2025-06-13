---
layout: single
title: "Lights Out"
nav_exclude: true
---

**Langr** is a a language guessing game. You can play the game below:

<iframe id="LangrFrame" 
        src="/my_assets/html/Langr.html" 
        style="width: 100%; border: none;"
        onload="resizeIframe(this)"></iframe>

<script>
  function resizeIframe(iframe) {
    // Ensure that the content is available and measurable.
    if (iframe.contentDocument && iframe.contentDocument.documentElement) {
      iframe.style.height = iframe.contentDocument.documentElement.scrollHeight + 'px';
    }
  }
</script>

## Implementation

Implemented in vanilla JavaScript. 

## GitHub Repository

![Readme Card](https://github-readme-stats.vercel.app/api/pin/?username=RaymondTana&repo=Langr)

[![Last Commit](https://img.shields.io/github/last-commit/RaymondTana/Langr)](https://github.com/RaymondTana/Langr) [![GitHub Stars](https://img.shields.io/github/stars/RaymondTana/Langr?style=social)](https://github.com/RaymondTana/Langr)

[👉 View the full repository on GitHub](https://github.com/RaymondTana/Langr)