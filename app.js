// State management
let selectedFile = null;
let uploadProgress = 0;
let isUploading = false;

// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const generateBtn = document.getElementById('generateBtn');
const submitBtn = document.getElementById('submitBtn');
const fileNameDisplay = document.getElementById('fileNameDisplay');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');

// Accepted file types
const acceptedTypes = ['pdf', 'docx', 'txt', 'csv'];

// Initialize
function init() {
    setupEventListeners();
    updateButtonStates();
}

// Setup all event listeners
function setupEventListeners() {
    // Upload area click
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    // File input change
    fileInput.addEventListener('change', handleFileSelect);

    // Drag and drop events
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);

    // Button clicks
    uploadBtn.addEventListener('click', handleUpload);
    generateBtn.addEventListener('click', handleGenerateReport);
    submitBtn.addEventListener('click', handleSubmit);

    // History items click
    const historyItems = document.querySelectorAll('.history-item');
    historyItems.forEach(item => {
        item.addEventListener('click', () => {
            const filename = item.querySelector('.history-filename').textContent;
            showNotification(`Opening ${filename}...`);
        });
    });
}

// Handle file selection
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        validateAndSetFile(file);
    }
}

// Handle drag over
function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    uploadArea.classList.add('drag-over');
}

// Handle drag leave
function handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    uploadArea.classList.remove('drag-over');
}

// Handle drop
function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    uploadArea.classList.remove('drag-over');

    const files = event.dataTransfer.files;
    if (files.length > 0) {
        validateAndSetFile(files[0]);
    }
}

// Validate and set file
function validateAndSetFile(file) {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (acceptedTypes.includes(fileExtension)) {
        selectedFile = file;
        fileNameDisplay.textContent = `Selected: ${file.name}`;
        updateButtonStates();
        showNotification(`File selected: ${file.name}`, 'success');
    } else {
        showNotification(`Invalid file type. Please select: ${acceptedTypes.join(', ').toUpperCase()}`, 'error');
        fileNameDisplay.textContent = '';
        selectedFile = null;
        updateButtonStates();
    }
}

// Handle upload
function handleUpload() {
    if (!selectedFile || isUploading) return;

    isUploading = true;
    updateButtonStates();
    showNotification('Uploading file...', 'info');

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            isUploading = false;
            updateButtonStates();
            showNotification('Upload complete!', 'success');
        }
        updateProgress(Math.min(progress, 100));
    }, 200);
}

// Update progress
function updateProgress(percent) {
    uploadProgress = Math.round(percent);
    progressText.textContent = `${uploadProgress}%`;
    
    // Calculate stroke-dashoffset (314 is approximately 2 * PI * 50)
    const offset = 314 - (314 * uploadProgress) / 100;
    progressBar.style.strokeDashoffset = offset;
}

// Handle generate report
function handleGenerateReport() {
    if (uploadProgress < 100) {
        showNotification('Please upload a file first!', 'error');
        return;
    }

    showNotification('Generating report...', 'info');
    
    // Simulate report generation
    setTimeout(() => {
        showNotification('Report generated successfully!', 'success');
    }, 1500);
}

// Handle submit
function handleSubmit() {
    if (!selectedFile) {
        showNotification('Please select a file first!', 'error');
        return;
    }

    if (uploadProgress < 100) {
        showNotification('Please upload the file first!', 'error');
        return;
    }

    showNotification('Form submitted successfully!', 'success');
    
    // Reset form after submission
    setTimeout(() => {
        resetForm();
    }, 2000);
}

// Update button states
function updateButtonStates() {
    uploadBtn.disabled = !selectedFile || isUploading;
    generateBtn.disabled = uploadProgress < 100;
}

// Reset form
function resetForm() {
    selectedFile = null;
    uploadProgress = 0;
    isUploading = false;
    fileNameDisplay.textContent = '';
    fileInput.value = '';
    updateProgress(0);
    updateButtonStates();
    showNotification('Form reset', 'info');
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#2563EB'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}