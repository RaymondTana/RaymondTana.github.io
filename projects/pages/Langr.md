---
layout: single
title: "Langr"
nav_exclude: true
---

**Langr** is a language guessing game. The concept of the game is similar to the Wordle variants, and is unique in its multimodality. Language samples are provided, and the user is meant to use the available evidence to guess the source language from which all that evidence comes. The user receives a better score for using less evidence.

You can play the game below:

<iframe src = "/my_assets/html/Langr.html" style = "width : 100%; height : 800px; border : none;"></iframe>

## Implementation

Implemented in vanilla JavaScript. We make use of many sources of data in order to create this game. 

Spoken samples, sentence text, and other speaker metadata are sourced from `Mozilla Common Voice (v24)`. Language metadata was mainly sourced from `Glottolog`, including a language's family lineage. Phonetic transcriptions are generated using `eSpeak`. And the `langcodes` library helps to translate between each library using standard ISO 639‑3 codes. 

## GitHub Repository

![Readme Card](https://github-readme-stats.vercel.app/api/pin/?username=RaymondTana&repo=Langr)

[![Last Commit](https://img.shields.io/github/last-commit/RaymondTana/Langr)](https://github.com/RaymondTana/Langr) [![GitHub Stars](https://img.shields.io/github/stars/RaymondTana/Langr?style=social)](https://github.com/RaymondTana/Langr)

[👉 View the full repository on GitHub](https://github.com/RaymondTana/Langr)