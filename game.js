window.onload = function() {
    const canvas = document.getElementById("pong");
    const ctx = canvas.getContext("2d");

    const paddleWidth = 10, paddleHeight = 100, paddleMargin = 20;
    const ballSize = 14;
    const canvasWidth = canvas.width, canvasHeight = canvas.height;

    const leftPaddle = {
        x: paddleMargin,
        y: (canvasHeight - paddleHeight) / 2,
        width: paddleWidth,
        height: paddleHeight,
        speed: 10
    };
    const rightPaddle = {
        x: canvasWidth - paddleMargin - paddleWidth,
        y: (canvasHeight - paddleHeight) / 2,
        width: paddleWidth,
        height: paddleHeight,
        speed: 5
    };
    const ball = {
        x: canvasWidth / 2 - ballSize / 2,
        y: canvasHeight / 2 - ballSize / 2,
        size: ballSize,
        speedX: 6 * (Math.random() > 0.5 ? 1 : -1),
        speedY: 4 * (Math.random() > 0.5 ? 1 : -1)
    };

    // Mouse controls for left paddle
    canvas.addEventListener("mousemove", function (e) {
        const rect = canvas.getBoundingClientRect();
        let mouseY = e.clientY - rect.top;
        leftPaddle.y = mouseY - leftPaddle.height / 2;
        if (leftPaddle.y < 0) leftPaddle.y = 0;
        if (leftPaddle.y + leftPaddle.height > canvasHeight) leftPaddle.y = canvasHeight - leftPaddle.height;
    });

    function drawRect(x, y, w, h, color="#fff") {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
    }
    function drawBall(x, y, size, color="#fff") {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
    }

    function draw() {
        drawRect(0, 0, canvasWidth, canvasHeight, "#222");
        for(let i = 0; i < canvasHeight; i += 30) {
            drawRect(canvasWidth / 2 - 2, i, 4, 18, "#444");
        }
        drawRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height, "#fff");
        drawRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height, "#fff");
        drawBall(ball.x, ball.y, ball.size, "#fff");
    }

    function update() {
        ball.x += ball.speedX;
        ball.y += ball.speedY;

        if (ball.y < 0) {
            ball.y = 0;
            ball.speedY *= -1;
        } else if (ball.y + ball.size > canvasHeight) {
            ball.y = canvasHeight - ball.size;
            ball.speedY *= -1;
        }

        // Left paddle collision
        if (
            ball.x < leftPaddle.x + leftPaddle.width &&
            ball.x + ball.size > leftPaddle.x &&
            ball.y < leftPaddle.y + leftPaddle.height &&
            ball.y + ball.size > leftPaddle.y
        ) {
            ball.x = leftPaddle.x + leftPaddle.width;
            ball.speedX *= -1;
            let collidePoint = (ball.y + ball.size/2) - (leftPaddle.y + leftPaddle.height/2);
            collidePoint = collidePoint / (leftPaddle.height/2);
            ball.speedY = collidePoint * 5;
        }

        // Right paddle collision
        if (
            ball.x + ball.size > rightPaddle.x &&
            ball.x < rightPaddle.x + rightPaddle.width &&
            ball.y < rightPaddle.y + rightPaddle.height &&
            ball.y + ball.size > rightPaddle.y
        ) {
            ball.x = rightPaddle.x - ball.size;
            ball.speedX *= -1;
            let collidePoint = (ball.y + ball.size/2) - (rightPaddle.y + rightPaddle.height/2);
            collidePoint = collidePoint / (rightPaddle.height/2);
            ball.speedY = collidePoint * 5;
        }

        // Ball out of bounds
        if (ball.x < 0 || ball.x + ball.size > canvasWidth) {
            ball.x = canvasWidth / 2 - ball.size / 2;
            ball.y = canvasHeight / 2 - ball.size / 2;
            ball.speedX = 6 * (Math.random() > 0.5 ? 1 : -1);
            ball.speedY = 4 * (Math.random() > 0.5 ? 1 : -1);
        }

        // AI paddle
        let targetY = ball.y + ball.size/2 - rightPaddle.height/2;
        if (rightPaddle.y < targetY) {
            rightPaddle.y += rightPaddle.speed;
            if (rightPaddle.y > targetY) rightPaddle.y = targetY;
        } else if (rightPaddle.y > targetY) {
            rightPaddle.y -= rightPaddle.speed;
            if (rightPaddle.y < targetY) rightPaddle.y = targetY;
        }
        if (rightPaddle.y < 0) rightPaddle.y = 0;
        if (rightPaddle.y + rightPaddle.height > canvasHeight) rightPaddle.y = canvasHeight - rightPaddle.height;
    }

    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
    gameLoop();
};