// Прогресс-бар при заполнении полей
const formInputs = document.querySelectorAll('.form-gr input, .form-gr input[name="story"], .file-wrapper input[type="file"]');
const progressFill = document.querySelector('.progress-fill');

function updateFormProgress() {
    let filled = 0;
    let total = formInputs.length;
    
    formInputs.forEach(input => {
        if (input.type === 'file') {
            if (input.files.length > 0) filled++;
        } else if (input.tagName === 'INPUT' && input.value.trim() !== '') {
            filled++;
        }
    });
    
    let percent = (filled / total) * 100;
    if (progressFill) {
        progressFill.style.width = percent + '%';
    }
}

// Добавляем обработчики на все поля
formInputs.forEach(input => {
    if (input.type === 'file') {
        input.addEventListener('change', updateFormProgress);
    } else {
        input.addEventListener('input', updateFormProgress);
    }
});

// Вызываем функцию при загрузке страницы
document.addEventListener('DOMContentLoaded', updateFormProgress);


const fileInput = document.getElementById('photoInput');
const fileNameSpan = document.getElementById('fileName');

fileInput.addEventListener('change', function() {
    if (this.files && this.files[0]) {
        fileNameSpan.textContent = this.files[0].name;  // ← показывает имя файла
    } else {
        fileNameSpan.textContent = 'Выберите файл';
    }
});