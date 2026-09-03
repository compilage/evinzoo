import React, { useState, useEffect } from 'react';
import { Service } from '../../types';

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveService: (service: Service) => void;
  serviceToEdit?: Service | null;
}

export const AddServiceModal: React.FC<AddServiceModalProps> = ({
  isOpen,
  onClose,
  onSaveService,
  serviceToEdit,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Catering' | 'Transport' | 'Staging & AV' | 'Security'>('Catering');
  const [price, setPrice] = useState<number>(500);
  const [priceUnit, setPriceUnit] = useState('/ event');
  const [status, setStatus] = useState<'Active' | 'Draft'>('Active');
  const [image, setImage] = useState('');

  useEffect(() => {
    if (serviceToEdit) {
      setTitle(serviceToEdit.title);
      setDescription(serviceToEdit.description);
      setCategory(serviceToEdit.category);
      setPrice(serviceToEdit.price);
      setPriceUnit(serviceToEdit.priceUnit);
      setStatus(serviceToEdit.status);
      setImage(serviceToEdit.image);
    } else {
      setTitle('');
      setDescription('');
      setCategory('Catering');
      setPrice(500);
      setPriceUnit('/ event');
      setStatus('Active');
      setImage('https://lh3.googleusercontent.com/aida-public/AB6AXuCwYMH9HcB6mFz7ZRYtgmV1JmxbIzCmViZz86FbPKw28KaNA1wEbtch1niqViQu04Y-9WSl0A67Hq4ff4j5c3kK8JHQjsqOpV_J1XyG52yJG_CUXNqLmo03KEv8TQXDX3nEHviG4J5dzbTlRThgbrgjG1iQL0rj1Z1dqJukUolf17tKQ3DL9giG46LVXFZKqEFtY4rrSZxtUIHK2jZmMn1z5nh7v6BUt2ZOfkRKFzeGRtusNy155SI');
    }
  }, [serviceToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newService: Service = {
      id: serviceToEdit ? serviceToEdit.id : `srv-${Date.now()}`,
      title,
      description,
      category,
      price: Number(price),
      priceUnit,
      status,
      image: image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvlvL1J_XynMp5hzx3m1k2ztRRnaPw6p6SrHbZHXa_g0b1eOgY6dOpjdM63bQXEe6aKYUB-bExuoEyAHRTiAL9cKR50Zdk2ECjvo7PKgFs9rwpVdJiwTqkCSirlmzS2bBb5L65K2D8Pp0yql_7hwAs1IBtUmd41KEAHcZCH6nUkgPp9MxaHTBjK0tmd4cC2FQxKo8KqiHkFphZsLm6eZAcAXrab-mi9PKrmymDQ0rJ214dYa3IIPU',
      rating: serviceToEdit?.rating || 5.0
    };
    onSaveService(newService);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest rounded-3xl max-w-lg w-full border border-outline-variant shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-modal-pop">
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface">
          <div>
            <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
              Service Catalog Management
            </span>
            <h3 className="font-title-md text-lg font-bold text-primary">
              {serviceToEdit ? 'Edit Service Package' : 'Create New Service Package'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-secondary hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-bold text-secondary uppercase mb-1">
              Package Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g. VIP Gala Beverage Service"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-secondary uppercase mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Catering">Catering</option>
                <option value="Transport">Transport</option>
                <option value="Staging & AV">Staging & AV</option>
                <option value="Security">Security</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-secondary uppercase mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Active">Active (Public)</option>
                <option value="Draft">Draft (Hidden)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-secondary uppercase mb-1">
                Base Price ($)
              </label>
              <input
                type="number"
                required
                min="10"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-secondary uppercase mb-1">
                Billing Unit
              </label>
              <select
                value={priceUnit}
                onChange={(e) => setPriceUnit(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="/ event">/ event</option>
                <option value="/ day">/ day</option>
                <option value="/ hr">/ hr</option>
                <option value="/ head">/ head</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-secondary uppercase mb-1">
              Description & Deliverables
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Detail what is included in this package..."
            ></textarea>
          </div>

          <div className="pt-2 border-t border-outline-variant flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 text-xs font-bold text-secondary bg-surface-container rounded-xl hover:bg-surface-container-high transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 text-xs font-bold text-on-primary bg-primary rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>{serviceToEdit ? 'Save Changes' : 'Publish Package'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
