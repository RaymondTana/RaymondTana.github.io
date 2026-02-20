---
title: "What is the Halting Problem?"
date: 2023-07-27
categories:
  - Math
  - Programming
  - Computer Science
tags:
  - Algorithms
  - Computability
  - Decidability
---

For anyone familiar with programming, it's practically taboo to include anything resembling `while(true)` in one's code. After a while, one might be pretty adept at spotting pitfalls like this when inspecting code. The shocking mathematical fact is that the problem of spotting all the ways in which some code may stall indefinitely is **not** trivial nor subject to automation. We call this phenomenon the undecidability of the Halting Problem.

## Undecidability

The undecidability (a.k.a.: non-computability) of the Halting Problem (Turing, 1936) is sometimes presented as a standalone result. From this perspective, the Halting Problem has various implications for Computer Science: detecting infinite loops, redundant portions of code, and buffer overrun will forever be an art when analyzing code. 

The non-computability of the Halting Problem implies a limit to formal proof systems known as Gödel's First Incompleteness Theorem from 1931.

For our purposes, "problems" will simply be partial functions on the natural numbers that output integers. Some problems follow algorithmic procedures to convert their inputs into outputs, while others may not have this property. Counting, we see that despite there being only countably many algorithms (a.k.a., Turing machines), there are uncountably many partial functions on the natural numbers which output integers. Therefore, those "decidable," "algorithmic," "computable," or "effective" problems will represent 0% of all problems. 

For Computability Theory, the undecidability of the Halting Problem also serves to stratify computable problems from more computationally-complex problems: the Halting Problem represents a rung on a "ladder" of Turing degrees higher than the algorithmic problems. Its generalizations can form an infinitely tall ladder in this sense, and thereby construct the basis of the [Turing degree hierarchy](https://en.wikipedia.org/wiki/Turing_degree?ref=sifter.ghost.io) in Computability Theory.

### Informal Proof of Undecidability

We (informally) define the operator $$\operatorname{HALT}(f, x)$$ on algorithm $$f$$ and input $$x$$ to output `true` if and only if $$x$$ lies in the domain of $$f$$, and `false` otherwise. Really, $$f$$ should be considered as a Turing machine on natural numbers, and $$x \in \mathbb{N}$$. A Turing machine is said to halt on its input $$x$$ if, within a finite number of steps throughout the course of its computation when fed $$x$$ on its input tape, the machine enters its special halting state. At that point, the machine will output whatever is written on its tape upon the moment of entering the halting state. 

Notationally, to express that Turing machine $$f$$ halts on input $$x$$, we write $$f(x) \downarrow$$, and we let $$f(x)$$ represent the value output by the Turing machine upon halting. Otherwise, $$f(x) \uparrow $$ represents that the machine fails to halt on input $$x$$. 

While it is easiest to conceive of this setup as asking questions about Turing machines and their inputs, we can equivalently encode every Turing machine by its index in a standard, computable enumeration of all Turing machines: $$\left(\Phi_e(\cdot)\right)_e$$. This enumeration represents a machine by a natural number. So we can just as easily consider $$\operatorname{HALT}$$ as accepting pairs of natural numbers: $$(e, x)$$.
The central question behind the Halting Problem is whether the behavior of this operator $$\operatorname{HALT}$$ can be simulated perfectly by an algorithmic/computable process. I.e., is there a Turing machine that decides whether the $$e$$-th Turing machine halts on input $$x$$? More simply: is it algorithmic to decide whether an arbitrary algorithm has an output for an arbitrary input? 

Define the notation written as a [ternary operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator?ref=sifter.ghost.io):

```
D(x) := HALT(D, x) ? ↑ : ↓
```

The down-arrow above represents any fixed value, say, $$0$$. 

Importantly, if we were to assume $$\operatorname{HALT}$$ to be computable, then by the definition of $$D$$, we see that $$D$$ would be partial computable. Therefore, it would have an index $$d$$ in the standard enumeration of Turing machines. Imagine evaluating $$D$$ at its own index: 

$$
D(d) = \operatorname{HALT}(D, d)\ ? \uparrow\ :\ \downarrow
$$

It can't be that $$D(d) \downarrow$$, or else $$\operatorname{HALT}(D, d)$$ would evaluate to `true`, causing $$D(d) \uparrow$$; yet assuming $$D(d) \downarrow$$ is also problematic, for then $$\operatorname{HALT}(D, d)$$ evaluates to `false`, meaning $$D(d) \downarrow$$. It is a contradiction for a function evaluation to be neither convergent nor divergent, so we have essentially diagonalized against the Halting problem.

### (More) Formal Proof of Undecidability

The following is a more formal treatment of the non-computability of the Halting Problem.
Let’s consider 
$$
h(i, x) := \Phi_i(x) \downarrow\ ?\ 1 : 0
$$
 This function is total on $$\mathbb{N} \times \mathbb{N}$$ because the condition $$\Phi_i(x) \downarrow$$ has a truth value for every $$(i, x)$$, and the return values are fixed; therefore, asking whether $$h$$ is partial computable is equivalent to asking whether $$h$$ is (total) computable. 
Our plan is to show that $$h$$ is not computable. Our strategy will be to show that $$h$$ disagrees with every computable function on some input, implying that $$h$$ is not part of the class of computable functions. Let us fix arbitrary (total) computable $$f: \mathbb{N} \times \mathbb{N} \to \mathbb{R}$$. 
Next, construct the corresponding intermediary function 
$$
g_f(i) := f(i,i) = 0\ ?\ 0 :\ \uparrow
$$
 which is partial computable because it is computable to determine whether input $$i$$ lies in the domain of $$g_f$$: if and only if $$f(i, i) = 0$$, a computable predicate by the assumed computability of $$f$$; and because the output on the domain is computable. Thus, $$g_f$$ has an index $$e$$ in the effective enumeration of all Turing machines. That is:

$$
\Phi_e(\cdot) \equiv g_f(\cdot)
$$

What happens when we feed the index pair $$(e, e)$$ into total $$f$$? Let's explore the two mutually exclusive cases and their implications:

**Case 1**: $$f(e,e) = 0$$: 
$$
\rightarrow g_f(e) = 0 \rightarrow h(e,e) := \Phi_e(e) \downarrow\ ?\ 1:0 = g_f(e)\downarrow\ ?\ 1 : 0 = 1 \neq f(e,e).
$$

**Case 2**: $$f(e,e) \neq 0$$: 
$$
\rightarrow g_f(e) \uparrow \rightarrow h(e,e) := \Phi_e(e) \downarrow\ ?\ 1 : 0 = g_f(e)\downarrow\ ?\ 1 : 0 = 0 \neq f(e,e).
$$

Both cases result in $$h$$ disagreeing with $$f$$ at this input $$(e, e)$$.


### Incompleteness Theorem

There is a connection between the undecidability of the Halting Problem and the Incompleteness Theorem. First, let me explain some extra parts of our mathematical setting. Look towards the [Stanford Encyclopedia of Philosophy](https://plato.stanford.edu/entries/goedel-incompleteness/?ref=sifter.ghost.io#FirIncThe) for more.

- We will be talking about syntactic statements written in a particularly mathematical language called the *language of First Order Arithmetic*. These statements are used to express mathematical expressions which may or may not hold for natural numbers, and are expressed using symbols for various mathematical operations, for universal and existential quantifiers, and for numeric variables.
- A *formal system* in logic is a system of axioms written in the language of First Order Arithmetic equipped with rules of inference that allow one to generate new theorems syntactically from previously proved axioms and theorems. We ask that the set of axioms be decidable: i.e., there is an algorithm deciding whether a given statement is an axiom or not; and that the applications of our inference rules be verifiable by an algorithm as well. 
- Syntactic derivations of a certain statement in this language will be called *proofs*. Our requirement about decidability above implies that every proof can be verified by an algorithm.
- A formal system is *complete* if for every statement written in the language of the system, either that statement or its negation can be derived syntactically. 
- A formal system is *consistent* if no statement expressible in the language of the system has both itself and its negation derivable. 
- (A slightly simplified version of) **Gödel's First Incompleteness Theorem** states that any consistent formal system that possesses a certain set of axioms of arithmetic baked-in must necessarily be incomplete: meaning some (true) statements expressible in its language are neither able to be proved nor disproved.  

Why should the Halting Problem arise in this context? Certainly the decidability of the sets of axioms and inference tools available to the formal system will be our bridge between these two results. We have to restrict ourselves to a version of the Halting Problem which asks whether it is algorithmic to decide whether a given Turing machine will halt without any input. This is still undecidable as a problem, as the passing of inputs into a machine can be simulated identically by modifying the internal states of the machine and passing nothing. We do this because we would like to express "machine $$f$$ halts (with no input)" in the language of First Order Arithmetic: call this sentence $$S(f)$$. This is done by explicitly describing what halting means, which the language of First Order Arithmetic is expressive enough to capture. 

We will show that if every theorem in this formal system had a proof, we could thereby construct an algorithm solving the (restricted version of the) Halting Problem, a contradiction. Start the routine by accepting an arbitrary Turing machine $$f$$ as an argument. We begin by effectively writing $$S(f)$$. Let us iterate through all proofs by starting with all length $$0$$ proofs, then length $$1$$ proofs, then $$2$$, etc, and asking for each such candidate:
- If this candidate proof proves $$S(f)$$, we determine that $$f$$ halts; break. 
- Else if this candidate proof proves the negation of $$S(f)$$, we determine that $$f$$ fails to halt; break.

Each step is effective by assumption about the formal system, and our assumption about every theorem having a proof implies that this search is bounded, i.e., will terminate in finite time. Therefore, this routine we've described serves as an algorithm to solve the undecidable Halting Problem. Done.

## Turing Degrees
We've alluded to a structure of Turing degrees, or a way of measuring how computationally-complex a given problem is. Let me attempt to present the important concepts that reveal this structure, which can all be seen as a consequence of having the undecidability of the Halting Problem. 
Computability of Functions and Sets
By now, we understand what it means to call a problem or function on natural numbers computable. We may as well consider sets in the same context, because any subset $$A$$ of the natural numbers can be equivalently represented by its characteristic function $$\chi_A$$:

$$
\chi_A(n) := (n \in A)\ ?\ 1 : 0
$$
 
A set is *recursive/computable* if and only if its characteristic function is computable. I.e., a set is computable iff there exists an algorithm which answers membership in that set correctly for ever input. Moreover, a set is *recursively enumerable* or *computably enumerable (c.e.)* if it is a set of natural numbers which can be enumerated completely by some algorithm. The algorithm is not required to list through all of the elements in any particular order: all that matters is that each element of the set is eventually enumerated. 

### Differentiating computable and c.e.

Note that every computable set is c.e.: given an algorithm that perfectly describes membership in the set, we define a computable enumeration of the set by following the rule: "ask the algorithm whether $$0 \in A$$: if so, enumerate $$0$$. Otherwise, skip; do the same for $$1$$; then $$2$$; etc." All members of $$A$$ will eventually be enumerated, and we can even do it in ascending order. 

But not every c.e. set is computable: call $$K := \{ \langle e, x \rangle \in \mathbb{N} : \Phi_e(x) \downarrow \}$$. This is called the *Halting set*. We know deciding membership in $$K$$ is not computable, so $$K$$ is not computable. Yet $$K$$ is clearly c.e., for we may [dovetail](https://en.wikipedia.org/wiki/Dovetailing_(computer_science)?ref=sifter.ghost.io) over all possible inputs $$\langle e, x \rangle$$, simulating each computation $$\Phi_e(x)$$ and enumerating $$\langle e, x \rangle$$ only once the computation halts if at all. There is no way to guarantee a certain order of these pairs; all we know if that any computation which eventually halts will also eventually be enumerated into the set. 

It is a fact that every c.e. set is the domain of some partial computable function. This is clear because:
- For any c.e. set, we may construct a Turing machine (i.e., partial computable function) whose domain is the same c.e. set by only letting the machine halt on some $$n$$ whenever the enumeration admits this $$n$$. Any $$n$$ in the enumeration will appear after finite steps, whereas any $$n$$ not in the enumeration will never appear, so this function's domain is exactly the c.e. set. 
- If $$f$$ is partial computable, dovetail over inputs to $$f$$; if ever we notice $$f$$ to halt on some input, enumerate that input. This effectively enumerates its domain, showing its domain is c.e. .

### Comparing Problems

Some problems are easier than others: if there exists an algorithm which, having access to the outputs of one problem $$g$$, can compute any output of another problem $$f$$ for any input in the domain of $$f$$, we say that $$g$$ computes $$f$$, or that $$f$$ is *Turing-reducible* to $$g$$, written as $$f \leq_{\text{T}} g$$. Any problem which is already computable will be Turing-reducible to every other problem, for we may just ignore the provided problem and use the existing algorithm to produce the first problem's outputs. 

Another clear observation is that any set is computable from its complement: i.e., $$A \leq_{\text{T}} A^c$$. To decide membership in $$A$$, we simply ask the algorithm for its complement: if $$n \in A^c$$, then output $$0$$; otherwise, output $$1$$. This perfectly mimics the characteristic function of $$A$$. 

A less trivial example would be to compute $$K$$ from $$\operatorname{Inf}$$, where

$$
\operatorname{Inf} := \{x \in \mathbb{N} : \operatorname{domain}(\Phi_x) \text{ is infinite} \}.
$$

We could start by noticing $$\langle e, x\rangle =: n \in K$$ iff $$\exists s \left[ \Phi_e(x)[s] \downarrow \right]$$, which is read aloud as "there exists a stage $$s$$ at which, after running the $$e$$-th Turing machine for $$s$$ steps on input $$x$$, the computation has already halted." Call 

$$
W := \{s \in \mathbb{N} : \Phi_e(x)[s] \uparrow\}.
$$

This set $$W$$ is c.e.: simply simulate $$\Phi_e(x)$$ and enumerate every $$s$$ so long as the computation hasn't already halted by the $$s$$-th step. It is possible to extract an index $$j$$ for which $$W = \operatorname{domain}(\Phi_j)$$ as discussed above. We ask whether $$j \in \operatorname{Inf}$$? If so, then $$W$$ is infinite, and thus $$\Phi_e(x) \uparrow$$, so $$\langle e, x \rangle \not\in K$$. Otherwise, $$W$$ is finite, and therefore, by some step $$s$$, we know that $$\Phi_e(x)[s] \downarrow$$, hence $$\Phi_e(x) \downarrow$$, so $$\langle e, x \rangle \in K$$. Thus, we may use $$\operatorname{Inf}$$ to decide membership in $$K$$. 

Define two problems $$f, g$$ to be *Turing-equivalent* if they are mutually Turing-reducible, i.e.:

$$
f \equiv_{\text{T}} g :\iff f \leq_{\text{T}} g \text{ and } g \leq_{\text{T}} f.
$$

One can check that Turing-equivalence is an equivalence-relation between problems: 
- $$\equiv_{\text{T}}$$ is *reflexive*: any problem is reducible to itself.
- $$\equiv_{\text{T}}$$ is *symmetric*: obvious.
- $$\equiv_{\text{T}}$$ is *transitive*: by chaining together algorithms. 

Therefore, we may consider the space of problems modded-out by this equivalence relation: $$\mathbb{D} := \mathbb{N}^{\mathbb{N}} / \equiv_{\text{T}}$$. We call this space the *Turing degrees*.

### Oracle Relativization

All of the prior notions can be relativized such that, throughout the course of any algorithmic computations, the algorithm can access an arbitrary but finite number of bits stored in a given oracle. This generalized structure of an algorithm is known as an oracle Turing machine, and is notated: $$\Phi^X_e$$, where $$e$$ is the index and $$X$$ is the oracle (assumed to be a set of natural numbers). The set of all oracle Turing machines is computably enumerable in the same way as the normal Turing machines. Replacing algorithms/Turing machines with oracle Turing machines in all previous definitions, we have notions of being being *computably enumerable relative to an oracle* $$X$$ and being a *computable set relative to an oracle* $$X$$. 

Let us define the Turing jump of a set of natural numbers $$X$$:

$$
X' := \{ e : \Phi^X_e(e) \downarrow\}.
$$

This operation of producing a jump of $$X$$ is designed to produce a set that is more computationally complex than the original set $$X$$. In particular, comparing $$\varnothing$$ with $$\varnothing'$$, we see that the empty set is obviously computable, whereas its jump is Turing equivalent to the set of indices satisfying the Halting problem, which is not computable. 

**Post's Theorem** is an important result that provides us a basic structure to the Turing degrees, and basically says that: 

- $$\varnothing$$, $$\varnothing'$$, $$\varnothing''$$, ... form a sequence of increasingly non-computable sets (i.e., $$\varnothing^{(n)}$$ is computably enumerable, but not computable, relative to $$\varnothing^{(n - 1)}$$, and *complete*: able to Turing-compute all other sets computably enumerable relative to  $$\varnothing^{(n - 1)}$$),
- Every set Turing-equivalent to $$\varnothing^{(n)}$$ has a membership relation expressible in a standard syntactic form called $$\Sigma^0_n$$,
- A set being expressible in the syntactic form $$\Sigma^0_{n+1}$$ is equivalent to being computably enumerable relative to $$\varnothing^{(n)}$$, and
- A set and its negation both being expressible in the syntactic form $$\Sigma^0_{n+1}$$ is equivalent to being Turing reducible to $$\varnothing^{(n)}$$.

From this perspective, we see the Halting Problem as a generator of an infinite hierarchy of computational complexity in the sense of Turing. This structure is the basis of Computability Theory. 

## Concluding Remarks
This overview of the Halting Problem is by no means complete — but I hope it can help familiarize readers with key concepts in the subject and prepare you for interacting with the concepts in further resources. 


**Further Readings**:
- Soare's [Turing Computability](https://link.springer.com/book/10.1007/978-3-642-31933-4?ref=sifter.ghost.io)
- Standford Encyclopedia of Philosophy's [Gödel's Incompleteness Theorem](https://plato.stanford.edu/entries/goedel-incompleteness/?ref=sifter.ghost.io#FirIncThe)
