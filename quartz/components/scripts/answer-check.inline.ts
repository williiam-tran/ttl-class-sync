document.addEventListener('DOMContentLoaded', () => {
  const metaBindDataEl = document.querySelector('meta[name="meta-bind-data"]');
  if (!metaBindDataEl) return;
  
  function updateTestResults() {
    try {
      const metaBindData = JSON.parse(metaBindDataEl?.getAttribute('content') || '{}');
      let correctAnswers = metaBindData.answers || {};
      const userAnswers = window._quartzMetaBindCache?.user_answers || {};
      
      console.log('[TestResults] Initial correct answers:', correctAnswers);
      console.log('[TestResults] User answers:', userAnswers);
      
      // Look for embedded frontmatter
      const transclusions = document.querySelectorAll('blockquote.transclude');
      transclusions.forEach(transclude => {
        // Get the target URL
        const url = transclude.getAttribute('data-url');
        if (url && url.includes('Key')) {
          console.log('[TestResults] Found Key transclude, fetching frontmatter:', url);
          // Fetch the embedded file's frontmatter
          fetch(`/${url}/`)
            .then(response => response.text())
            .then(html => {
              // Extract frontmatter from meta tag
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = html;
              const embeddedMetaBindDataEl = tempDiv.querySelector('meta[name="meta-bind-data"]');
              
              if (embeddedMetaBindDataEl) {
                const embeddedMetaBindData = JSON.parse(embeddedMetaBindDataEl.getAttribute('content') || '{}');
                console.log('[TestResults] Embedded frontmatter:', embeddedMetaBindData);
                
                // Merge the embedded answers with existing answers
                if (embeddedMetaBindData.answers) {
                  correctAnswers = { ...correctAnswers, ...embeddedMetaBindData.answers };
                  console.log('[TestResults] Updated correct answers with embedded data:', correctAnswers);
                  
                  // Update the display after fetching embedded data
                  updateTestResultsDisplay(correctAnswers, userAnswers);
                }
              }
            })
            .catch(error => {
              console.error('[TestResults] Error fetching embedded frontmatter:', error);
            });
        }
      });
      
      // Initial update (will be overridden if embedded frontmatter is found)
      updateTestResultsDisplay(correctAnswers, userAnswers);
    } catch (error) {
      console.error('[TestResults] Error processing test results:', error);
      document.querySelectorAll('.test-results-container').forEach(container => {
        container.innerHTML = '<div class="test-results-error">Error processing test results.</div>';
      });
    }
  }
  
  // Separate function to update display (called both initially and after fetching embedded data)
  function updateTestResultsDisplay(correctAnswers: { [x: string]: string; }, userAnswers: Record<string, any>) {
    document.querySelectorAll('.test-results-container').forEach(container => {
      // If no answers, show message
      if (Object.keys(correctAnswers).length === 0) {
        container.innerHTML = '<div class="test-results-message">No answer data available in frontmatter.</div>';
        return;
      }
      
      // Get custom title if provided
      const title = container.getAttribute('data-title') || 'Answer Check';
      
      // Get filter if provided (comma-separated list of question numbers)
      // Examples: 
      // - "31,32,33" - Will filter to only show questions 31, 32, 33
      // - "q31,q32,q33" - Will also work with prefixed question numbers
      const filter = container.getAttribute('data-filter');
      const filterQuestions = filter ? filter.split(',').map(q => q.trim()) : null;
      
      // Create results table
      let html = `<h3>${title}</h3>`;
      html += '<table class="test-results-table"><thead><tr><th>Question</th><th>Your Answer</th><th>Correct Answer</th><th>Status</th></tr></thead><tbody>';
      
      let score = 0;
      let questionKeys = Object.keys(correctAnswers).sort();
      
      // Apply filter if provided
      if (filterQuestions) {
        questionKeys = questionKeys.filter(key => {
          // Match exact keys or just the number part
          return filterQuestions.includes(key) || filterQuestions.includes(key.replace(/[^0-9]/g, ''));
        });
      }
      
      questionKeys.forEach(key => {
        const userAnswer = userAnswers[key] || '';
        const correctAnswer = correctAnswers[key] || '';
        
        const isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toString().toLowerCase().trim();
        if (isCorrect) score++;
        
        const statusClass = isCorrect ? 'correct' : 'incorrect';
        const statusText = isCorrect ? '✅ Correct' : '❌ Incorrect';
        
        // Extract the number part for display (strip any non-numeric prefix)
        const questionNumber = key.replace(/[^0-9]/g, '');
        
        html += `<tr>
          <td>Q${questionNumber}</td>
          <td>${userAnswer || '-'}</td>
          <td>${correctAnswer}</td>
          <td class="test-results-status ${statusClass}">${statusText}</td>
        </tr>`;
      });
      
      html += '</tbody></table>';
      
      html += `<div class="test-results-score">Total Score: <strong>${score} / ${questionKeys.length}</strong></div>`;
      
      container.innerHTML = html;
    });
  }
  
  // Initial update
  updateTestResults();
  
  // Listen for input events on the document to catch any MetaBind input changes
  document.addEventListener('input', (e) => {
    if (e.target instanceof HTMLInputElement) {
      const parent = e.target.closest('.meta-bind-input, .meta-bind-inline-input');
      if (parent && parent.getAttribute('data-bind-target')?.startsWith('user_answers.')) {
        // If this is a user_answers input, update the test results
        setTimeout(updateTestResults, 50); // Small delay to ensure the cache is updated
      }
    }
  });
});
