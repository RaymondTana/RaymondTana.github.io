---
layout: single
title: "Lopez Graph Games"
nav_exclude: true
---

Computing Lopez type and $∗$-type for Lopez graph games. These graph games were first ideated by Carlos Lopez. 

## GitHub Repository

![Readme Card](https://github-readme-stats.vercel.app/api/pin/?username=RaymondTana&repo=lopez_graph_game)

[![Last Commit](https://img.shields.io/github/last-commit/RaymondTana/lopez_graph_game)](https://github.com/RaymondTana/lopez_graph_game) [![GitHub Stars](https://img.shields.io/github/stars/RaymondTana/lopez_graph_game?style=social)](https://github.com/RaymondTana/lopez_graph_game)

[👉 View the full repository on GitHub](https://github.com/RaymondTana/lopez_graph_game)

## Mathematical Setting
A _Lopez graph game_ is a game held between two players on a given, undirected graph $G = (V, E)$. Players alternate making moves on $G$ and its resulting subgraphs until a winner is determined. A _move_ is defined as a player removing either:
- A single vertex $v \in V$ (and all edges $e \in E$ with $v \in e$), or
- Two adjacent vertices $u, v$ (and all edges $e \in E$ with $u \in e \lor v \in e$).
- The resulting $G' = (V', E')$ is the subgraph of $G$ on which the next player must play.
- In the _normal version_ of the Lopez graph game, the last player to remove a vertex wins.
- In the _adjoint version_ (or $*$ version) of the Lopez graph game, the last player to remove a vertex loses. 
- In the normal (or adjoint) version, 
  - if Player I can guarantee a win no matter Player II's responses, we say that the graph $G$ on which they started play has _Lopez type I_ (or _Lopez_ $\ast$_-type I_$^{*}$, resp.). 
  - Otherwise, we say that $G$ has _Lopez type II_ (or _Lopez_ $\ast$_-type II_$^{*}$, resp.). 