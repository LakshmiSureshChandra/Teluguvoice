'use client';
import { useState, useRef, useEffect } from 'react';

export default function ContactButton() {
  const [isOpen, setIsOpen] = useState({
    contact: false,
    about: false
  });
  const formRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        formRef.current &&
        buttonRef.current &&
        !formRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen({ contact: false, about: false });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, to: 'maheeneni@gmail.com' }),
      });
      setIsOpen({ contact: false, about: false });
      setFormData({ name: '', email: '', message: '' });
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Contact form submission failed:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
      <button
        onClick={() => setIsOpen({ contact: false, about: !isOpen.about })}
        className="bg-[#0c1b33] hover:bg-[#1a2942] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      <button
        ref={buttonRef}
        onClick={() => setIsOpen({ about: false, contact: !isOpen.contact })}
        className="bg-[#FF9933] hover:bg-[#FF8000] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </button>

      {isOpen.about && (
        <div ref={formRef} className="absolute bottom-20 right-0 w-96 animate-slideUp">
          <div className="bg-white rounded-2xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">About Telugu Voice</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Telugu Voice is your premier destination for Telugu entertainment and knowledge. We bring together the best of Telugu audiobooks, spiritual content, and fascinating facts.
              </p>
              <p>
                Our channels feature:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Shadow Madhubabu - Mystery and thriller audiobooks</li>
                <li>Voice of Maheedhar - Spiritual and devotional content</li>
                <li>Facts Hive - Knowledge sharing and interesting facts</li>
              </ul>
              <p className="italic text-gray-500 mt-4">
                &ldquo;Where tradition meets modern storytelling&rdquo;
              </p>
            </div>
            <button
              onClick={() => setIsOpen(prev => ({ ...prev, about: false }))}
              className="mt-6 w-full px-5 py-3 text-base font-medium text-white bg-[#0c1b33] hover:bg-[#1a2942] rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isOpen.contact && (
        <div ref={formRef} className="absolute bottom-20 right-0 w-96 animate-slideUp">
          <div className="bg-white rounded-2xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Us</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  required
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#FF9933] focus:ring-[#FF9933] py-3 px-4 text-base text-black"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  required
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#FF9933] focus:ring-[#FF9933] py-3 px-4 text-base text-black"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#FF9933] focus:ring-[#FF9933] py-3 px-4 text-base text-black"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen({ contact: false, about: false })}
                  className="px-5 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-3 text-base font-medium text-white bg-[#FF9933] hover:bg-[#FF8000] rounded-lg transition-colors"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}