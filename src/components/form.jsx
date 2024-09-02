import React, { useState } from "react";

const Form = () => {
    const [entries, setEntries] = useState([]);

    const handleSave = async () => {
        const domain = document.getElementById('Domain').value;
        const type = document.getElementById('Type').value;
        const data = document.getElementById('Data').value;

        const newEntry = { domain, type, data };

        try {
            const response = await fetch('http://localhost:3000/savedomain', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEntry),
            });

            if (response.ok) {
                const savedEntry = await response.json();
                // setEntries([...entries, savedEntry]);
            } else {
                console.error('Failed to save entry');
            }

        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleRetrieve = async () => {
        try {
            const response = await fetch('http://localhost:3000/getdomains');
            if (response.ok) {
                const records = await response.json();
                setEntries(records);
            } else {
                console.error('Failed to fetch entries');
            }
        } catch (error) {
            console.error('Error fetching entries:', error);
        }
    };

    return (
        <div className='Parent'>
            <div className='card'>
                <div className='header'>
                    <h1>DNS Server Configuration Tool</h1>
                </div>
                <div className='form'>
                    <div>
                        <label>Domain name</label>
                        <input type='text' id='Domain'></input>
                    </div>
                    <div>
                        <label>Type</label>
                        <select id='Type'>
                            <option value='A'>A</option>
                            <option value='NS'>NS</option>
                            <option value='CNAME'>CNAME</option>
                            <option value='PTR'>PTR</option>
                            <option value='MX'>MX</option>
                            <option value='TXT'>TXT</option>
                            <option value='AAAA'>AAAA</option>
                        </select>
                    </div>
                    <div>
                        <label>Data</label>
                        <input type='text' id='Data'></input>
                    </div>
                </div>
                <div>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleRetrieve}>Retrieve All</button>
                </div>
                <div>
                    <h4 style={{ marginBottom: '10px' }}>Saved Entries</h4>
                    <ul style={{ marginBottom: '10px' }}>
                        {entries.map((entry, index) => (
                            <li key={index} style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}>
                                <span>{`Domain: ${entry.hostname}`}</span>
                                <span>{`Type: ${entry.type}`}</span>
                                <span>{`Data: ${entry.data}`}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Form;
