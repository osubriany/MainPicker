document.addEventListener('DOMContentLoaded', loadCharacters);

const roleMap = {
    "Arms Warrior": "melee-dps",
    "Fury Warrior": "melee-dps",
    "Protection Warrior": "tank",
    "Arcane Mage": "ranged-dps",
    "Fire Mage": "ranged-dps",
    "Frost Mage": "ranged-dps",
    "Assassination Rogue": "melee-dps",
    "Outlaw Rogue": "melee-dps",
    "Subtlety Rogue": "melee-dps",
    "Discipline Priest": "healer",
    "Holy Priest": "healer",
    "Shadow Priest": "ranged-dps",
    "Affliction Warlock": "ranged-dps",
    "Demonology Warlock": "ranged-dps",
    "Destruction Warlock": "ranged-dps",
    "Beast Mastery Hunter": "ranged-dps",
    "Marksmanship Hunter": "ranged-dps",
    "Survival Hunter": "ranged-dps",
    "Balance Druid": "ranged-dps",
    "Feral Druid": "melee-dps",
    "Guardian Druid": "tank",
    "Restoration Druid": "healer",
    "Elemental Shaman": "ranged-dps",
    "Enhancement Shaman": "melee-dps",
    "Restoration Shaman": "healer",
    "Holy Paladin": "healer",
    "Protection Paladin": "tank",
    "Retribution Paladin": "melee-dps",
    "Blood Death Knight": "tank",
    "Frost Death Knight": "melee-dps",
    "Unholy Death Knight": "melee-dps",
    "Brewmaster Monk": "tank",
    "Mistweaver Monk": "healer",
    "Windwalker Monk": "melee-dps",
    "Havoc Demon Hunter": "melee-dps",
    "Vengeance Demon Hunter": "tank",
    "Devourer Demon Hunter": "ranged-dps",
    "Devastation Evoker": "ranged-dps",
    "Preservation Evoker": "healer",
    "Augmentation Evoker": "ranged-dps"
};

async function loadCharacters() {
    try {
        const response = await fetch('/characters');
        const characters = await response.json();
        
        // Calculate stats
        const stats = {
            tank: 0,
            healer: 0,
            "ranged-dps": 0,
            "melee-dps": 0
        };
        
        for (const [name, data] of Object.entries(characters)) {
            if (data.mainClass && roleMap[data.mainClass]) {
                const role = roleMap[data.mainClass];
                stats[role]++;
            }
        }
        
        // Display stats
        const statsDiv = document.getElementById('characterStats');
        statsDiv.innerHTML = `
            <div class="stat-card">
                <h3>Tanks</h3>
                <div class="count">${stats.tank}</div>
            </div>
            <div class="stat-card">
                <h3>Healers</h3>
                <div class="count">${stats.healer}</div>
            </div>
            <div class="stat-card">
                <h3>Ranged DPS</h3>
                <div class="count">${stats['ranged-dps']}</div>
            </div>
            <div class="stat-card">
                <h3>Melee DPS</h3>
                <div class="count">${stats['melee-dps']}</div>
            </div>
        `;
        
        const grid = document.getElementById('characterGrid');
        grid.innerHTML = '';
        for (const [name, data] of Object.entries(characters)) {
            const card = document.createElement('div');
            card.className = 'character-card';
            card.innerHTML = `<h3>${name}</h3>`;
            if (data.mainClass) {
                card.innerHTML += `<p>Main: ${data.mainClass}</p>`;
            }
            if (data.additionalClasses && data.additionalClasses.length > 0) {
                card.innerHTML += `<p>Additional: ${data.additionalClasses.join(', ')}</p>`;
            }
            grid.appendChild(card);
        }
    } catch (error) {
        console.error('Failed to load characters:', error);
    }
}
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

    let isDelete = false;
    let resultText = '';
    let additionalClasses = [];
    let mainClass = '';
    if (name.endsWith('-delete')) {
        isDelete = true;
        resultText = `<p>Character Deleted: <strong>${name.replace(/-delete$/, '')}</strong></p>`;
    } else {
        resultText = `<p>Character Created: <strong>${name}</strong>`;
        if (selectedClass && selectedSpec) {
            resultText += ` the <strong>${selectedSpec} ${selectedClass}</strong>`;
        }
        resultText += `</p>`;
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
        mainClass = selectedClass && selectedSpec ? `${selectedSpec} ${selectedClass}` : '';
    }
    document.getElementById('result').innerHTML = resultText;

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
            if (isDelete) {
                alert('Character deleted successfully!');
            } else {
                alert('Character saved successfully!');
            }
            loadCharacters(); // Reload the grid and stats
        } else {
            if (isDelete) {
                alert('Failed to delete character.');
            } else {
                alert('Failed to save character.');
            }
        }
    } catch (error) {
        if (isDelete) {
            alert('Error deleting character: ' + error.message);
        } else {
            alert('Error saving character: ' + error.message);
        }
    }
});