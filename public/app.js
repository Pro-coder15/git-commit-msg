// git-commit-generator/public/app.js

document.getElementById('generate').addEventListener('click', async () => {
    const inputContent = document.getElementById('input').value;
    const category = document.getElementById('category').value;
    const container = document.getElementById('results');
    container.innerHTML = 'Generating...';
    
    // Determine if the content looks like a diff (multi-line) or text (single line/short)
    const isDiff = inputContent.includes('\n') || inputContent.startsWith('diff');
    
    try {
        const res = await fetch('/generate', { 
            method: 'POST', 
            headers: {'Content-Type':'application/json'}, 
            body: JSON.stringify({ 
                diff: isDiff ? inputContent : null,
                text: isDiff ? null : inputContent, 
                category 
            }) 
        });
        
        const json = await res.json();
        container.innerHTML = '';
        
        if (json.options && json.options.length) {
            json.options.forEach((opt, idx) => {
                const el = document.createElement('div');
                el.className = 'option';
                el.innerHTML = `
                    <div><strong>Option ${idx+1}</strong></div> 
                    <div style="margin-top:6px; font-family: monospace;">${opt}</div> 
                    <div style="margin-top:8px"> 
                        <button data-opt="${encodeURIComponent(opt)}" class="copy">Copy</button> 
                    </div>`;
                container.appendChild(el);
            });
            
            // Add listeners for individual copy buttons
            document.querySelectorAll('.copy').forEach(btn => {
                btn.addEventListener('click', (e)=>{ 
                    const text = decodeURIComponent(btn.getAttribute('data-opt'));
                    navigator.clipboard.writeText(text);
                    btn.textContent = 'Copied!';
                    setTimeout(()=> btn.textContent = 'Copy', 1200);
                }); 
            });
        } else {
            container.innerHTML = `<p style="color:red;">Error or no options generated: ${json.error || 'Server returned empty response.'}</p>`;
        }
    } catch (e) {
        container.innerHTML = `<p style="color:red;">Network Error: Could not reach the server.</p>`;
    }
});

// Logic for Copy All Button
document.getElementById('copyAll').addEventListener('click', () => {
    const texts = Array.from(document.querySelectorAll('.option div:nth-child(2)')).map(d=>d.textContent.trim());
    if (texts.length) {
        navigator.clipboard.writeText(texts.join('\n\n---\n\n'));
        alert('All options copied to clipboard!');
    } else alert('No commit options generated yet.');
});