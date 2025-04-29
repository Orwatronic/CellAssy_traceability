// Configuration
const CONFIG = {
    PIN: '1234', // Change this to your desired PIN
    GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwkoLvRa9acRYfwnOlz7fLcbe453xBF4-ntOIJZbaR2T4pttURzuHen593_DC5hpiwLcg/exec'
};

// DOM Elements
const pinScreen = document.getElementById('pinScreen');
const mainScreen = document.getElementById('mainScreen');
const pinInput = document.getElementById('pinInput');
const pinError = document.getElementById('pinError');
const parameterForm = document.getElementById('parameterForm');
const submitStatus = document.getElementById('submitStatus');
const scanResult = document.getElementById('scanResult');

// QR Code Scanner
let html5QrCode = null;
let scannedCode = null;

// Initialize the app
function init() {
    // Check if PIN is already set
    const savedPin = localStorage.getItem('appPin');
    if (savedPin === CONFIG.PIN) {
        showMainScreen();
    }
}

// PIN Validation
pinInput.addEventListener('input', (e) => {
    if (e.target.value.length === 4) {
        if (e.target.value === CONFIG.PIN) {
            localStorage.setItem('appPin', CONFIG.PIN);
            showMainScreen();
        } else {
            pinError.textContent = 'Incorrect PIN. Please try again.';
            e.target.value = '';
        }
    } else {
        pinError.textContent = '';
    }
});

// Show main screen and initialize scanner
function showMainScreen() {
    pinScreen.classList.add('hidden');
    mainScreen.classList.remove('hidden');
    initScanner();
}

// Initialize QR Code Scanner
function initScanner() {
    html5QrCode = new Html5Qrcode("reader");
    const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
    };

    html5QrCode.start(
        { facingMode: "environment" },
        config,
        onScanSuccess,
        onScanFailure
    );
}

// Handle successful scan
function onScanSuccess(decodedText) {
    if (!scannedCode) {
        scannedCode = decodedText;
        scanResult.textContent = `Scanned: ${decodedText}`;
        html5QrCode.stop();
    }
}

// Handle scan failure
function onScanFailure(error) {
    // Ignore errors during scanning
    console.warn(`QR Code scan error: ${error}`);
}

// Form Submission
parameterForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!scannedCode) {
        showStatus('Please scan a QR code first', 'error');
        return;
    }

    const formData = {
        code: scannedCode,
        voltage: document.getElementById('voltage').value,
        temperature: document.getElementById('temperature').value,
        notes: document.getElementById('notes').value,
        timestamp: new Date().toISOString()
    };

    try {
        console.log('Sending data:', formData);
        const response = await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Origin': window.location.origin
            },
            body: JSON.stringify(formData)
        });

        console.log('Response status:', response.status);
        const responseText = await response.text();
        console.log('Response text:', responseText);

        if (response.ok) {
            showStatus('Data submitted successfully!', 'success');
            resetForm();
        } else {
            throw new Error(`Server responded with status ${response.status}: ${responseText}`);
        }
    } catch (error) {
        console.error('Detailed error:', error);
        showStatus(`Error submitting data: ${error.message}`, 'error');
    }
});

// Show status message
function showStatus(message, type) {
    submitStatus.textContent = message;
    submitStatus.className = `submit-status ${type}`;
    setTimeout(() => {
        submitStatus.textContent = '';
        submitStatus.className = 'submit-status';
    }, 3000);
}

// Reset form and scanner
function resetForm() {
    parameterForm.reset();
    scannedCode = null;
    scanResult.textContent = '';
    initScanner();
}

// Initialize the app
init();
