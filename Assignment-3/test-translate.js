fetch('http://localhost:5000/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'Paracetamol reduces fever', targetLang: 'hi' })
})
    .then(res => res.json())
    .then(data => console.log('Hindi Translation:', data))
    .catch(err => console.error(err));

fetch('http://localhost:5000/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'Paracetamol reduces fever', targetLang: 'mr' })
})
    .then(res => res.json())
    .then(data => console.log('Marathi Translation:', data))
    .catch(err => console.error(err));
