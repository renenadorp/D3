---
title: Timelines

theme: deep-space
toc: false
sidebar: true
---


```js
import * as d3 from "npm:d3";

const xlsxfile = view(Inputs.file({label: "Excel file", accept: ".xlsx", required: true}));
```

```js
let wb = xlsxfile.xlsx()
```


```js
wb
```

```js
var first_sheet = wb.sheet(wb.sheetNames[0]);
```

```js
first_sheet
```

```jsx
function Greeting({subject}) {
  return <div>Hello, <b>{subject}</b>!</div>
}
```
```jsx
display(<Greeting subject="JSX" />);
```


```jsx
function Counter() {
  const [count, setCount] = React.useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      You clicked {count} times
    </button>
  );
}

```
```jsx
display(<Counter />)

```