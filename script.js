let array = [];
let speed = 200;

const barsContainer = document.getElementById("bars");
const sizeSlider = document.getElementById("size");
const speedSlider = document.getElementById("speed");

speedSlider.oninput = () => {
  speed = speedSlider.value;
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generateBars() {
  array = [];
  barsContainer.innerHTML = "";
  const size = sizeSlider.value;
  for (let i = 0; i < size; i++) {
    array.push(Math.floor(Math.random() * 400) + 20);
  }
  drawBars();
}

function setCustomArray() {
  const input = document.getElementById("arrayInput").value;
  if (!input) return alert("Enter comma-separated numbers!");
  array = input.split(",").map(Number).filter(n => !isNaN(n));
  barsContainer.innerHTML = "";
  drawBars();
}

function drawBars() {
  barsContainer.innerHTML = "";
  const barWidth = Math.max(5, 600 / array.length); // auto adjust
  for (let val of array) {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${val}px`;
    bar.style.width = `${barWidth}px`;
    barsContainer.appendChild(bar);
  }
}

async function swap(i, j) {
  const bars = document.getElementsByClassName("bar");
  bars[i].style.background = "red";
  bars[j].style.background = "red";
  await sleep(speed);
  [array[i], array[j]] = [array[j], array[i]];
  bars[i].style.height = `${array[i]}px`;
  bars[j].style.height = `${array[j]}px`;
  bars[i].style.background = "#ff007f";
  bars[j].style.background = "#ff007f";
}

function markSorted(index) {
  const bars = document.getElementsByClassName("bar");
  bars[index].style.background = "green";
}

// Sorting Algorithms
async function bubbleSort() {
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      const bars = document.getElementsByClassName("bar");
      bars[j].style.background = "yellow";
      bars[j + 1].style.background = "yellow";
      if (array[j] > array[j + 1]) {
        await swap(j, j + 1);
      }
      bars[j].style.background = "#ff007f";
      bars[j + 1].style.background = "#ff007f";
    }
    markSorted(n - i - 1);
  }
  markSorted(0);
}

async function selectionSort() {
  const n = array.length;
  for (let i = 0; i < n; i++) {
    let min = i;
    for (let j = i + 1; j < n; j++) {
      const bars = document.getElementsByClassName("bar");
      bars[j].style.background = "yellow";
      if (array[j] < array[min]) min = j;
      await sleep(speed / 2);
      bars[j].style.background = "#ff007f";
    }
    if (min !== i) await swap(i, min);
    markSorted(i);
  }
}

async function insertionSort() {
  const n = array.length;
  const bars = document.getElementsByClassName("bar");
  for (let i = 1; i < n; i++) {
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      bars[j + 1].style.height = `${array[j]}px`;
      array[j + 1] = array[j];
      j--;
      await sleep(speed);
    }
    array[j + 1] = key;
    bars[j + 1].style.height = `${key}px`;
    bars[i].style.background = "green";
  }
}

async function mergeSortHandler() {
  await mergeSort(0, array.length - 1);
}
async function mergeSort(l, r) {
  if (l >= r) return;
  let m = Math.floor((l + r) / 2);
  await mergeSort(l, m);
  await mergeSort(m + 1, r);
  await merge(l, m, r);
}
async function merge(l, m, r) {
  let left = array.slice(l, m + 1);
  let right = array.slice(m + 1, r + 1);
  let i = 0, j = 0, k = l;
  const bars = document.getElementsByClassName("bar");
  while (i < left.length && j < right.length) {
    bars[k].style.background = "yellow";
    if (left[i] <= right[j]) {
      array[k] = left[i];
      bars[k].style.height = `${left[i]}px`;
      i++;
    } else {
      array[k] = right[j];
      bars[k].style.height = `${right[j]}px`;
      j++;
    }
    k++;
    await sleep(speed);
    bars[k - 1].style.background = "#ff007f";
  }
  while (i < left.length) {
    array[k] = left[i];
    bars[k].style.height = `${left[i]}px`;
    i++; k++;
    await sleep(speed);
  }
  while (j < right.length) {
    array[k] = right[j];
    bars[k].style.height = `${right[j]}px`;
    j++; k++;
    await sleep(speed);
  }
}

async function quickSortHandler() {
  await quickSort(0, array.length - 1);
}
async function quickSort(low, high) {
  if (low < high) {
    let pi = await partition(low, high);
    await quickSort(low, pi - 1);
    await quickSort(pi + 1, high);
  }
}
async function partition(low, high) {
  let pivot = array[high];
  let i = low - 1;
  const bars = document.getElementsByClassName("bar");
  for (let j = low; j < high; j++) {
    bars[j].style.background = "yellow";
    if (array[j] < pivot) {
      i++;
      await swap(i, j);
    }
    bars[j].style.background = "#ff007f";
  }
  await swap(i + 1, high);
  return i + 1;
}

async function heapSort() {
  let n = array.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(n, i);
  }
  for (let i = n - 1; i > 0; i--) {
    await swap(0, i);
    markSorted(i);
    await heapify(i, 0);
  }
  markSorted(0);
}
async function heapify(n, i) {
  let largest = i;
  let l = 2 * i + 1;
  let r = 2 * i + 2;
  if (l < n && array[l] > array[largest]) largest = l;
  if (r < n && array[r] > array[largest]) largest = r;
  if (largest !== i) {
    await swap(i, largest);
    await heapify(n, largest);
  }
}

generateBars();
