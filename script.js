const imageUploader = document.getElementById("imageUploader");
const originalCanvas = document.getElementById("originalCanvas");
const editedCanvas = document.getElementById("editedCanvas");
const ctxOriginal = originalCanvas.getContext("2d");
const ctxEdited = editedCanvas.getContext("2d");

imageUploader.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const img = new Image();
        img.onload = () => {
            originalCanvas.width = img.width;
            originalCanvas.height = img.height;
            editedCanvas.width = img.width;
            editedCanvas.height = img.height;

            ctxOriginal.drawImage(img, 0, 0);
        };
        img.src = URL.createObjectURL(file);
    }
});

const MAX_BOX_SIZE = 500;

imageUploader.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const img = new Image();
        img.onload = () => {
            const scale = Math.min(MAX_BOX_SIZE / img.width, MAX_BOX_SIZE / img.height);

            const displayWidth = img.width * scale;
            const displayHeight = img.height * scale;

            originalCanvas.width = displayWidth;
            originalCanvas.height = displayHeight;
            editedCanvas.width = displayWidth;
            editedCanvas.height = displayHeight;

            ctxOriginal.drawImage(img, 0, 0, displayWidth, displayHeight);
        };
        img.src = URL.createObjectURL(file);
    }
});


document.getElementById("convertGrayscale").addEventListener("click", () => {
    const imageData = ctxOriginal.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = data[i + 1] = data[i + 2] = avg;
    }

    ctxEdited.putImageData(imageData, 0, 0);
});

document.getElementById("convertBlur").addEventListener("click", () => {
    const imageData = ctxOriginal.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
    const data = imageData.data;
    const kernel = [1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9];

    for (let y = 1; y < originalCanvas.height - 1; y++) {
        for (let x = 1; x < originalCanvas.width - 1; x++) {
            let r = 0, g = 0, b = 0;
            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const pixelIndex = ((y + ky) * originalCanvas.width + (x + kx)) * 4;
                    const weight = kernel[(ky + 1) * 3 + (kx + 1)];

                    r += data[pixelIndex] * weight;
                    g += data[pixelIndex + 1] * weight;
                    b += data[pixelIndex + 2] * weight;
                }
            }

            const newIndex = (y * originalCanvas.width + x) * 4;
            data[newIndex] = r;
            data[newIndex + 1] = g;
            data[newIndex + 2] = b;
        }
    }

    ctxEdited.putImageData(imageData, 0, 0);
});
