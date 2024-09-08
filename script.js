let array = [];
const arraySize = 50;
let sorting = false;

function initArray() {
    array = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 1);
    displayArray();
}

function displayArray() {
    const container = document.getElementById('container');
    container.innerHTML = '';
    array.forEach(value => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${value * 3}px`;
        container.appendChild(bar);
    });
}

async function startSort() {
    if (sorting) return;
    sorting = true;
    const algorithm = document.getElementById('algorithmSelect').value;
    await window[algorithm]();
    sorting = false;
}

async function swap(i, j) {
    await new Promise(resolve => setTimeout(resolve, 50));
    [array[i], array[j]] = [array[j], array[i]];
    displayArray();
}

async function bubbleSort() {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                await swap(j, j + 1);
            }
        }
    }
}

async function selectionSort() {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            if (array[j] < array[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
            await swap(i, minIdx);
        }
    }
}

async function insertionSort() {
    const n = array.length;
    for (let i = 1; i < n; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            j--;
            await new Promise(resolve => setTimeout(resolve, 50));
            displayArray();
        }
        array[j + 1] = key;
        displayArray();
    }
}

async function quickSort(low = 0, high = array.length - 1) {
    if (low < high) {
        const pi = await partition(low, high);
        await quickSort(low, pi - 1);
        await quickSort(pi + 1, high);
    }
}

async function partition(low, high) {
    const pivot = array[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        if (array[j] < pivot) {
            i++;
            await swap(i, j);
        }
    }
    await swap(i + 1, high);
    return i + 1;
}

// Initialize array on page load
initArray();