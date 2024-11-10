// Structure to store responses
let responses = {};

// Load saved responses when the page loads
function loadSavedResponses() {
    const savedResponses = localStorage.getItem('examinationResponses');
    if (savedResponses) {
        responses = JSON.parse(savedResponses);
        
        // Apply saved responses to UI
        Object.keys(responses).forEach(questionId => {
            const response = responses[questionId];
            const card = document.getElementById(`card-${questionId}`);
            if (card) {
                const detailsBox = document.getElementById(`details-${questionId}`);
                const buttons = card.querySelector('.button-group').children;
                
                // Update button states
                buttons[0].classList.toggle('selected', response.hasSinned);
                buttons[0].classList.toggle('unselected', !response.hasSinned);
                buttons[1].classList.toggle('selected', !response.hasSinned);
                buttons[1].classList.toggle('unselected', response.hasSinned);

                // Update card styling
                card.classList.remove('sinned', 'not-sinned');
                card.classList.add(response.hasSinned ? 'sinned' : 'not-sinned');

                // Show/hide and fill details box
                if (response.hasSinned) {
                    detailsBox.classList.add('show');
                    detailsBox.querySelector('textarea').value = response.details || '';
                }

                // Reorder the card
                const section = card.closest('.section');
                const questionsContainer = section.querySelector('.questions-container');
                if (response.hasSinned) {
                    questionsContainer.insertBefore(card, questionsContainer.firstChild);
                } else {
                    questionsContainer.appendChild(card);
                }
            }
        });
    }
}

function createQuestionCard(question) {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.id = `card-${question.id}`;
    card.innerHTML = `
        <div class="question-text">${question.text}</div>
        <div class="button-group">
            <button class="btn btn-sinned" onclick="handleResponse('${question.id}', true, this)">Sinned</button>
            <button class="btn btn-not-sinned" onclick="handleResponse('${question.id}', false, this)">Not Sinned</button>
        </div>
        <div class="details-box" id="details-${question.id}">
            <textarea 
                placeholder="Please provide details about this sin (frequency, circumstances, etc.)"
                onchange="handleDetailsChange('${question.id}', this.value)"
            ></textarea>
        </div>
    `;
    return card;
}

function handleResponse(questionId, hasSinned, clickedButton) {
    const card = document.getElementById(`card-${questionId}`);
    const detailsBox = document.getElementById(`details-${questionId}`);
    const buttonGroup = clickedButton.parentElement;
    const buttons = buttonGroup.children;
    const section = card.closest('.section');
    const questionsContainer = section.querySelector('.questions-container');
    
    // Update button states
    buttons[0].classList.toggle('selected', hasSinned);
    buttons[0].classList.toggle('unselected', !hasSinned);
    buttons[1].classList.toggle('selected', !hasSinned);
    buttons[1].classList.toggle('unselected', hasSinned);

    // Update card styling
    card.classList.remove('sinned', 'not-sinned');
    card.classList.add(hasSinned ? 'sinned' : 'not-sinned');

    // Show/hide details box
    detailsBox.classList.toggle('show', hasSinned);

    // Reorder the card
    if (hasSinned) {
        questionsContainer.insertBefore(card, questionsContainer.firstChild);
    } else {
        questionsContainer.appendChild(card);
    }

    // Save to localStorage
    responses[questionId] = {
        hasSinned,
        details: detailsBox.querySelector('textarea').value
    };
    localStorage.setItem('examinationResponses', JSON.stringify(responses));
}

function handleDetailsChange(questionId, details) {
    responses[questionId] = {
        ...responses[questionId],
        details
    };
    localStorage.setItem('examinationResponses', JSON.stringify(responses));
}

// Add clear responses function
function clearResponses() {
    localStorage.removeItem('examinationResponses');
    responses = {};
    location.reload(); // Reload the page to reset the UI
}

// Initialize sections
questions.responsibilitiesToGod.forEach(question => {
    document.querySelector('#responsibilities-to-god .questions-container')
        .appendChild(createQuestionCard(question));
});

questions.responsibilitiesToOthers.forEach(question => {
    document.querySelector('#responsibilities-to-others .questions-container')
        .appendChild(createQuestionCard(question));
});

// Add clear button to UI
const clearButton = document.createElement('button');
clearButton.className = 'btn';
clearButton.style.cssText = 'background-color: #6b7280; color: white; margin: 20px auto; display: block;';
clearButton.textContent = 'Clear All Responses';
clearButton.onclick = clearResponses;
document.querySelector('.container').appendChild(clearButton);

// Load saved responses when page loads
loadSavedResponses();