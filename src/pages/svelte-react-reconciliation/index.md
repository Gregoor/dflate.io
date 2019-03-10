---
title: 'Svelte: compile-time React-conciliation'
date: '2019-01-26'
---
I have been meaning to look at [Svelte](https://svelte.technology) for a while, it being the most exciting development in the frontend library space since [React](https://reactjs.org/). Whereas other libraries that came after React mostly remixed its API and moved away from more controversial features, Svelte did something I have not seen before: It figures out how changes in your components' state affect their view **at compile time**. 

Let us take a couple of steps back and look at what came before React and how it stood out to me, back in 2015. After that we will look at what makes Svelte different. I am not going to look at library internals, so this will be relatively high-level.

## Manual DOM management

Scarred by the $(selector)-spaghetti-callback-hell I developed early in my career (for little money, so I think we good, boss), I soon after started looking for more principled approaches. Our web application framework at the time, [Yii](https://www.yiiframework.com/) - one of many Rails-like PHP frameworks - adhered to [Model-View-Controller (MVC)](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) and I also learned about it in university (with Java Swing, yaiks). MVC is an architectural pattern, intended to make developing UI applications simpler by organizing code in three separated but interconnected parts. The Model contains and manages the data and rules, the View represents it and the Controller ties the two together and routes user input.
So that was what I looked for in the frontend space.

With today's knowledge [BackboneJS](https://backbonejs.org/)'s View merging the controller and the view (in the MVC sense) was already a step towards React. Still, with Backbone one would often explicitly mutate specific elements of a View and then duplicate that mutation in more complex Views (at least I did). Or you might re-render, which probably meant remounting the whole View, losing [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction)-state (what is focused, form state, etc.) and possibly performance in the process.

[AngularJS](https://angularjs.org/) brought data-binding, supposedly making updates simpler. The framework would set-up watchers that change the view when data changes. This would not work for async cases, so there was still some manual management of how changes should be reflected. It introduced many new concepts to me, but few of them were solutions to problems I actually had.

## React = (State) => View

What made React different, was that the abstraction it introduced, did not feel arbitrary but rather mapped to how I thought about my application's components and how they change. With other libraries you used to describe how a view should be mutated for every change in state, React only asks you to **declare** the view once, but in relation to its state. Put quasi-mathematically: the view is a function of its state. Put humanely: given any state, you could figure out what the Component looks like without replaying a series of mutations. This both makes it easier to have a mental model of your application and also eliminates a source of bugs: When you have to describe your view changes as a series of mutations, you will likely build mutations that implicitly depend on your UI being in a specific state / containing specific elements. So each new mutation you create might break an existing one. If you have a pattern that solves (being "really careful" is not a pattern), please reach out.

That's not the only differentiator React brought to the table. Another is JSX and that your code should be divided by responsibility, not by technology. That last part was a criticism of, among others, AngularJS (see [React announcement talk ](https://youtu.be/x7cQ3mrcKaY?t=251)). JSX is not a templating language, it is syntactic sugar over function calls (specifically [`React.createElement`](https://reactjs.org/docs/react-api.html#createelement)) and so all the control structures you use inside of it are just plain ol' JavaScript.
Arguably that idea was more divise. While the other popular frameworks after React are all declarative, most of them still use their own templating language (so does Svelte btw).

## ⚛️ React()

Next up: React in action. What the following Component does is display a text field and paragraph. The latter contains `"Hello "` concatenated with whatever you entered into the text field, or `"stranger"` if the field is empty.

```jsx
function App() {
  const [name, setName] = useState('');
  return (
    <>
      <input
        onChange={e => setName(e.target.value)}
        value={name}
        placeholder="enter your name"
      />
      <p>Hello {name || 'stranger'}!</p>
    </>
  );
}
```

*Source: [CodeSandbox](https://codesandbox.io/s/y7v5p1vllj) (Example implemented based on Svelte's list of examples)*

We are using `input` and `p` elements here, so the render target is the DOM. There would be a declarative way to write to the DOM: `innerHTML`. Using it would neither be fast nor [safe](https://en.wikipedia.org/wiki/Cross-site_scripting) (the React team wisely chose to make devs [jump through hoops](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml) if they want to use the attribute) and, once again, lose DOM-state. So React does NOT use `innerHTML` . Instead it figures out what specifically needs to change and then uses imperative DOM APIs (`createElement`, `setAttribute`, `textContent`,...) to apply those changes. A process known as [Reconciliation](https://reactjs.org/docs/reconciliation.html).

The first time the App-Component is rendered, it returns the following tree (I have stripped some properties that are not essential for this explanation):

```yaml
props:
  children:
  - type: "input"
    props:
      onChange: e => setName(e.target.value)
      value: ""
      placeholder: "enter your name"
  - type: "p"
    props:
      children:
      - "Hello "
      - "stranger"
      - "!"
```

This is sometimes called the "Virtual DOM". Since this is the first time the component is rendered, React will just create that tree as actual DOM nodes. So it would traverse this tree, creating the elements and setting their attributes.

What is React doing when a change occur? Imagine your name is Gregor (I have little imagination) and so you type the letter `G`. That triggers a chain of events:

1. The `onChange` listener fires and calls `setName`

2. `setName` changes the Component's state

3. The state change leads to React rerendering the Component

This is what the new tree looks like:

```yaml
props:
  children:
    - type: "input"
      props:
        onChange: e => setName(e.target.value)
        value: "G"
        placeholder: "enter your name"
    - type: "p"
      props:
        children:
          - "Hello "
          - "G"
          - "!"
```

It is relatively easy to visually spot what has changed, especially if you already have a mental model on how this Component works. But for React to notice the difference, it has to do traverse the tree again, comparing everything it finds with the tree it got from the previous render. So in this case it enumerates over, `type: "input"`, `onChange`, `value`, `placeholder`, `type: "p"`, `"Hello "`, `"G"` and `"!"` and compares all of them to their previous state. It then finds the changed nodes and in this case calls `inputNode.value = 'G'`  and `textNode.textContent = "G"`.
Note that we are only talking about the tree of one Component, this does not necessarily mean that a single change results in diffing of your whole app. But still, it is extra code that ships and runs with your app.

## svelte compile

The same example in Svelte:

```jsx
<input bind:value='name' placeholder='enter your name'>
<p>Hello {name || 'stranger'}!</p>
```

*Source: [Svelte REPL](https://v3.svelte.technology/repl?version=3.0.0-beta.10&demo=binding-input-text)*

On the surface level we can see that there is a lot less code here, due to data-binding in the form of  `bind:value` , which in this case combines state declaration and change listening.

But there is more to it, Svelte is not just a framework, it is also a compiler. And its compiler turns this component's template into several functions. One of them is `create`, which does what it says and creates your Component in its initial state. The more interesting one is `update` (you can inspect the output in the Svelte REPL, linked above):

```javascript
function update(changed, ctx) {
  if (changed.name) input.value = ctx.name;

  if (changed.name && text2_value !== (text2_value = ctx.name || "stranger")) {
    setData(text2, text2_value);
  }
}
```

Svelte figured out which change affects which part of the tree **at compile time**. Thus state changes will not result in runtime reconciliation, as it does in React (and many other frameworks). Additionally the resulting bundle will not have to include code for reconciliation. That does not necessarily mean that the resulting bundle will always be smaller, as Svelte effectively inlines reconciliation which could lead to larger bundle sizes as your app grows. But in terms of runtime cost, this could be considered a **zero-cost abstraction**.

As I wrote this, the history of frontend frameworks reminded me of the history of memory management in programming languages. Early languages required manual memory management (Assembly, C), and in the early frontend days there was manual DOM mutation management. In areas where performance was not critical, garbage-collected languages (Java, C#, JavaScript, Python,...) became popular, which reminds me of how React's Reconciliation freed us from having to manually mutate the DOM. The next step are languages that emphasize zero-cost abstractions (Rust, apparently C++). Now this is where the analogy breaks down, as Rust incurs a learning-curve cost, and Svelte does not.  
But this is coming from a guy who got most of his C++ knowledge from reading about Rust and his Assembly knowledge from playing [Human Resource Machine](https://www.youtube.com/watch?v=428R_oEjGGI), so maybe take this analogy with a grain of salt.

## Look Ahead

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">I personally think that 2018 will be the year that JavaScript frameworks start to become JavaScript compilers.<br><br>Here&#39;s a sneak peak at what we&#39;ve been working on in collaboration with the Prepack team: <a href="https://t.co/fQPM542RWB">https://t.co/fQPM542RWB</a></p>&mdash; Dominic Gannaway (@trueadm) <a href="https://twitter.com/trueadm/status/944908776896978946?ref_src=twsrc%5Etfw">December 24, 2017</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

The React team is already actively investigating precompiling React. And not in the sense in which it already is compiled (that is just JSX sugar extraction). Notably Facebook's [prepack](https://prepack.io) already [includes a compile-time React reconciler](https://github.com/facebook/prepack/wiki/React-Compiler#using-the-compiler-to-optimize-react-applications) (likely unstable, use at your own peril).

Other libraries seem to have been inspired by Svelte as well: [Stencil](https://stenciljs.com/) from Ionic, the new [Ivy](https://blog.angularindepth.com/inside-ivy-exploring-the-new-angular-compiler-ebf85141cee1) compiler for Angular. You can read more about it here: [Disappearing Frameworks](https://peteroshaughnessy.com/posts/disappearing-frameworks/).

Another thing the React team is investigating is perceived performance and I think this might be an area where they are still ahead of the curve. Their "recent" [rearchitecting efforts](https://github.com/acdlite/react-fiber-architecture) will make React apps more responsive even while heavy UI changes are happening. As a bonus it will make developers' lives easier when working with asynchronous code. If you want to see it in action, watch this talk:

`youtube: nLF0n9SACd4`

What lead me to write this, was learning about Rust and its powerful macro system. Macros "are a way of writing code that writes other code" and in the case of Rust, the generated code is not only syntactically correct, but also type-checked. I am curious if something like Svelte could be implemented using only macros, so please reach out to me if you have some thoughts on that.
