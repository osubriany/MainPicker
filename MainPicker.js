const classSpecs = {
    "Warrior": ["Arms", "Fury", "Protection"],
    "Mage": ["Arcane", "Fire", "Frost"],
    "Rogue": ["Assassination", "Outlaw", "Subtlety"],
    "Priest": ["Discipline", "Holy", "Shadow"],
    "Warlock": ["Affliction", "Demonology", "Destruction"],
    "Hunter": ["Beast Mastery", "Marksmanship", "Survival"],
    "Druid": ["Balance", "Feral", "Guardian", "Restoration"],
    "Shaman": ["Elemental", "Enhancement", "Restoration"],
    "Paladin": ["Holy", "Protection", "Retribution"],
    "Death Knight": ["Blood", "Frost", "Unholy"],
    "Monk": ["Brewmaster", "Mistweaver", "Windwalker"],
    "Demon Hunter": ["Havoc", "Vengeance", "Devourer"],
    "Evoker": ["Devastation", "Preservation", "Augmentation"]
};

document.getElementById('classSelect').addEventListener('change', function() {
    const selectedClass = this.value;
    const specSelect = document.getElementById('specSelect');
    const specLabel = document.querySelector('label[for="specSelect"]');
    if (selectedClass) {
        specLabel.style.display = 'block';
        specSelect.style.display = 'block';
        specSelect.innerHTML = '<option value="">Choose a spec</option>';
        if (classSpecs[selectedClass]) {
            classSpecs[selectedClass].forEach(spec => {
                const option = document.createElement('option');
                option.value = spec;
                option.textContent = spec;
                specSelect.appendChild(option);
            });
        }
    } else {
        specLabel.style.display = 'none';
        specSelect.style.display = 'none';
    }
});

function updateSpec(selectId, specId) {
    const selectedClass = document.getElementById(selectId).value;
    const specSelect = document.getElementById(specId);
    const specLabel = document.querySelector(`label[for="${specId}"]`);
    if (selectedClass) {
        specLabel.style.display = 'block';
        specSelect.style.display = 'block';
        specSelect.innerHTML = '<option value="">Choose a spec</option>';
        if (classSpecs[selectedClass]) {
            classSpecs[selectedClass].forEach(spec => {
                const option = document.createElement('option');
                option.value = spec;
                option.textContent = spec;
                specSelect.appendChild(option);
            });
        }
    } else {
        specLabel.style.display = 'none';
        specSelect.style.display = 'none';
    }
}

document.getElementById('additionalClass1').addEventListener('change', function() {
    updateSpec('additionalClass1', 'specSelect1');
});

document.getElementById('additionalClass2').addEventListener('change', function() {
    updateSpec('additionalClass2', 'specSelect2');
});

document.getElementById('saveButton').addEventListener('click', async function() {
    const name = document.getElementById('characterName').value || 'Unnamed';
    const selectedClass = document.getElementById('classSelect').value;
    const selectedSpec = document.getElementById('specSelect').value;
    const additionalClass1 = document.getElementById('additionalClass1').value;
    const spec1 = document.getElementById('specSelect1').value;
    const additionalClass2 = document.getElementById('additionalClass2').value;
    const spec2 = document.getElementById('specSelect2').value;

    let resultText = `<p>Character Created: <strong>${name}</strong>`;
    if (selectedClass && selectedSpec) {
        resultText += ` the <strong>${selectedSpec} ${selectedClass}</strong>`;
    }
    resultText += `</p>`;
    const additionalClasses = [];
    if (additionalClass1) {
        const specText = spec1 ? `${spec1} ` : '';
        additionalClasses.push(`${specText}${additionalClass1}`);
    }
    if (additionalClass2) {
        const specText = spec2 ? `${spec2} ` : '';
        additionalClasses.push(`${specText}${additionalClass2}`);
    }
    if (additionalClasses.length > 0) {
        resultText += `<p>Potential Classes: ${additionalClasses.join(', ')}</p>`;
    }
    document.getElementById('result').innerHTML = resultText;

    const mainClass = selectedClass && selectedSpec ? `${selectedSpec} ${selectedClass}` : '';

    try {
        const response = await fetch('/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                mainClass,
                additionalClasses
            })
        });
        if (response.ok) {
            alert('Character saved successfully!');
        } else {
            alert('Failed to save character.');
        }
    } catch (error) {
        alert('Error saving character: ' + error.message);
    }
});