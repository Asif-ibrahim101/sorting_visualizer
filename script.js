let array = [];
const arraySize = 50;
let sorting = false;
let speed = 50;
let comparisons = 0;
let swaps = 0;
let chart;

function initArray() {
    array = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 1);
    updateChart();
    updateInfo();
}

function updateChart() {
    if (chart) {
        chart.data.datasets[0].data = array;
        chart.update();
    } else {
        const ctx = document.getElementById('myChart').getContext('2d');
        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Array.from(Array(arraySize).keys()),
                datasets: [{
                    data: array,
                    backgroundColor: 'rgba(54, 162, 235, 0.8)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                animation: {
                    duration: speed
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

function updateInfo() {
    document.getElementById('arraySize').textContent = array.length;
    document.getElementById('comparisons').textContent = comparisons;
    document.getElementById('swaps').textContent = swaps;
}

function updateSpeed() {
    speed = 101 - document.getElementById('speedSlider').value;
    document.getElementById('speed-value').textContent = `Speed: ${speed}ms`;
    if (chart) {
        chart.options.animation.duration = speed;
    }
}

async function startSort() {
    if (sorting) return;
    sorting = true;
    comparisons = 0;
    swaps = 0;
    const algorithm = document.getElementById('algorithmSelect').value;
    await window[algorithm]();
    sorting = false;
}

async function swap(i, j) {
    await new Promise(resolve => setTimeout(resolve, speed));
    [array[i], array[j]] = [array[j], array[i]];
    swaps++;
    updateChart();
    updateInfo();
}

async function compare(i, j) {
    comparisons++;
    updateInfo();
    return array[i] > array[j];
}

async function bubbleSort() {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (await compare(j, j + 1)) {
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
            if (await compare(minIdx, j)) {
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
        while (j >= 0 && await compare(j, j + 1)) {
            array[j + 1] = array[j];
            j--;
            await new Promise(resolve => setTimeout(resolve, speed));
            updateChart();
        }
        array[j + 1] = key;
        updateChart();
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
        if (await compare(high, j)) {
            i++;
            await swap(i, j);
        }
    }
    await swap(i + 1, high);
    return i + 1;
}

// Initialize array on page load
initArray();