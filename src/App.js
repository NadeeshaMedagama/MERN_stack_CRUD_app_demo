import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Save, X, Package } from 'lucide-react';

const API_URL = 'http://localhost:3000/api/items';

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const fetchItems = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      // Add validation:
      if (Array.isArray(data)) {
        setItems(data);
      } else {
        console.error('API did not return an array:', data);
        setItems([]);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setItems([]);
    }
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-blue-600 p-3 rounded-xl shadow-lg">
                <Package className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Item Manager</h1>
            <p className="text-gray-600">Manage your items with ease and efficiency</p>
          </div>

          {/* Add Item Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
            <div className="space-y-4" onSubmit={addItem}>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-2">
                    Add New Item
                  </label>
                  <input
                      id="itemName"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      placeholder="Enter item name..."
                      required
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addItem(e);
                        }
                      }}
                  />
                </div>
                <div className="flex items-end">
                  <button
                      onClick={addItem}
                      className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                    Add Item
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Your Items</h2>
              <p className="text-sm text-gray-600 mt-1">
                {items.length} {items.length === 1 ? 'item' : 'items'} total
              </p>
            </div>

            {items.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No items yet</h3>
                  <p className="text-gray-500">Add your first item to get started</p>
                </div>
            ) : (
                <ul className="divide-y divide-gray-200">
                  {items.map((item, index) => (
                      <li key={item._id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
                        {editingItemId === item._id ? (
                            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                              <div className="flex-1">
                                <input
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Edit item name..."
                                />
                              </div>
                              <div className="flex gap-2">
                                <button
                                    onClick={saveEdit}
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2 font-medium"
                                >
                                  <Save className="w-4 h-4" />
                                  Save
                                </button>
                                <button
                                    onClick={() => setEditingItemId(null)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2 font-medium"
                                >
                                  <X className="w-4 h-4" />
                                  Cancel
                                </button>
                              </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                                  #{index + 1}
                                </div>
                                <span className="text-gray-900 font-medium">{item.name}</span>
                              </div>
                              <div className="flex gap-2">
                                <button
                                    onClick={() => startEdit(item)}
                                    className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                                    title="Edit item"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => deleteItem(item._id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                    title="Delete item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                        )}
                      </li>
                  ))}
                </ul>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              Built with React and Tailwind CSS
            </p>
          </div>
        </div>
      </div>
  );
}

export default App;
