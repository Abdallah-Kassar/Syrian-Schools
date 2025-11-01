const canvas = document.getElementById("scoreChart");
const ctx = canvas.getContext("2d");

const data = {
    Total: { public: 72, private: 86 },
    Math: { public: 68, private: 90 },
    Physics: { public: 65, private: 84 }
};

const colors = {
    public: "#6a8caf",  
    private: "#dba39a"  
};

const chart = {
    xStart: 100,
    yStart: 350,
    chartHeight: 250,
    barWidth: 100,
    maxScore: Math.ceil(Math.max(...Object.values(data)
        .flatMap(s => [s.public, s.private])) / 10) * 10
};

const metricsStep = 20; 

let animationFrame;
let currentSubject = "Total";
let animationProgress = 0;

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function drawChart(subject, progress = 1) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const scores = data[subject];
    const labels = ["Public Schools", "Private Schools"];
    const values = [scores.public, scores.private];
    const colorValues = [colors.public, colors.private];

    // Title
    ctx.font = "20px Arial";
    ctx.fillStyle = "#222";
    ctx.fillText(`${subject} Scores`, 290, 40);

    // Axes
    ctx.beginPath();
    ctx.moveTo(chart.xStart, 50);
    ctx.lineTo(chart.xStart, chart.yStart);
    ctx.lineTo(600, chart.yStart);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Y-axis labels + gridlines
    ctx.fillStyle = "#333";
    ctx.font = "14px Arial";
    for (let yVal = 0; yVal <= chart.maxScore; yVal += metricsStep) {
        const y = chart.yStart - (yVal / chart.maxScore) * chart.chartHeight;
        ctx.fillText(yVal + "%", chart.xStart - 40, y + 5);

        ctx.beginPath();
        ctx.moveTo(chart.xStart - 5, y);
        ctx.lineTo(600, y);
        ctx.strokeStyle = "#e0e0e0";
        ctx.lineWidth = 0.7;
        ctx.stroke();
    }

    // Bars
    for (let i = 0; i < values.length; i++) {
        const barHeight = (values[i] / chart.maxScore) * chart.chartHeight * progress;
        const x = 180 + i * (chart.barWidth + 120);
        const y = chart.yStart - barHeight;

        ctx.fillStyle = colorValues[i];
        ctx.fillRect(x, y, chart.barWidth, barHeight);

        // Labels below bars
        ctx.fillStyle = "#000";
        ctx.font = "15px Arial";
        ctx.fillText(labels[i], x - 10, chart.yStart + 25);

        ctx.font = "15px Arial";
        ctx.fillText(Math.round(values[i] * progress) + "%", x + 30, y - 10);
    }
}

function animateChart(subject) {
    cancelAnimationFrame(animationFrame);
    animationProgress = 0;

    function step() {
        animationProgress += 0.05; // faster speed
        if (animationProgress > 1) animationProgress = 1;
        const easedProgress = easeOutCubic(animationProgress);
        drawChart(subject, easedProgress);
        if (animationProgress < 1) animationFrame = requestAnimationFrame(step);
    }
    step();
}

function updateChart(subject) {
    currentSubject = subject;
    chart.maxScore = Math.ceil(Math.max(...Object.values(data)
        .flatMap(s => [s.public, s.private])) / 10) * 10;
    animateChart(subject);
}

// Initial draw
drawChart(currentSubject);