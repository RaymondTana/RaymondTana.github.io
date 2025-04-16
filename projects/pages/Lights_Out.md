---
layout: single
title: "Lights Out"
nav_exclude: true
---

[Lights Out](https://mathworld.wolfram.com/LightsOutPuzzle.html) is a mathematical puzzle that lives on an $n \times n$ where each cell of the grid is one of two colors: either *red* or *white*. The goal is to eventually get all the cells in the grid to be red. You can play the game below:

<iframe id="lightsOutFrame" 
        src="/my_assets/html/Lights_Out.html" 
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

## Background

The original setup involves a $5 \times 5$ board, on whose cells a user may "click." Clicking a cell will not only flip the color of that cell, but also flip the color of all the neigbors to its north, east, south, and west (call this rule `Adjacent`). But the original variant of the game introduced to me followed a different rule `Same Row & Col`: any click flips the color of all cells sharing the same row or column as the clicked cell. Another variant involves all cells sharing the same diagonal (without any wrapping), called `Diagonals`. 

There is a general strategy for solving an $n \times n$ board following the `Same Row & Col` rule whenever $n$ is odd. There's a *different* strategy that works under the same rule but for $n$ being even. I'm not aware of general strategies otherwise... let me know if you find one! 

## Implementation

Implemented in TypeScript with strict mode enabled. The project utilizes static type-checking, union types, and interfaces. 

## Video

Watch the teaser video I made for Lights Out in [Manim](Manim.html).

<iframe width="560" height="315" 
    src="https://www.youtube.com/embed/hg7bFiNvHS0?si=vzZmb_HxlpfeKJwe" 
    title="YouTube video player" frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen>
</iframe>

## GitHub Repository

![Readme Card](https://github-readme-stats.vercel.app/api/pin/?username=RaymondTana&repo=Lights_Out)

[![Last Commit](https://img.shields.io/github/last-commit/RaymondTana/Lights_Out)](https://github.com/RaymondTana/Lights_Out) [![GitHub Stars](https://img.shields.io/github/stars/RaymondTana/Lights_Out?style=social)](https://github.com/RaymondTana/Lights_Out)

[👉 View the full repository on GitHub](https://github.com/RaymondTana/Lights_Out)