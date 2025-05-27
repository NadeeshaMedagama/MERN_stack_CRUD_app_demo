import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'http://localhost:3000/api/items';

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const fetchItems = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addItem = async (e) => {
    e.preventDefault();
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    const newItem = await res.json();
    setItems([...items, newItem]);
    setName('');
  };

  const deleteItem = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    setItems(items.filter(item => item._id !== id));
  };

  const startEdit = (item) => {
    setEditingItemId(item._id);
    setEditingName(item.name);
  };

  const saveEdit = async () => {
    const res = await fetch(`${API_URL}/${editingItemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editingName }),
    });
    const updatedItem = await res.json();
    setItems(items.map(item => (item._id === updatedItem._id ? updatedItem : item)));
    setEditingItemId(null);
    setEditingName('');
  };

  return (
      <div className="container mt-5">
        <h1 className="mb-4">Item Manager</h1>

        <form onSubmit={addItem} className="mb-4">
          <div className="input-group">
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control"
                placeholder="Add new item"
                required
            />
            <button className="btn btn-primary" type="submit">Add</button>
          </div>
        </form>

        <ul className="list-group">
          {items.map(item => (
              <li key={item._id} className="list-group-item d-flex justify-content-between align-items-center">
                {editingItemId === item._id ? (
                    <>
                      <input
                          className="form-control me-2"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                      />
                      <button className="btn btn-success me-2" onClick={saveEdit}>Save</button>
                      <button className="btn btn-secondary" onClick={() => setEditingItemId(null)}>Cancel</button>
                    </>
                ) : (
                    <>
                      {item.name}
                      <div>
                        <button className="btn btn-warning btn-sm me-2" onClick={() => startEdit(item)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteItem(item._id)}>Delete</button>
                      </div>
                    </>
                )}
              </li>
          ))}
        </ul>
      </div>
  );
}

export default App;
