document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.querySelector('.chat-wysiwyg-input__box');
    const chatInput = chatBox.querySelector('[data-a-target="chat-input"]');
    // При фокусе на инпуте
    chatInput.addEventListener('focus', () => {
        chatBox.classList.add('focused');
        chatBox.classList.remove('empty'); // Удаляем класс empty, если он был
    });
    // При потере фокуса
    chatInput.addEventListener('blur', () => {
        // Проверяем, пустой ли инпут
        const text = chatInput.textContent.trim();
        if (text === '' || text === chatInput.getAttribute('data-placeholder')) {
            chatBox.classList.add('empty');
            chatBox.classList.remove('focused');
        }
    });
    // При изменении содержимого
    chatInput.addEventListener('input', () => {
        const text = chatInput.textContent.trim();
        if (text === '' || text === chatInput.getAttribute('data-placeholder')) {
            chatBox.classList.add('empty');
        }
        else {
            chatBox.classList.remove('empty');
        }
    });
});
//# sourceMappingURL=chat_input__editor_autoHeight.js.map