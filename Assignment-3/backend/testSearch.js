async function testSearch() {
    try {
        const res = await fetch('http://localhost:5000/api/medicine/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                brandName: 'Crocin',
                medicalProfile: {
                    allergies: [],
                    chronicDiseases: [],
                    currentMedications: []
                }
            })
        });
        const data = await res.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

testSearch();
