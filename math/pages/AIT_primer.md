---
layout: single
title: "Algorithmic Information Theory Primer"
nav_exclude: true
---

## Other Resources

- [Tana 2024](/my_assets/documents/PSU%20Math%20Club%20Mini-Talk%20Handout.pdf): My presentation to the Math Club last year on Compression (much of that information is already in this document)
- [Hutter 2007](https://arxiv.org/pdf/cs/0703024): short, non-technical yet philosophical introduction
- [Grünwald and Vitányi 2008](https://arxiv.org/pdf/0809.2754): great introduction, slightly more technical
- [Weiss’s notes 2018](https://diagonalargument.com/wp-content/uploads/2018/11/algorithmic-info-theory.pdf): more technical
- [Tana 2023](https://sifter.ghost.io/halting_problem/): my introduction to the Halting Problem

# Basic Introduction to Compression

## Definition

Compression (really: algorithmic, universal, lossless … compression) is the technique of representing data through encodings, usually in the pursuit of reducing how large (measured by number of bits) the representation is. 

The general pursuit is to choose an encoding scheme which best *minimizes* the code lengths of data. 

![Zip File](/my_assets/images/zip.png)

## Morally

This is a pursuit of giving up syntax while preserving the semantics. 

This type of mathematics is one where we don’t care about what the data *looks* like, so long as we can use algorithms to map it back to its original form and preserve all its information content. 

I like thinking of it this way, because, really, each theory in mathematics is sort of like defining what matters, what doesn’t matter, and seeing the structure that the objects have under those preferences. 

- *Topology*: sets only matter *up to* homotopy.
- *Geometry*: sets matter *up to* isometry.
- *Algorithmic Information Theory*: data matters *up to* encoding.
- *Computer Science*: algorithmic efficiency matters *up to* $O(\cdot)$.

## Three lights:

1. *Information Theory*: `Incompressibility = Information Content`
    
    I.e., if we can’t compress data any further, we’ve measured just how much pure information is baked into this data. 
    
2. *Computability*: `Degree of incompressibility is not Computable`
    
    I.e., there is no algorithm which can determine with certainty and in finite time the optimally compressed version of just any piece of data. 
    
3. *Euclidean Geometry*: `Dimension is determined by the incompressibility of its points`
    
    I.e., rather than think of the dimension of a shape as a property about the whole ensemble of points in the set, we can actually compute the dimensions of shapes by just looking at how compressible each of its points aren’t. 
    

## 1. Information Theory: `Incompressibility = Information Content`

### Example 1 [all zeros]:

> Imagine you have a text file full of $2^{10}$ zeros. You throw this text file into a compressor. What’s the best this compressor could really do to minimize the size of this file? 

*Answer*: we might store a description of the file like the instructions: “`print '0' 2^10 times`”. This representation is *much* shorter (check its length is $\log_{2} (2^{10}) + O(1)$).  Of course, this scheme works for any run of zeros of some different length. We notice that this description is basically the best we could ask to do, and because its length runs like $\log$, this is basically like having *no* information in this file. What good does knowing that many zeros offer? 

### Example 2 [coin flips]:

> Imagine you have a text file full of the results of flipping a fair, $2$-sided coin $2^{10}$ times: storing zero for heads, one for tails. You throw this text file into a compressor. What’s the best this compressor could really do to minimize the size of this file? 

*Answer*: Because none of the bits are related to one another, we should not expect there to be any redundancy to take advantage of when looking for a shorter representation for this file. A file like this is filled with the outcome of a random event, so we shouldn’t find that it is very compressible. In fact, this is the “worst case” scenario, because we need basically all of the bits in this original file in order to reconstruct it. Unlike the file filled with zeros, it seems that these bits are *information-ful*, i.e., this file contains basically the most amount of information possible to contain across $2^{10}$ bits.

*Note*: for either example, of course we could imagine there being an algorithm that says: “if file = 1024 zeros, compress that file to the symbol ‘0’. Else, leave the file unchanged.” Such an algorithm *only* works to compress this particular example file. What is more interesting to us are the algorithms that have to minimize the code-lengths of *all* files simultaneously, not just one in particular. This is the same as fixing a Turing-complete programming language (like Python) and asking what’s the shortest length of program that would output the desired file? 

### In General

How do we define randomness for real numbers? Those whose bits behave reasonably unpredictably? Those who cannot be snuffed out by some statistical law like the Law of Large Numbers? Those who can’t give us the ability to win arbitrary amounts of money betting on the next bit in its expansion? Those whose expansions’ prefixes cannot be compressed? 

We call the *information content (a.k.a., algorithmic entropy, Kolmogorov complexity, information density)* of a file to be

$$
\begin{aligned}
K(\text{file}) &= \text{shortest length of code for the file}\\
&= \min \set{\text{len}(\text{codeword}) : (\exists \text{ algorithm } P) \text{ s.t. } P(\text{codeword}) = \text{file}}
\end{aligned}
$$

Written another way:

$$
\begin{aligned}
K(x) &= \left\{ \substack{\text{shortest length of a program in a fixed, Turing-complete}\\\text{programming language producing and halting on } x} \right\}
\end{aligned}
$$

This isn’t the definition you’ll see in the Downey-Hirschfeldt textbook or any paper using Kolmogorov complexity, but it’s truly just as rigorous a definition as the typical definition by Turing machines. Philosophically, there is an underlying assumption that *algorithms* in the Turing sense or Python sense or pick-your-favorite-programming-language sense correspond to *algorithms* as conceived by humans. This is called the **Church-Turing thesis**, which has great evidence especially because so many independent formalisms for computable, effective, algorithmic, recursive all produce weaker or equivalent notions to Turing’s. 

**Examples**

- **All zeros**: low information content
****$\text{file} = 00\cdots0$ has $K(\text{file}) \approx \log(\text{length}(\text{file}))$ (basically zero)
- **All coin flips**: high information content
****$\text{file} = \text{HT}\cdots \text{T}$ has $K(\text{file}) \approx \text{length}(\text{file})$ (basically maximal)

## 2. Computability: `Degree of incompressibility is not Computable`

There is no way to determine (using a computer, or any algorithmic machine) the information content of an arbitrary file, i.e., the minimal length we can achieve in representing it under a fixed encoding scheme. 

Notice that *optimizing for code-lengths* is a task that requires searching for which codes will map to the desired data. 

We will check code words $c$ shorter than $\text{length}(z)$ to see whether they serve as possible representations of $z$ under a fixed, universal, lossless compression algorithm.

Given a file with data $z$, let’s check whether the code $c$ will decode back to $z$: run the decoding algorithm on $c$ and wait to see when that algorithm outputs something. If the output is $z$, then yes! Otherwise (two cases: either the algorithm fails to halt, or the output is not $z$), $c$ is not a code/representation for $z$. 

The task *requires* us to interface with predicting whether some code will ever halt/output something. This problem is famously known to be unsolvable by a computer. It’s called the *Halting Problem*, popularized by Alan Turing and Alonzo Church. Think of it as saying there’s no tool that can read arbitrary computer code and determine whether there is an infinite loop hidden somewhere inside the computations. I wrote a self-contained introduction to the Halting Problem [*here*](https://sifter.ghost.io/halting_problem/). 

## 3. Euclidean Geometry: `Dimension is determined by the incompressibility of its points`

We can’t directly define the Kolmogorov complexity of a point in Euclidean space, since points are represented by *infinite* binary expansions, but $K$ only accepts finite inputs. Instead, we just see how $K$ behaves on longer and longer initial-segments/prefixes of a real number. If $x \in \mathbb{R}$, we may write $x_0 \cdots x_{n - 1}$ as the first $n$ in the binary expansion of $x$. Then the quantity $K(x_0 \cdots x_{n - 1})$ is a number that ranges between $0$ (perfectly compressible) and $n$ (the best we can do to losslessly compress is to use these bits verbatim). We normalize the complexity by dividing by $n$: $\frac{K(x_0 \cdots x_{n - 1})}{n}$. Then the limiting behavior of this normalized complexity is what we call the effective dimension of $x$: 

$$
\dim(x) \stackrel{?}{=} \lim_{n \to \infty} \frac{K(x_0 \cdots x_{n - 1})}{n} 
$$

The problem is: this limit might not exist. This would happen if the prefixes of $x$ oscillate between low-complexity and high-complexity. So we might swap out the $\lim$ with some other limit that *is* always defined. Two candidates are $\liminf$ and $\limsup$. The limit-infimum is what provides an effective analogue of Hausdorff dimension, while the limit-supremum corresponds effectively to packing dimension. For our purposes, let’s proceed with limit-infimum. Thus, our definition for the *effective (Hausdorff) dimension of $x$* is:

$$
\dim(x) := \liminf_{n \to \infty} \frac{K(x_0 \cdots x_{n - 1})}{n}.
$$

Here comes the surprising connection: that effective Hausdorff dimension can approximate (classical) Hausdorff dimension! Take a simple (more precisely, $\Sigma^0_2$-definable, from the arithmetical hierarchy) set $X$ in Euclidean space, like a rational interval, the Cantor middle-$1/3$ set, any simple geometric set with rational side lengths and position, etc. 

Then we have the (easy version of the) Point-to-Set Principle:

$$
\dim_{\operatorname{H}}(X) = \sup_{x \in X} \liminf_{n \to \infty} \frac{K(0.x_0 x_1 \cdots x_{n - 1})}{n}
$$

This should be read as: we can compute the (fractal) dimension (like Hausdorff and packing dimensions) in a point-wise manner: we ask across all the points in $X$ just how complex the first few bits of that point are as a string, and then keep extending the prefixes longer and longer (length $n$) and computing their information content (i.e., how incompressible they are) relative to the maximum size $n$. 

This is surprising in the sense that usually, we cannot rely on a point-wise computation of the dimension of a shape: all points are of geometric dimension zero, but somehow some sets have different dimensions. There’s no “classical” way to recover dimension of a set from its points. Instead, we have to keep in mind the *entropy* of its points. Shows the power of considering compression!

*Note*: This is a simplified version of a result known as the *Point-to-Set Principle*. This result works for any set, but requires extra power in the form of access to oracles for your computation when your set is not simple.

---

# Algorithmic Information Theory

*Algorithmic Information Theory* (AIT) can be viewed as either:

- the **branch of theoretical computer science** dedicated to the properties of computably generated objects,
- a **refinement of classical Shannon information theory** measuring the information content of individual objects,
- a **project to formalize randomness**,

AIT offers some novel approaches to otherwise “classical" mathematics (i.e., the mathematics unrestricted by effectivity). 

**Philosophize** on the 

- **formalization of effectivity,**
- **information content,**
- and **randomness**.

The theory has also found success answering open questions in classical contexts, suggesting some advantages to imposing the additional structure that comes by respecting computability.

The classification of certain infinite sequences as random requires one to interface with multiple perspectives on what might constitute random behavior: 

- **inconspicuousness**: an inability to detect patterns across its bits using an effective statistical test
- **incompressibility**: inability to compress the sequence into a more compact representation recoverable by an effective decoder
- **unpredictability**: inability to make arbitrary gains gambling against newly revealed bits following an effective strategy

These three paradigms all aim to characterize **algorithmic randomness**. 

Each paradigm offers plenty of variants that play with the meanings of *effective*, to **detect**, to **compress**, and **predict**. This variety of interpretation has of course brought forth a zoo of randomness notions such as to be Martin-Löf (ML) random (i.e., $1$-random), computably random, partial computably random, Kurtz random, Kolmogorov-Loveland random, Schnorr random, and numerous kinds of resource-bounded random. 

More notably, though, is that many of the known notions of randomness admit equivalent formulations in all three paradigms.

One desirable property for any randomness notion is that **almost every sequence qualify as random**, for to be random should be a typical trait measure-theoretically. Just as fractal dimension acts as a refinement to measure by differentiating between sets of measure zero, we would expect there to be **a refinement of any randomness notion to the few sequences which do not qualify as random**; some way to quantify *how random* the sequence behaves. This role will be filled by (the various notions of) **effective fractal dimension**, whose development also spans all three paradigms of algorithmic randomness. The name for effective fractal dimension may as well have been something like *asymptotic (algorithmic) information density* had it not been for the fact that this notion is often equivalently viewed as an **effectivization of classical fractal dimension constructions**, and as a classical local dimension notion itself. This is our first hint of the possibility of contributing to classical mathematics by algorithmic arguments; and this hope has only been bolstered after the **discovery of the Point to Set Principle**, a result which numerically relates the effective fractal dimension of points in a set to the classical fractal dimension of the entire set. 

**Theorem [Point-to-Set Principle]** For any $X \subseteq \mathbb{R}^N$,

$$
\dim_H(X) = \min_{A\in 2^\omega} \sup_{x \in X} \operatorname{dim}^A(x) = \min_{A\in 2^\omega} \sup_{x \in X}  \liminf_{n \to \infty} \frac{K^A(x_0 \cdots x_{n - 1})}{n}.
$$

In other words, it characterizes the dimension of a set in a *point-wise manner*, something impossible classically since singletons are always assigned dimension zero. The difference here is that -- *algorithmically -- not all points are made equal*. While some points can be demonstrated to have zero dimension algorithmically, other points in the set might have nonzero effective fractal dimension. Therefore, effective fractal dimension is yet another layer of refinement: distinguishing between individual points.

---

## Excercises

1. `Recover basic geometric dimensions effectively`: can you verify that the dimension of basic geometric shapes are as we expect using the Point to Set Principle?
    1. If $x \in \mathbb{R}$ is a real number, prove that it has zero (Hausdorff) dimension: $\dim_{\text{H}}(\set{x}) = 0$.
    2. If $z \in \mathbb{R}^N$ is a point in $N$-dimensional Euclidean space, prove it’s zero dimensional: $\dim_{\text{H}}(\set{z}) = 0$. 
    3. (harder) Prove $\dim_{\text{H}}(\mathbb{R}) = 1$. 
    4. (similar difficulty to (c)) Prove $\dim_{\text{H}}(\mathbb{R}^N) = N$. 
2. `Reason about the Hausdorff dimension of fractals effectively`: can you also come up with a way to compute the Hausdorff dimension of basic fractals using the Point to Set Principle?
    1. (harder) Try the [**Middle 1/3-Cantor Set**](https://en.wikipedia.org/wiki/Cantor_set): $\dim_{\text{H}}(C) = \frac{\log 2}{\log 3}$. 
3. `Think of real numbers that have a given effective dimension`: Give an example of a real number $x$ (either explicitly or by saying *how* you’d obtain that number or *what kind* of number you’d need) that has:
    1. $\dim(x) = 1$
    2. $\dim(x) = 1/2$
    3. $\dim(x) = 0$
    4. (harder) $\dim(x) = s$ for any $s \in (0, 1)$.
4. `Basic Point-to-Set Principle arguments`: suppose we fix a set $X$, and I know that for every oracle $A$, there exists $x \in X$ such that $\dim^A(x) \geq s$. What does this mean about $\dim_{\text{H}}(X)$? 
    
    *Note*: The conclusion you reach here is a type of statement that is *very hard* to prove from the usual definition of Hausdorff dimension. This is one of the great advantages of using the algorithmic characterization of Hausdorff dimension.